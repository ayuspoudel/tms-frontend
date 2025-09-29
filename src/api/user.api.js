import api from "./index";

export const listUsersApi = () => api.get("/user/list");
export const updateUserRoleApi = (id, role) =>
  api.patch(`/user/${id}/role`, { role });
export const suspendUserApi = (id) => api.patch(`/user/${id}/suspend`);
export const activateUserApi = (id) => api.patch(`/user/${id}/activate`);
