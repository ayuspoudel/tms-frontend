import api from "./index";
import { API_PATHS } from "../config/api";

// User APIs
export const listUsersApi = () => api.get(API_PATHS.user.list);
export const updateUserRoleApi = (id, role) =>
  api.patch(API_PATHS.user.updateRole(id), { role });
export const suspendUserApi = (id) => api.patch(API_PATHS.user.suspend(id));
export const activateUserApi = (id) => api.patch(API_PATHS.user.activate(id));
