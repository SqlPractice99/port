import axios from "axios";

// Configure Axios globally
axios.defaults.baseURL = "http://localhost:8000/api";
axios.defaults.withCredentials = true; // ✅ Ensures cookies are sent

// Login function
export const login = async (username, password) => {
  await axios.get("/sanctum/csrf-cookie"); // ✅ Fetch CSRF token
  return axios.post("/login", { username, password });
};

// Fetch authenticated user
export const getUser = async () => {
  return axios.get("/user");
};