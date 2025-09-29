import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
  withCredentials: false,
});

// Request interceptor → attach access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    // 🔍 Debug
    console.debug("[Axios Request]", config.method?.toUpperCase(), config.url);
    if (token) {
      console.debug("[Axios Request] Attaching token:", token.slice(0, 20) + "...");
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.debug("[Axios Request] No token found in localStorage");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor → handle 401 & refresh
api.interceptors.response.use(
  (response) => {
    // Debug
    console.debug("[Axios Response]", response.config.url, response.status);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 🔍 Debug
    console.error("[Axios Error]", error.response?.status, error.response?.data);

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        console.debug("[Axios Refresh] Trying to refresh access token...");

        if (!refreshToken) {
          console.error("[Axios Refresh] No refresh token found");
          throw new Error("No refresh token");
        }

        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { refreshToken }
        );

        console.debug("[Axios Refresh] New access token received:", data.accessToken.slice(0, 20) + "...");
        localStorage.setItem("accessToken", data.accessToken);

        // retry with new token
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("[Axios Refresh] Failed to refresh token:", refreshError.message);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
