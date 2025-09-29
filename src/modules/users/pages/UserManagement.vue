<template>
  <!-- Popup Modal -->
  <div v-if="isModal" class="modal-overlay" @click.self="close">
    <div class="modal-card">
      <!-- Header -->
      <div class="header">
        <div class="header-left">
          <div class="avatar">
            {{ initials }}
          </div>
          <div class="user-info">
            <h3>{{ userData?.displayName }}</h3>
            <p class="email">{{ userData?.email }}</p>
          </div>
        </div>
        <div class="header-actions">
          <button v-if="isModal" class="link-btn" @click="openFullPage">
            Open Full
          </button>
          <button v-if="isModal" class="close-btn" @click="close">×</button>
        </div>
      </div>

      <!-- Body -->
      <div class="body">
        <div class="row">
          <label>Role:</label>
          <select v-model="newRole" class="small-select">
            <option value="OWNER">OWNER</option>
            <option value="ADMIN">ADMIN</option>
            <option value="USER">USER</option>
          </select>
          <button class="small-btn" @click="changeRole">Update</button>
        </div>

        <div class="row">
          <label>Status:</label>
          <span :class="['status-badge', userData.status.toLowerCase()]">
            {{ userData.status }}
          </span>
          <button
            v-if="userData.status === 'ACTIVE'"
            class="small-btn danger"
            @click="suspend"
          >
            Suspend
          </button>
          <button
            v-else
            class="small-btn success"
            @click="activate"
          >
            Activate
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Full Page -->
  <div v-else class="page-wrapper">
    <div class="page-card" v-if="userData">
      <div class="header">
        <div class="header-left">
          <div class="avatar">
            {{ initials }}
          </div>
          <div class="user-info">
            <h2>{{ userData.displayName }}</h2>
            <p class="email">{{ userData.email }}</p>
          </div>
        </div>
      </div>

      <div class="body">
        <div class="row">
          <label>Role:</label>
          <select v-model="newRole" class="small-select">
            <option value="OWNER">OWNER</option>
            <option value="ADMIN">ADMIN</option>
            <option value="USER">USER</option>
          </select>
          <button class="small-btn" @click="changeRole">Update</button>
        </div>

        <div class="row">
          <label>Status:</label>
          <span :class="['status-badge', userData.status.toLowerCase()]">
            {{ userData.status }}
          </span>
          <button
            v-if="userData.status === 'ACTIVE'"
            class="small-btn danger"
            @click="suspend"
          >
            Suspend
          </button>
          <button
            v-else
            class="small-btn success"
            @click="activate"
          >
            Activate
          </button>
        </div>
      </div>
    </div>
    <div v-else class="loading">Loading user details...</div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  updateUserRoleApi,
  suspendUserApi,
  activateUserApi,
  listUsersApi,
} from "@/api/user.api";

const props = defineProps({
  user: { type: Object, required: false },
  isModal: { type: Boolean, default: true },
});
const emit = defineEmits(["close", "updated"]);
const router = useRouter();
const route = useRoute();

const userData = ref(props.user || null);
const newRole = ref(userData.value?.role || "");

onMounted(async () => {
  if (!props.isModal) {
    const res = await listUsersApi();
    const found = res.data.users.find((u) => u.id === route.params.id);
    if (found) {
      userData.value = found;
      newRole.value = found.role;
    }
  }
});

watch(
  () => props.user,
  (val) => {
    if (val) {
      userData.value = val;
      newRole.value = val.role;
    }
  },
  { immediate: true }
);

async function changeRole() {
  await updateUserRoleApi(userData.value.id, newRole.value);
  userData.value.role = newRole.value;
  emit("updated", userData.value);
}

async function suspend() {
  await suspendUserApi(userData.value.id);
  userData.value.status = "SUSPENDED";
  emit("updated", userData.value);
}

async function activate() {
  await activateUserApi(userData.value.id);
  userData.value.status = "ACTIVE";
  emit("updated", userData.value);
}

function close() {
  emit("close");
}

function openFullPage() {
  emit("close");
  router.push(`/users/${userData.value.id}`);
}

const initials = computed(() => {
  if (!userData.value?.displayName) return "";
  return userData.value.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  font-family: 'Outfit', sans-serif;
}
.modal-card,
.page-card {
  background: #fff;
  color: #111;
  border-radius: 10px;
  padding: 1.5rem;
  width: 440px;
  max-width: 95%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}
.page-wrapper {
  padding: 2rem;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #2f855a;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}
.user-info h3,
.user-info h2 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}
.user-info .email {
  font-size: 0.8rem;
  color: #6b7280;
}
.header-actions {
  display: flex;
  gap: 0.35rem;
}
.link-btn {
  background: none;
  border: none;
  color: #2563eb;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
}
.link-btn:hover {
  background: #eff6ff;
}
.close-btn {
  background: none;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  color: #6b7280;
}
.close-btn:hover {
  color: #111;
}

/* Body */
.body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.row label {
  font-weight: 600;
  font-size: 0.85rem;
  min-width: 70px;
  color: #374151;
}

/* Inputs & Buttons */
.small-select {
  flex: 1;
  padding: 0.35rem 0.5rem;
  font-size: 0.85rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}
.small-btn {
  background: #f3f4f6;
  border: none;
  padding: 0.35rem 0.7rem;
  font-size: 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}
.small-btn:hover {
  background: #e5e7eb;
}
.small-btn.success {
  background: #dcfce7;
  color: #166534;
}
.small-btn.danger {
  background: #fee2e2;
  color: #991b1b;
}

/* Status badges */
.status-badge {
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}
.status-badge.active {
  background: #d1fae5;
  color: #065f46;
}
.status-badge.suspended {
  background: #fee2e2;
  color: #991b1b;
}

/* Loading */
.loading {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  font-size: 0.9rem;
}
</style>
