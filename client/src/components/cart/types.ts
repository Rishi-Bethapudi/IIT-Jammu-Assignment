// types/cart.ts
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock?: number;
  unit?: string;
}

export interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

export interface CartSummaryProps {
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
  isAuthenticated: boolean;
  onCheckout: () => void;
  onSaveCart: () => void;
  isSaving: boolean;
}

export interface CartItemProps {
  item: CartItem;
  updating?: boolean;
  removing?: boolean;
  onChangeQuantity: (id: string, newQuantity: number) => void;
  onRemove: (id: string) => void;
}