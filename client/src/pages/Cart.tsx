// src/pages/Cart.tsx
import React, { useEffect, Suspense, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { toast } from 'sonner';
import CartEmpty from '@/components/cart/CartEmpty';
import CartItem from '@/components/cart/CartItem';
const CartSummary = React.lazy(() => import('@/components/cart/CartSummary'));
import { ShoppingCart } from 'lucide-react';
import {
  setCartItems,
  updateCartItemQuantity,
  removeFromCart,
} from '@/store/cartSlice';
import type { CartItem as CartItemType } from '@/components/cart/types';
import {
  getCart,
  updateCartItem,
  removeCartItem,
  placeOrder,
} from '@/services/apiServices';

const Cart: React.FC = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);

  // Fetch cart items on mount
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const data = await getCart();
        dispatch(setCartItems(data));
      } catch (err) {
        console.error('Failed to fetch cart', err);
        toast.error('Failed to load cart');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) fetchCart();
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <p className="text-center mt-12">Please log in to view your cart.</p>
    );
  }

  if (loading) return <p className="text-center mt-12">Loading cart...</p>;
  if (items.length === 0) return <CartEmpty />;

  // Cart calculations
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  // Handlers
  const handleQuantityChange = async (_id: string, newQuantity: number) => {
    const prevQuantity = items.find((item) => item._id === _id)?.quantity || 1;
    dispatch(updateCartItemQuantity({ _id, quantity: newQuantity })); // Optimistic update

    try {
      await updateCartItem(_id, newQuantity);
    } catch (err) {
      dispatch(updateCartItemQuantity({ _id, quantity: prevQuantity })); // rollback
      console.error('Failed to update quantity', err);
      toast.error('Failed to update quantity');
    }
  };

  const handleRemove = async (_id: string) => {
    const removedItem = items.find((item) => item._id === _id);
    if (!removedItem) return;

    dispatch(removeFromCart(_id)); // Optimistic remove

    try {
      await removeCartItem(_id);
    } catch (err) {
      dispatch(setCartItems([...items, removedItem])); // rollback
      console.error('Failed to remove item', err);
      toast.error('Failed to remove item');
    }
  };

  const handleCheckout = async () => {
    try {
      const result = await placeOrder();
      dispatch(setCartItems([])); // clear cart
      toast.success('Order placed successfully!');
      console.log('Order result:', result);
    } catch (err) {
      console.error('Failed to place order', err);
      toast.error('Failed to place order');
    }
  };

  const handleSaveCart = () => {
    toast.success('Cart saved (optional backend implementation)');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            Review your items and proceed to checkout
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Your Items ({items.length})
              </h2>
              <div className="space-y-4">
                {items.map((item: CartItemType) => (
                  <CartItem
                    key={`${item.name}-${item.price}`}
                    item={item}
                    onChangeQuantity={handleQuantityChange}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Suspense fallback={<div>Loading...</div>}>
              <CartSummary
                subtotal={subtotal}
                tax={tax}
                total={total}
                itemCount={items.length}
                isAuthenticated={isAuthenticated}
                onCheckout={handleCheckout}
                onSaveCart={handleSaveCart}
                isSaving={false}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
