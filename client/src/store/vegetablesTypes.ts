export interface Vegetable {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category?: string;
  images: { url: string; public_id?: string }[];
}

export interface VegetablesState {
  items: Vegetable[];
  loading: boolean;
  error: string | null;
}
