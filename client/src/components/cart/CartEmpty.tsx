import { ShoppingCart, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CartEmpty = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="w-32 h-32 mx-auto mb-8 bg-white rounded-full flex items-center justify-center shadow-sm border">
          <ShoppingCart className="w-16 h-16 text-gray-400" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Your cart is empty
        </h2>
        <p className="text-gray-600 text-lg mb-8">
          Looks like you haven't added any fresh vegetables to your cart yet.
        </p>
        <div className="space-y-3">
          <Button
            asChild
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-base"
          >
            <Link to="/vegetables">
              <ShoppingBag className="w-5 h-5 mr-3" />
              Browse Fresh Vegetables
            </Link>
          </Button>
          <div>
            <Link
              to="/"
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartEmpty;
