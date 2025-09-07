export interface Vegetable {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock?: number;
  lowStock?: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface VegetablesState {
  items: Vegetable[];
  loading: boolean;
  error: string | null;
}

export interface CartState {
  items: CartItem[];
}

export interface AuthState {
  isAuthenticated: boolean;
}