import { defineStore } from "pinia";
import {
  loginApi,
  signupApi,
  logoutApi,
  logoutAllApi,
  refreshApi,
  profileApi,
} from "../api/auth.api";
import {
  getAccessToken,
  setAccessToken,
  removeAccessToken,
  getRefreshToken,
  setRefreshToken,
  removeRefreshToken,
} from "../utils/token";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    accessToken: getAccessToken(),
    refreshToken: getRefreshToken(),
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
  },

  actions: {
    async login(payload) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await loginApi(payload);
        this.user = data.user;

        this.accessToken = data.accessToken;
        this.refreshToken = data.refreshToken;

        setAccessToken(this.accessToken);
        setRefreshToken(this.refreshToken);

        return data;
      } catch (err) {
        this.error = err.response?.data?.message || "Login failed";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async signup(payload) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await signupApi(payload);
        return data;
      } catch (err) {
        this.error = err.response?.data?.message || "Signup failed";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async logout(all = false) {
      try {
        if (all) {
          await logoutAllApi({ refreshToken: this.refreshToken });
        } else {
          await logoutApi({ refreshToken: this.refreshToken });
        }
      } catch {
        // ignore API errors on logout
      } finally {
        this.user = null;
        this.accessToken = null;
        this.refreshToken = null;

        removeAccessToken();
        removeRefreshToken();
      }
    },

    async refresh() {
      try {
        const { data } = await refreshApi({ refreshToken: this.refreshToken });
        this.accessToken = data.accessToken;
        setAccessToken(this.accessToken);
      } catch {
        this.logout();
      }
    },

    async loadProfile() {
      try {
        const { data } = await profileApi();
        this.user = data.user;
        return this.user;
      } catch {
        this.logout();
      }
    },

    hasRole(roles) {
      return roles.includes(this.user?.role);
    },
  },
});
