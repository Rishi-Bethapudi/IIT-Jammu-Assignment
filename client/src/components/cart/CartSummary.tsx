import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Shield, Lock, ArrowRight } from 'lucide-react';
import type { CartSummaryProps } from './types';

const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  tax,
  total,
  itemCount,
  isAuthenticated,
  onCheckout,
  onSaveCart,
  isSaving,
}) => {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Lock className="w-5 h-5 text-green-600" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Pricing Breakdown */}
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal ({itemCount} items)</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax estimate (8%)</span>
            <span className="font-medium">${tax.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="text-green-600">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Security Badge */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-3">
          <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span className="text-sm text-green-700">
            Secure checkout · Your data is protected
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onCheckout}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-base font-semibold"
            size="lg"
          >
            Proceed to Checkout
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <Button
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            asChild
          >
            <Link to="/vegetables">Continue Shopping</Link>
          </Button>

          {isAuthenticated && (
            <Button
              variant="ghost"
              className="w-full text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              onClick={onSaveCart}
              disabled={isSaving}
            >
              {isSaving ? 'Saving Cart...' : 'Save Cart for Later'}
            </Button>
          )}
        </div>

        {/* Additional Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>✓ Free shipping on orders over $50</p>
          <p>✓ 30-day money-back guarantee</p>
          <p>✓ Freshness guaranteed</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartSummary;
