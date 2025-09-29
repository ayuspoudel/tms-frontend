import { defineStore } from "pinia";
import {
  listUsersApi,
  updateUserRoleApi,
  suspendUserApi,
  activateUserApi,
} from "../api/user.api.js";

export const useUserStore = defineStore("user", {
  state: () => ({
    users: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchUsers() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await listUsersApi();
        this.users = data.users || [];
      } catch (err) {
        this.error = err.response?.data?.error || err.message;
      } finally {
        this.loading = false;
      }
    },

    async changeRole(id, role) {
      try {
        await updateUserRoleApi(id, role);
        const user = this.users.find((u) => u.id === id);
        if (user) user.role = role;
      } catch (err) {
        this.error = err.response?.data?.error || err.message;
      }
    },

    async suspendUser(id) {
      try {
        await suspendUserApi(id);
        const user = this.users.find((u) => u.id === id);
        if (user) user.status = "SUSPENDED";
      } catch (err) {
        this.error = err.response?.data?.error || err.message;
      }
    },

    async activateUser(id) {
      try {
        await activateUserApi(id);
        const user = this.users.find((u) => u.id === id);
        if (user) user.status = "ACTIVE";
      } catch (err) {
        this.error = err.response?.data?.error || err.message;
      }
    },
  },
});
