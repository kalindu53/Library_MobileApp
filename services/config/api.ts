import axios from "axios"

const api = axios.create({
  baseURL: process.env.EXPO_BASE_API_URL,
  timeout: 10000
})

api.interceptors.request.use((config) => {
  // example: add token to header
//   config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  return Promise.reject(error);
});

export default api

// accesstoken - 1h 
// refreshtoken - 7d