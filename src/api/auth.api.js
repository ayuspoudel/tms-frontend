import api from "./index";

// Auth APIs
export const loginApi = (payload) => api.post("/auth/login", payload);
export const signupApi = (payload) => api.post("/auth/signup", payload);
export const logoutApi = () => api.post("/auth/logout");
export const logoutAllApi = () => api.post("/auth/logout/all");
export const refreshApi = () => api.post("/auth/refresh");
export const profileApi = () => api.get("/auth/profile");
export const findByRoleApi = (role) => api.get(`/auth/find-by-role?role=${role}`);
