import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  subtotal: number;
  tax: number;
  delivery: number;
  total: number;
  isSubmitting: boolean;
  onSubmit: () => void;
  onBack: () => void;
}

export default function CheckoutSummary({
  subtotal,
  tax,
  delivery,
  total,
  isSubmitting,
  onSubmit,
}: Props) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (8%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery</span>
          <span>{delivery === 0 ? 'Free' : `$${delivery.toFixed(2)}`}</span>
        </div>
        {delivery === 0 && (
          <p className="text-xs text-green-600">
            Free delivery on orders over $50!
          </p>
        )}
      </div>

      <Separator />

      <div className="flex justify-between text-lg font-semibold">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      <div className="space-y-3 pt-2">
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              Place Order
            </>
          )}
        </Button>

        <Button
          onClick={() => navigate('/cart')}
          variant="outline"
          className="w-full"
          disabled={isSubmitting}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Back to Cart
        </Button>
      </div>
    </div>
  );
}
