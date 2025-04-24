import axios from "axios";

const apiAuth = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export default apiAuth;
