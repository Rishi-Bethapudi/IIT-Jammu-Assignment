import React from 'react';
import { Carrot } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="text-center py-12">
      <Carrot className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h2 className="text-xl font-semibold mb-2">Unable to load vegetables</h2>
      <p className="text-muted-foreground mb-6">{error}</p>
      <Button onClick={onRetry} variant="outline">
        Try Again
      </Button>
    </div>
  );
};

export default ErrorState;
