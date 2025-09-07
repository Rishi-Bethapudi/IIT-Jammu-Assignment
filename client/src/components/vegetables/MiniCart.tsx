import { ShoppingCart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Props {
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
  onViewCart: () => void;
}

export default function MiniCart({
  cartItems,
  totalItems,
  totalPrice,
  onViewCart,
}: Props) {
  return (
    <div className="bg-card border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingCart className="w-5 h-5" />
        <h3 className="font-semibold">Cart ({totalItems})</h3>
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
            <span className="font-semibold">${totalPrice.toFixed(2)}</span>
          </div>

          <Button className="w-full" onClick={onViewCart}>
            View Cart
          </Button>
        </>
      )}
    </div>
  );
}
