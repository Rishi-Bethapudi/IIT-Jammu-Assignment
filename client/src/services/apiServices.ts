// src/services/apiServices.ts
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
}

// --- Auth APIs ---
export const registerUser = async (formData: RegisterFormData) => {
  const response = await apiClient.post("/auth/register", formData);
  return response.data;
};

export const loginUser = async (payload: LoginPayload) => {
  const response = await apiClient.post("/auth/login", payload, {
        withCredentials: true,
      });
      console.log('Login Response:', response);
  return response.data;
};

// --- Vegetables APIs ---
export const getVegetables = async () => {
  const response = await apiClient.get("/vegetables");
  return response.data;
};

// --- Cart APIs ---
export const addToCart = async (vegId: string, quantity: number) => {
  const response = await apiClient.post("/cart", { vegId, quantity });
  return response.data;
};

export const getCart = async () => {
  const response = await apiClient.get("/cart");
  return response.data;
};

export const placeOrder = async () => {
  const response = await apiClient.post("/orders");
  return response.data;
};
