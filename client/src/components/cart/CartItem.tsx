import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { SquareMinus, Plus, Trash2 } from 'lucide-react';

export interface CartItemType {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartItemProps {
  item: CartItemType;
  updating?: boolean; // show "Updating..." and disable controls
  removing?: boolean; // show "Removing..." and disable remove button
  onChangeQuantity: (id: string, newQuantity: number) => void;
  onRemove: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  updating = false,
  removing = false,
  onChangeQuantity,
  onRemove,
}) => {
  const handleDecrease = () => {
    if (item.quantity > 1 && !updating) {
      onChangeQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (!updating) {
      onChangeQuantity(item.id, item.quantity + 1);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!Number.isNaN(val) && val >= 1 && !updating) {
      onChangeQuantity(item.id, val);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Image + name/price */}
          <div className="flex gap-4 flex-1">
            <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium line-clamp-2">{item.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                ${item.price.toFixed(2)} per unit
              </p>
              {updating && (
                <p className="text-xs text-muted-foreground mt-1">Updating…</p>
              )}
            </div>
          </div>

          {/* Quantity controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-8 h-8 p-0"
                onClick={handleDecrease}
                disabled={updating || item.quantity <= 1}
                aria-label="Decrease quantity"
              >
                <SquareMinus className="w-4 h-4" />
              </Button>

              <Input
                type="number"
                min={1}
                value={item.quantity}
                onChange={handleInput}
                disabled={updating}
                className="w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                aria-label="Quantity"
              />

              <Button
                variant="outline"
                size="sm"
                className="w-8 h-8 p-0"
                onClick={handleIncrease}
                disabled={updating}
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Line total */}
            <div className="text-right min-w-[80px]">
              <p className="font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>

            {/* Remove */}
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => onRemove(item.id)}
              disabled={removing}
            >
              {removing ? (
                'Removing…'
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-1" /> Remove
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartItem;
