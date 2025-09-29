// Generic helpers
export const getToken = (key = "accessToken") => {
  return localStorage.getItem(key);
};

export const setToken = (key = "accessToken", value) => {
  localStorage.setItem(key, value);
};

export const removeToken = (key = "accessToken") => {
  localStorage.removeItem(key);
};

// Convenience wrappers
export const getAccessToken = () => getToken("accessToken");
export const setAccessToken = (token) => setToken("accessToken", token);
export const removeAccessToken = () => removeToken("accessToken");

export const getRefreshToken = () => getToken("refreshToken");
export const setRefreshToken = (token) => setToken("refreshToken", token);
export const removeRefreshToken = () => removeToken("refreshToken");
