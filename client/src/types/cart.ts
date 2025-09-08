export interface CartItem {
  _id: string;        // MongoDB ID from API
  id: string;         // For component compatibility (same as _id)
  name: string;
  price: number;
  quantity: number;
  image?: string;
  stock?: number;
  unit?: string;
}

export interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

export interface CartItemProps {
  item: CartItem;
  updating?: boolean;
  removing?: boolean;
  onChangeQuantity: (id: string, newQuantity: number) => void;
  onRemove: (id: string) => void;
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