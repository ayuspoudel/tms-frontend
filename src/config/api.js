const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const API_PATHS = {
  auth: {
    signup: `${API_URL}/auth/signup`,
    login: `${API_URL}/auth/login`,
    refresh: `${API_URL}/auth/refresh`,
    logout: `${API_URL}/auth/logout`,
    logoutAll: `${API_URL}/auth/logout/all`,
    profile: `${API_URL}/auth/profile`,
    findByRole: (role) => `${API_URL}/auth/find-by-role?role=${role}`,
  },
  user: {
    list: `${API_URL}/users/list`,
    updateRole: (id) => `${API_URL}/users/${id}/role`,
    suspend: (id) => `${API_URL}/users/${id}/suspend`,
    activate: (id) => `${API_URL}/users/${id}/activate`,
  },
};
