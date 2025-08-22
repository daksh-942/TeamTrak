import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URI}/api/v1`,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config.url;
    if (error.response?.status === 401 && !url.includes("login")) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
