import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000", // l'URL de ton backend Express
});

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await API.post("/auth/register", data);
  return response.data;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const response = await API.post("/auth/login", data);
  return response.data;
};
