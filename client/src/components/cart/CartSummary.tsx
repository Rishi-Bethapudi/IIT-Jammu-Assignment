import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface Props {
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
  isAuthenticated: boolean;
  onCheckout: () => void;
  onSaveCart: () => void;
  isSaving: boolean;
}

export default function CartSummary({
  subtotal,
  tax,
  total,
  itemCount,
  isAuthenticated,
  onCheckout,
  onSaveCart,
  isSaving,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Subtotal ({itemCount} items)</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax estimate</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-2 pt-4">
          <Button onClick={onCheckout} className="w-full bg-primary" size="lg">
            Proceed to Checkout
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link to="/vegetables">Continue Shopping</Link>
          </Button>
          {isAuthenticated && (
            <Button
              variant="ghost"
              className="w-full"
              onClick={onSaveCart}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Cart'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
