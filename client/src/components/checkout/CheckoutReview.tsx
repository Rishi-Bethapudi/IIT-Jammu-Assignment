import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ReceiptText } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function CheckoutReview({ cart }: { cart: CartItem[] }) {
  return (
    <Card className="bg-card border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ReceiptText className="w-5 h-5" /> Order Review
        </CardTitle>
      </CardHeader>
      <CardContent>
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-3 border-b border-border last:border-0"
          >
            <div>
              <h4 className="font-medium">{item.name}</h4>
              <p className="text-sm text-muted-foreground">
                ${item.price.toFixed(2)} each
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm">Qty: {item.quantity}</span>
              <span className="font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
