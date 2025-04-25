// src/utils/api.js
import axios from "axios";

export const BASE_URL = "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: BASE_URL, // ✅ change to your backend URL
  headers: {
    "Content-Type": "application/json",
    Accept: "*",
  },
  timeout: 10000,
  withCredentials: true,
});

// 👉 GET request
export const get = async (url, config = {}) => {
  const response = await axiosInstance.get(url, config);
  return response.data;
};

// 👉 POST request
export const post = async (url, data = {}, config = {}) => {
  const response = await axiosInstance.post(url, data, config);
  return response.data;
};

export default axiosInstance;
