import api from "./index";
import { API_PATHS } from "../config/api";

// Auth APIs
export const signupApi = (payload) => api.post(API_PATHS.auth.signup, payload);
export const loginApi = (payload) => api.post(API_PATHS.auth.login, payload);
export const refreshApi = (payload) => api.post(API_PATHS.auth.refresh, payload);
export const logoutApi = (payload) => api.post(API_PATHS.auth.logout, payload);
export const logoutAllApi = (payload) => api.post(API_PATHS.auth.logoutAll, payload);
export const profileApi = () => api.get(API_PATHS.auth.profile);
export const findByRoleApi = (role) => api.get(API_PATHS.auth.findByRole(role));
