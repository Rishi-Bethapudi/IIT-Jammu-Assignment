import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import CartEmpty from '@/components/cart/CartEmpty';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';

export default function Cart() {
  const { items } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (items.length === 0) return <CartEmpty />;

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        {items.map((item) => (
          <CartItem key={item.id} {...item} />
        ))}
      </div>
      <div className="lg:col-span-1 sticky top-8">
        <CartSummary
          subtotal={subtotal}
          tax={tax}
          total={total}
          itemCount={items.length}
          isAuthenticated={isAuthenticated}
          onCheckout={() => console.log('checkout')}
          onSaveCart={() => console.log('save')}
          isSaving={false}
        />
      </div>
    </div>
  );
}
