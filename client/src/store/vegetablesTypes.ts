export interface Vegetable {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  unit: string;
  lowStock?: boolean;
  // add other fields as needed
}

export interface VegetablesState {
  items: Vegetable[];
  loading: boolean;
  error: string | null;
}
