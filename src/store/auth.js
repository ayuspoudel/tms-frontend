import { defineStore } from "pinia";
import {
  loginApi,
  signupApi,
  logoutApi,
  logoutAllApi,
  refreshApi,
  profileApi,
} from "../api/auth.api";
import { setToken, getToken, removeToken } from "../utils/token";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    accessToken: getToken(),
    loading: false,
    error: null,
  }),

  actions: {
    async login(email, password) {
      this.loading = true;
      this.error = null;
      try {
        const res = await loginApi({ email, password });
        this.accessToken = res.data.accessToken;
        setToken(this.accessToken);
        this.user = res.data.user;
        return res.data;
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
        const res = await signupApi(payload);
        return res.data;
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
          await logoutAllApi();
        } else {
          await logoutApi();
        }
      } catch (err) {
        // ignore API error, just clear local state
      }
      this.user = null;
      this.accessToken = null;
      removeToken();
    },

    async refresh() {
      try {
        const res = await refreshApi();
        this.accessToken = res.data.accessToken;
        setToken(this.accessToken);
      } catch (err) {
        this.logout();
      }
    },

    async loadProfile() {
      try {
        const res = await profileApi();
        this.user = res.data.user;
        return this.user;
      } catch (err) {
        this.logout();
      }
    },

    hasRole(roles) {
      return roles.includes(this.user?.role);
    },
  },
});
