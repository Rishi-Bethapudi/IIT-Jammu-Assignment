import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  ShoppingCart,
  ShoppingBag,
  Carrot,
  SquareMinus,
  ListPlus,
} from 'lucide-react';
import { setVegetables } from '@/store/vegetablesSlice';
import { addToCart } from '@/store/cartSlice';

interface Vegetable {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock?: number;
  lowStock?: boolean;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function Vegetables() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addingToCart, setAddingToCart] = useState<Record<string, boolean>>({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const vegetables = useSelector((state: any) => state.vegetables.items);
  const cartItems = useSelector((state: any) => state.cart.items);
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );

  useEffect(() => {
    fetchVegetables();
  }, []);

  const fetchVegetables = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/vegetables');
      dispatch(setVegetables(response.data));

      // Initialize quantities
      const initialQuantities: Record<string, number> = {};
      response.data.forEach((veg: Vegetable) => {
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
          id: vegetable.id,
          name: vegetable.name,
          price: vegetable.price,
          quantity,
          image: vegetable.image,
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
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-square bg-muted animate-pulse" />
                <CardHeader>
                  <div className="h-6 bg-muted rounded-md animate-pulse mb-2" />
                  <div className="h-4 bg-muted rounded-md animate-pulse w-3/4" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted rounded-md animate-pulse mb-4" />
                  <div className="flex gap-2">
                    <div className="h-10 bg-muted rounded-md animate-pulse flex-1" />
                    <div className="h-10 bg-muted rounded-md animate-pulse w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Carrot className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Unable to load vegetables
            </h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={fetchVegetables} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (!vegetables.length) {
    return (
      <section className="w-full">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              No vegetables available
            </h2>
            <p className="text-muted-foreground mb-6">
              We're currently restocking our fresh vegetables. Please check back
              soon!
            </p>
            <Button onClick={fetchVegetables}>Refresh</Button>
          </div>
        </div>
      </section>
    );
  }

  const MiniCart = ({ className = '' }: { className?: string }) => (
    <div className={`bg-card border rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <ShoppingCart className="w-5 h-5" />
        <h3 className="font-semibold">Cart ({getTotalItems()})</h3>
      </div>

      {cartItems.length === 0 ? (
        <p className="text-muted-foreground text-sm">Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-3 mb-4">
            {cartItems.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center gap-3 text-sm">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-10 h-10 rounded-md object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.name}</p>
                  <p className="text-muted-foreground">
                    {item.quantity}x ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
            {cartItems.length > 3 && (
              <p className="text-sm text-muted-foreground">
                +{cartItems.length - 3} more items
              </p>
            )}
          </div>

          <Separator className="mb-4" />

          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">Total:</span>
            <span className="font-semibold">${getTotalPrice().toFixed(2)}</span>
          </div>

          <Button className="w-full" onClick={() => navigate('/cart')}>
            View Cart
          </Button>
        </>
      )}
    </div>
  );

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
              {vegetables.map((vegetable) => (
                <Card
                  key={vegetable.id}
                  className="group overflow-hidden hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={vegetable.image}
                      alt={vegetable.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    {vegetable.lowStock && (
                      <Badge
                        variant="destructive"
                        className="absolute top-2 right-2"
                      >
                        Low Stock
                      </Badge>
                    )}
                  </div>

                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">{vegetable.name}</CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {vegetable.description}
                    </p>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-primary">
                        ${vegetable.price.toFixed(2)}
                      </span>
                      <span className="text-muted-foreground ml-1">each</span>
                    </div>

                    <div className="flex gap-2">
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() =>
                            handleQuantityChange(
                              vegetable.id,
                              (quantities[vegetable.id] || 1) - 1
                            )
                          }
                          disabled={quantities[vegetable.id] <= 1}
                        >
                          <SquareMinus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={quantities[vegetable.id] || 1}
                          onChange={(e) =>
                            handleQuantityChange(
                              vegetable.id,
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="h-8 w-16 border-0 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() =>
                            handleQuantityChange(
                              vegetable.id,
                              (quantities[vegetable.id] || 1) + 1
                            )
                          }
                        >
                          <ListPlus className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button
                        onClick={() => handleAddToCart(vegetable)}
                        disabled={addingToCart[vegetable.id]}
                        className="flex-1"
                      >
                        {addingToCart[vegetable.id]
                          ? 'Adding...'
                          : 'Add to Cart'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Desktop Mini Cart */}
          <div className="hidden xl:block w-80 shrink-0">
            <div className="sticky top-24">
              <MiniCart />
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
                <MiniCart />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </section>
  );
}
