import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { setVegetables } from '@/store/vegetablesSlice';
import { addToCart } from '@/store/cartSlice';
import type { Vegetable, CartItem } from '../components/vegetables/types';
import VegetableCard from '../components/vegetables/VegetableCard';
import MiniCart from '../components/vegetables/MiniCart';
import LoadingState from '../components/vegetables/LoadingState';
import ErrorState from '../components/vegetables/ErrorState';
import EmptyState from '../components/vegetables/EmptyState';
import { getVegetables } from '@/services/apiServices';
const VegetablesPage: React.FC = () => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addingToCart, setAddingToCart] = useState<Record<string, boolean>>({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const vegetables = useSelector((state: any) => state.vegetables.items);
  const cartItems = useSelector((state: any) => state.cart.items);
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVegetables();
  }, []);

  const fetchVegetables = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getVegetables();

      // Check the actual response structure
      console.log('API Response:', response);

      // The vegetables data might be in response.data directly or nested
      const vegetablesData = response.data || response;

      // Transform the data to match your expected format
      const transformedVegetables = vegetablesData.map((veg: any) => ({
        id: veg._id || veg.id, // Use _id from API as id
        name: veg.name,
        description: veg.description,
        price: veg.finalPrice || veg.price,
        image: veg.images?.[0]?.url || '', // Use first image
        stock: veg.stock,
        lowStock: veg.stock < 20, // Example threshold for low stock
        unit: veg.unit,
      }));

      dispatch(setVegetables(transformedVegetables));

      // Initialize quantities
      const initialQuantities: Record<string, number> = {};
      transformedVegetables.forEach((veg: Vegetable) => {
        initialQuantities[veg.id] = 1;
      });
      setQuantities(initialQuantities);
    } catch (err) {
      setError('Failed to load vegetables. Please try again.');
      console.error('Error fetching vegetables:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (vegetableId: string, quantity: number) => {
    if (quantity < 1) return;
    setQuantities((prev) => ({
      ...prev,
      [vegetableId]: quantity,
    }));
  };

  const handleAddToCart = async (vegetable: Vegetable) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to your cart');
      navigate('/login');
      return;
    }

    setAddingToCart((prev) => ({ ...prev, [vegetable.id]: true }));

    try {
      const quantity = quantities[vegetable.id] || 1;

      // Optimistic update
      dispatch(
        addToCart({
          _id: vegetable._id,
          name: vegetable.name,
          price: vegetable.price,
          quantity,
          images: (vegetable as any).image || vegetable.images?.[0]?.url || '',
        })
      );

      // Optional: Sync with backend
      try {
        await axios.post('/api/cart', {
          vegetableId: vegetable.id,
          quantity,
        });
      } catch (serverError) {
        console.warn('Failed to sync cart with server:', serverError);
        // Could implement rollback here if needed
      }

      toast.success(`Added ${quantity}x ${vegetable.name} to cart`);
    } catch (err) {
      toast.error('Failed to add item to cart');
      console.error('Error adding to cart:', err);
    } finally {
      setAddingToCart((prev) => ({ ...prev, [vegetable.id]: false }));
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce(
      (total: number, item: CartItem) => total + item.quantity,
      0
    );
  };

  const getTotalPrice = (): number => {
    return cartItems.reduce(
      (total: number, item: CartItem) => total + item.price * item.quantity,
      0
    );
  };

  if (loading) {
    return (
      <section className="w-full">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="h-8 bg-muted rounded-md w-48 mb-4 animate-pulse" />
            <div className="h-4 bg-muted rounded-md w-96 animate-pulse" />
          </div>
          <LoadingState />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full">
        <div className="container mx-auto px-4 py-8">
          <ErrorState error={error} onRetry={fetchVegetables} />
        </div>
      </section>
    );
  }

  if (!vegetables.length) {
    return (
      <section className="w-full">
        <div className="container mx-auto px-4 py-8">
          <EmptyState onRefresh={fetchVegetables} />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Fresh Vegetables</h1>
          <p className="text-muted-foreground max-w-2xl">
            Discover our selection of fresh, locally-sourced vegetables. From
            crisp lettuce to vibrant carrots, we have everything you need for
            healthy, delicious meals.
          </p>
        </div>

        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vegetables.map((vegetable: Vegetable) => (
                <VegetableCard
                  key={vegetable.id}
                  vegetable={vegetable}
                  quantity={quantities[vegetable.id] || 1}
                  addingToCart={addingToCart[vegetable.id] || false}
                  onQuantityChange={handleQuantityChange}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </div>

          {/* Desktop Mini Cart */}
          <div className="hidden xl:block w-80 shrink-0">
            <div className="sticky top-24">
              <MiniCart
                cartItems={cartItems}
                totalItems={getTotalItems()}
                totalPrice={getTotalPrice()}
                onViewCart={() => navigate('/cart')}
              />
            </div>
          </div>
        </div>

        {/* Mobile Mini Cart */}
        <div className="xl:hidden fixed bottom-4 right-4 z-50">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="lg" className="rounded-full shadow-lg">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Cart ({getTotalItems()})
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[400px]">
              <SheetHeader>
                <SheetTitle>Shopping Cart</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <MiniCart
                  cartItems={cartItems}
                  totalItems={getTotalItems()}
                  totalPrice={getTotalPrice()}
                  onViewCart={() => navigate('/cart')}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </section>
  );
};

export default VegetablesPage;
