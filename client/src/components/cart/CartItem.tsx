import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItemProps } from './types';

const CartItem: React.FC<CartItemProps> = ({
  item,
  updating = false,
  removing = false,
  onChangeQuantity,
  onRemove,
}) => {
  const [imageError, setImageError] = useState(false);

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
    <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Image */}
          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={
                imageError
                  ? 'https://via.placeholder.com/80x80?text=No+Image'
                  : item.image
              }
              alt={item.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 line-clamp-2">
              {item.name}
            </h3>
            <p className="text-green-600 font-medium mt-1">
              ${item.price.toFixed(2)}
              <span className="text-gray-500 text-sm ml-1">each</span>
            </p>
            {updating && (
              <p className="text-xs text-gray-500 mt-1">Updating…</p>
            )}
          </div>

          {/* Quantity Controls */}
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-8 h-8 p-0 rounded-full"
                onClick={handleDecrease}
                disabled={updating || item.quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </Button>

              <Input
                type="number"
                min={1}
                value={item.quantity}
                onChange={handleInput}
                disabled={updating}
                className="w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-gray-300"
                aria-label="Quantity"
              />

              <Button
                variant="outline"
                size="sm"
                className="w-8 h-8 p-0 rounded-full"
                onClick={handleIncrease}
                disabled={updating}
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>

            {/* Line Total and Remove */}
            <div className="flex items-center gap-4">
              <p className="font-semibold text-gray-900 text-sm">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2"
                onClick={() => onRemove(item.id)}
                disabled={removing}
              >
                {removing ? 'Removing…' : <Trash2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartItem;
