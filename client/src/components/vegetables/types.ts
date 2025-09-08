// /components/vegetable/types.ts

export interface VegetableImage {
  url: string;
  public_id: string;
  _id: string;
  id: string;
}

export interface Vegetable {
  _id: string;                // MongoDB ID
  id: string;                 // same as _id, sometimes used in frontend
  name: string;
  description: string;
  price: number;
  discount: number;
  finalPrice: number;
  stock: number;
  unit: string;                // e.g. "kg"
  images: VegetableImage[];    // array of image objects
  category: string;            // e.g. "Vegetables"
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;

  // frontend-only (derived props)
  lowStock?: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string; // usually the first image url
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
