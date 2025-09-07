import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onRefresh: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onRefresh }) => {
  return (
    <div className="text-center py-12">
      <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h2 className="text-xl font-semibold mb-2">No vegetables available</h2>
      <p className="text-muted-foreground mb-6">
        We're currently restocking our fresh vegetables. Please check back soon!
      </p>
      <Button onClick={onRefresh}>Refresh</Button>
    </div>
  );
};

export default EmptyState;
