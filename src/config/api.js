const USER_API_URL = import.meta.env.VITE_USER_API_URL || "http://localhost:4000";
const AWS_API_URL = import.meta.env.VITE_AWS_API_URL || "http://localhost:4001";
const DEFAULT_TENANT = "default";

export const API_PATHS = {
  auth: {
    signup: `${USER_API_URL}/auth/signup`,
    login: `${USER_API_URL}/auth/login`,
    refresh: `${USER_API_URL}/auth/refresh`,
    logout: `${USER_API_URL}/auth/logout`,
    logoutAll: `${USER_API_URL}/auth/logout/all`,
    profile: `${USER_API_URL}/auth/profile`,
    findByRole: (role) => `${USER_API_URL}/auth/find-by-role?role=${role}`,
  },
  user: {
    list: `${USER_API_URL}/users/list`,
    updateRole: (id) => `${USER_API_URL}/users/${id}/role`,
    suspend: (id) => `${USER_API_URL}/users/${id}/suspend`,
    activate: (id) => `${USER_API_URL}/users/${id}/activate`,
  },
  aws: {
    connect: `${AWS_API_URL}/connect/aws/connect`,
    list: (tenantId = DEFAULT_TENANT) =>
      `${AWS_API_URL}/connect/aws?tenantId=${tenantId}`,
    integrationStatus: (id, tenantId = DEFAULT_TENANT) =>
      `${AWS_API_URL}/connect/aws/${id}/status?tenantId=${tenantId}`,
    delete: (id, tenantId = DEFAULT_TENANT) =>
      `${AWS_API_URL}/connect/aws/${id}?tenantId=${tenantId}`,
    bootstrapLink: (saasAccountId, saasRoleName) =>
      `${AWS_API_URL}/connect/aws/bootstrap/link?saasAccountId=${saasAccountId}&saasRoleName=${saasRoleName}`,
    bootstrapTemplate: `${AWS_API_URL}/connect/aws/bootstrap/template`,
    bootstrapStatus: (id, tenantId = DEFAULT_TENANT) =>
      `${AWS_API_URL}/connect/aws/${id}/bootstrap/status?tenantId=${tenantId}`,
  },
};
