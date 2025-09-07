// src/utils/apiService.ts
import apiClient from "./apiClient";

// --- Auth APIs ---
export const registerUser = async (formData: any) => {
  const response = await apiClient.post("/auth/register", formData);
  return response.data;
};

export const loginUser = async (email: string, password: string) => {
  const response = await apiClient.post("/auth/login", { email, password });
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
