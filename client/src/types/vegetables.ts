export interface Vegetable {
  _id: string;
  id: string;
  name: string;
  description: string;
  price: number;
  images: { url: string; public_id?: string }[];
  stock?: number;
  lowStock?: boolean;
  unit?: string;
  category?: string;
  isAvailable?: boolean;
  discount?: number;
  finalPrice?: number;
}

export interface VegetablesState {
  items: Vegetable[];
  loading: boolean;
  error: string | null;
}

export interface VegetablesResponse {
  data: Vegetable[];
  success: boolean;
  message?: string;
}