import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SquareMinus, ListPlus } from 'lucide-react';
import { Vegetable } from './types';

interface Props {
  vegetable: Vegetable;
  quantity: number;
  onQuantityChange: (id: string, quantity: number) => void;
  onAddToCart: (veg: Vegetable) => void;
  adding: boolean;
}

export default function VegetableCard({
  vegetable,
  quantity,
  onQuantityChange,
  onAddToCart,
  adding,
}: Props) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="aspect-square relative overflow-hidden">
        <img
          src={vegetable.image}
          alt={vegetable.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        {vegetable.lowStock && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Low Stock
          </Badge>
        )}
      </div>

      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{vegetable.name}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {vegetable.description}
        </p>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="mb-4">
          <span className="text-2xl font-bold text-primary">
            ${vegetable.price.toFixed(2)}
          </span>
          <span className="text-muted-foreground ml-1">each</span>
        </div>

        <div className="flex gap-2">
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onQuantityChange(vegetable.id, quantity - 1)}
              disabled={quantity <= 1}
            >
              <SquareMinus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) =>
                onQuantityChange(vegetable.id, parseInt(e.target.value) || 1)
              }
              className="h-8 w-16 border-0 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onQuantityChange(vegetable.id, quantity + 1)}
            >
              <ListPlus className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={() => onAddToCart(vegetable)}
            disabled={adding}
            className="flex-1"
          >
            {adding ? 'Adding...' : 'Add to Cart'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
