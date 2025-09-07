import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EmptyVegetables({
  onRefresh,
}: {
  onRefresh: () => void;
}) {
  return (
    <section className="w-full">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            No vegetables available
          </h2>
          <p className="text-muted-foreground mb-6">
            We're currently restocking our fresh vegetables. Please check back
            soon!
          </p>
          <Button onClick={onRefresh}>Refresh</Button>
        </div>
      </div>
    </section>
  );
}
