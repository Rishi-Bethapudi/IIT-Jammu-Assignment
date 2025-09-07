import { Carrot } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function VegetablesError({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <section className="w-full">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Carrot className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            Unable to load vegetables
          </h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={onRetry} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    </section>
  );
}
