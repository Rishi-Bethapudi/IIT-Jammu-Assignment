import apiClient from "./apiClient";

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  pincode: string;
  agreesToTerms: boolean;
  agreesToMarketing: boolean;
}

interface LoginPayload {
  email: string;
  password: string;
  rememberMe: boolean;
}

// --- Auth APIs ---
export const registerUser = async (formData: RegisterFormData) => {
  const response = await apiClient.post("/auth/register", formData);
  return response.data;
};

export const loginUser = async (payload: LoginPayload) => {
  const response = await apiClient.post("/auth/login", payload);
  // Save userId in localStorage temporarily
  const { user } = response.data;
  localStorage.setItem("userId", user._id);
  return { user };
};

// --- Vegetables APIs ---
export const getVegetables = async () => {
  const response = await apiClient.get("/vegetables");
  return response.data;
};

// --- Cart APIs (TEMP: pass userId manually) ---
export const addToCart = async (vegetableId: string, quantity: number) => {
  const userId = localStorage.getItem("userId");
  const response = await apiClient.post("/cart", { userId, vegetableId, quantity });
  return response.data;
};

export const getCart = async () => {
  const userId = localStorage.getItem("userId");
  const response = await apiClient.get("/cart", { params: { userId } });
  return response.data;
};

export const updateCartItem = async (cartItemId: string, quantity: number) => {
  const userId = localStorage.getItem("userId");
  const response = await apiClient.put(`/cart/${cartItemId}`, { userId, quantity });
  return response.data;
};

export const removeCartItem = async (cartItemId: string) => {
  const userId = localStorage.getItem("userId");
  const response = await apiClient.delete(`/cart/${cartItemId}`, { params: { userId } });
  return response.data;
};

// --- Orders API ---
export const placeOrder = async () => {
  const userId = localStorage.getItem("userId");
  const response = await apiClient.post("/orders", { userId });
  return response.data;
};
