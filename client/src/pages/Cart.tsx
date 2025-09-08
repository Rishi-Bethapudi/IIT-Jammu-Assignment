import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import React, { Suspense } from 'react';
import CartEmpty from '@/components/cart/CartEmpty';
import CartItem from '@/components/cart/CartItem';
const CartSummary = React.lazy(() => import('@/components/cart/CartSummary'));
import { ShoppingCart } from 'lucide-react';
import { updateCartItemQuantity, removeFromCart } from '@/store/cartSlice';
import type { CartItem as CartItemType } from '../components/cart/types';

const Cart = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (items.length === 0) return <CartEmpty />;

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleQuantityChange = (_id: string, newQuantity: number) => {
    dispatch(updateCartItemQuantity({ _id, quantity: newQuantity }));
  };

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleCheckout = () => {
    console.log('Proceeding to checkout');
    // Add your checkout logic here
  };

  const handleSaveCart = () => {
    console.log('Saving cart');
    // Add your save cart logic here
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
                    key={item._id}
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
