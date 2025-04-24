import axios from "axios";

const apiAuth = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL,
  withCredentials: true,
});

export default apiAuth;
