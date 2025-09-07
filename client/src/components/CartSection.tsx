"use client";

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, ShoppingBag, SquareMinus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { updateQuantity, removeFromCart } from '@/store/cartSlice';
import type { RootState, AppDispatch } from '@/store';

// Types
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CartSection() {
  const dispatch = useDispatch<AppDispatch>();
  const { items } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const [quantityErrors, setQuantityErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const handleQuantityChange = useCallback(async (itemId: string, newQuantity: number) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    // Clear previous error
    setQuantityErrors(prev => ({ ...prev, [itemId]: '' }));

    // Validate quantity
    if (newQuantity < 1) {
      setQuantityErrors(prev => ({ ...prev, [itemId]: 'Quantity must be at least 1' }));
      return;
    }

    // Update Redux state immediately
    dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));

    // Show loading state
    setUpdatingItems(prev => new Set(prev).add(itemId));

    try {
      // Optional server sync
      const response = await fetch('/api/cart', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId, quantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error('Failed to update cart');
      }

      toast.success('Cart updated');
    } catch (error) {
      // Rollback on error
      dispatch(updateQuantity({ id: itemId, quantity: item.quantity }));
      toast.error('Failed to update cart. Please try again.');
      console.error('Cart update error:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  }, [items, dispatch]);

  const handleRemoveItem = useCallback(async (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    setRemovingItems(prev => new Set(prev).add(itemId));

    try {
      // Update Redux immediately
      dispatch(removeFromCart(itemId));

      // Optional server sync
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove item');
      }

      toast.success(`${item.name} removed from cart`);
    } catch (error) {
      // Could rollback here if needed
      toast.error('Failed to remove item. Please try again.');
      console.error('Remove item error:', error);
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  }, [items, dispatch]);

  const handleSaveCart = useCallback(async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to save your cart');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        throw new Error('Failed to save cart');
      }

      toast.success('Cart saved successfully');
    } catch (error) {
      toast.error('Failed to save cart. Please try again.');
      console.error('Save cart error:', error);
    } finally {
      setIsSaving(false);
    }
  }, [items, isAuthenticated]);

  const handleCheckout = useCallback(() => {
    if (!isAuthenticated) {
      toast.error('Please log in to proceed to checkout');
      window.location.href = '/login';
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    window.location.href = '/checkout';
  }, [isAuthenticated, items.length]);

  // Empty cart state
  if (items.length === 0) {
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
            <Link href="/vegetables">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Browse Vegetables
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">Shopping Cart</h1>
        <p className="text-muted-foreground">
          Review your items and proceed to checkout when ready.
        </p>
      </div>

      {globalError && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive text-sm">{globalError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Cart Items ({items.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {items.map((item, index) => (
                  <div key={item.id} className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Item Image & Info */}
                      <div className="flex gap-4 flex-1">
                        <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium hover:text-primary transition-colors line-clamp-2">
                            {item.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            ${item.price.toFixed(2)} per unit
                          </p>
                        </div>
                      </div>

                      {/* Quantity & Controls */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-8 h-8 p-0"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={updatingItems.has(item.id) || item.quantity <= 1}
                            >
                              <SquareMinus className="w-4 h-4" />
                            </Button>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (!isNaN(value)) {
                                  handleQuantityChange(item.id, value);
                                }
                              }}
                              className="w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              disabled={updatingItems.has(item.id)}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-8 h-8 p-0"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={updatingItems.has(item.id)}
                            >
                              +
                            </Button>
                          </div>
                          {quantityErrors[item.id] && (
                            <p className="text-xs text-destructive mt-1">
                              {quantityErrors[item.id]}
                            </p>
                          )}
                          {updatingItems.has(item.id) && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Updating...
                            </p>
                          )}
                        </div>

                        {/* Line Total */}
                        <div className="text-right min-w-[80px]">
                          <p className="font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={removingItems.has(item.id)}
                        >
                          {removingItems.has(item.id) ? 'Removing...' : 'Remove'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({items.length} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax estimate</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                  >
                    Proceed to Checkout
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                  >
                    <Link href="/vegetables">
                      Continue Shopping
                    </Link>
                  </Button>
                  {isAuthenticated && (
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={handleSaveCart}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save Cart'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <div className="mt-6 text-sm text-muted-foreground space-y-2">
              <p>✓ Free delivery on orders over $50</p>
              <p>✓ Fresh vegetables, delivered daily</p>
              <p>✓ 100% satisfaction guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}