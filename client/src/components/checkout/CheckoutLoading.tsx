'use client';

import { Card, CardContent } from '@/components/ui/card';

export default function CheckoutLoading() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="bg-card border border-border">
        <CardContent className="py-12 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">
            Processing your order...
          </h3>
          <p className="text-muted-foreground">
            Sending receipt and confirming your order
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
