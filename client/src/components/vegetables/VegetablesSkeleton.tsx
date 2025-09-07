import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function VegetablesSkeleton() {
  return (
    <section className="w-full">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-8 bg-muted rounded-md w-48 mb-4 animate-pulse" />
          <div className="h-4 bg-muted rounded-md w-96 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-square bg-muted animate-pulse" />
              <CardHeader>
                <div className="h-6 bg-muted rounded-md animate-pulse mb-2" />
                <div className="h-4 bg-muted rounded-md animate-pulse w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded-md animate-pulse mb-4" />
                <div className="flex gap-2">
                  <div className="h-10 bg-muted rounded-md animate-pulse flex-1" />
                  <div className="h-10 bg-muted rounded-md animate-pulse w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
