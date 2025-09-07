import { ShoppingCart, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function CartEmpty() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
          <ShoppingCart className="w-12 h-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-semibold mb-3">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">
          Start shopping to add some fresh vegetables to your cart.
        </p>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link to="/vegetables">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Browse Vegetables
          </Link>
        </Button>
      </div>
    </div>
  );
}
