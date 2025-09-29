<template>
  <div class="users-page">
    <div class="page-body">
      <!-- Header -->
      <div class="page-header">
        <div class="title">
          <h1>User Management</h1>
          <div class="stats">
            <span class="stat-badge">Total: {{ filteredUsers.length }}</span>
            <div class="role-toggle">
              <button
                v-for="option in roleOptions"
                :key="option"
                :class="['toggle-btn', { active: selectedRole === option }]"
                @click="selectedRole = option"
              >
                {{ option }}
              </button>
            </div>
          </div>
        </div>

        <!-- Primary actions -->
        <div class="primary-actions">
          <router-link to="/users/create" class="btn secondary">+ Create</router-link>
          <router-link to="/users/invite" class="btn secondary">+ Invite</router-link>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="toolbar">
        <div class="bulk-actions">
          <button class="btn danger" :disabled="!selectedIds.length" @click="showBulkSuspendModal = true">
            Suspend Selected
          </button>
          <button class="btn danger" :disabled="!selectedIds.length" @click="showBulkDeleteModal = true">
            Delete Selected
          </button>
        </div>
      </div>

      <!-- Users Table -->
      <div class="table-wrapper" v-if="filteredUsers.length">
        <table class="users-table">
          <thead>
            <tr>
              <th style="width:36px;">
                <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Email Verified</th>
              <th>Last Login</th>
              <th>Created</th>
              <th class="actions-col" style="width:70px;"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in filteredUsers"
              :key="user.id"
              class="row clickable"
              @click="onRowClick(user)"
              @keydown.enter.prevent="onRowClick(user)"
              tabindex="0"
              role="button"
              aria-label="Open user details"
              title="Click to expand"
            >
              <td @click.stop>
                <input type="checkbox" v-model="selectedIds" :value="user.id" />
              </td>
              <td>{{ user.displayName || (user.firstName + ' ' + user.lastName) }}</td>
              <td>{{ user.email }}</td>
              <td><span :class="['badge', user.role.toLowerCase()]">{{ user.role }}</span></td>

              <!-- Status with icon -->
              <td>
                <span :class="['badge', user.status.toLowerCase()]">
                  <svg v-if="user.status === 'ACTIVE'" xmlns="http://www.w3.org/2000/svg" class="icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </span>
              </td>

              <!-- Email verified with icon -->
              <td>
                <span :class="['badge', user.emailVerified ? 'verified' : 'unverified']">
                  <svg v-if="user.emailVerified" xmlns="http://www.w3.org/2000/svg" class="icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </span>
              </td>

              <td>{{ formatDate(user.lastLoginAt) }}</td>
              <td>{{ formatDate(user.createdAt) }}</td>

              <!-- Actions: suspend + delete -->
              <td class="row-actions" @click.stop>
                <button
                  class="icon-btn"
                  :class="{ danger: user.status !== 'SUSPENDED' }"
                  @click="confirmSuspend(user)"
                  :disabled="user.status === 'SUSPENDED'"
                  :title="user.status === 'SUSPENDED' ? 'Already suspended' : 'Suspend user'"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="10" y1="15" x2="10" y2="9"></line>
                    <line x1="14" y1="15" x2="14" y2="9"></line>
                  </svg>
                </button>
                <button class="icon-btn danger" @click="confirmDelete(user)" title="Delete user">
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                    <path d="M10 11v6"></path>
                    <path d="M14 11v6"></path>
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty state -->
      <div v-else class="empty-state">
        <p>No users found.</p>
        <router-link to="/users/create" class="btn secondary">+ Create User</router-link>
      </div>
    </div>

    <!-- User Management Popup -->
    <UserManagement
      v-if="selectedUser"
      :user="selectedUser"
      :isModal="true"
      @close="selectedUser = null"
      @updated="refreshList"
    />

    <!-- Confirm Suspend -->
    <div v-if="suspendTarget" class="modal-overlay" @click.self="suspendTarget = null">
      <div class="confirm-modal">
        <h3>Suspend User</h3>
        <p>Are you sure you want to suspend <strong>{{ suspendTarget.displayName }}</strong>?</p>
        <div class="modal-actions">
          <button class="btn danger" @click="suspendUser(suspendTarget)">Yes, Suspend</button>
          <button class="btn secondary" @click="suspendTarget = null">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Confirm Delete -->
    <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
      <div class="confirm-modal">
        <h3>Delete User</h3>
        <p>Are you sure you want to delete <strong>{{ deleteTarget.displayName }}</strong>? This action cannot be undone.</p>
        <div class="modal-actions">
          <button class="btn danger" @click="deleteUser(deleteTarget)">Yes, Delete</button>
          <button class="btn secondary" @click="deleteTarget = null">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Bulk Suspend -->
    <div v-if="showBulkSuspendModal" class="modal-overlay" @click.self="showBulkSuspendModal = false">
      <div class="confirm-modal">
        <h3>Suspend Users</h3>
        <p>Are you sure you want to suspend <strong>{{ selectedIds.length }}</strong> selected users?</p>
        <div class="modal-actions">
          <button class="btn danger" @click="bulkSuspend">Yes, Suspend</button>
          <button class="btn secondary" @click="showBulkSuspendModal = false">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Bulk Delete -->
    <div v-if="showBulkDeleteModal" class="modal-overlay" @click.self="showBulkDeleteModal = false">
      <div class="confirm-modal">
        <h3>Delete Users</h3>
        <p>Are you sure you want to delete <strong>{{ selectedIds.length }}</strong> selected users? This cannot be undone.</p>
        <div class="modal-actions">
          <button class="btn danger" @click="bulkDelete">Yes, Delete</button>
          <button class="btn secondary" @click="showBulkDeleteModal = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { listUsersApi, suspendUserApi } from "@/api/user.api";
import UserManagement from "./UserManagement.vue";

const emit = defineEmits(["update-breadcrumb"]);

const users = ref([]);
const selectedUser = ref(null);
const suspendTarget = ref(null);
const deleteTarget = ref(null);
const selectedIds = ref([]);
const selectAll = ref(false);
const showBulkSuspendModal = ref(false);
const showBulkDeleteModal = ref(false);

const roleOptions = ["All", "User", "Admin", "Owner"];
const selectedRole = ref("All");

async function fetchUsers() {
  try {
    const res = await listUsersApi();
    users.value = res.data.users || [];
  } catch (err) {
    console.error("Failed to fetch users", err);
  }
}

const filteredUsers = computed(() => {
  if (selectedRole.value === "All") return users.value;
  return users.value.filter(
    (u) => u.role.toLowerCase() === selectedRole.value.toLowerCase()
  );
});

// Breadcrumb emitter
function emitBreadcrumb() {
  const items = [
    { label: "User Management", to: "/users" },
    { label: selectedRole.value === "All" ? "All Users" : `${selectedRole.value} Users` }
  ];
  emit("update-breadcrumb", items);
}

function onRowClick(user) {
  selectedUser.value = user;
  emit("update-breadcrumb", [
    { label: "User Management", to: "/users" },
    { label: user.displayName || user.email }
  ]);
}

function refreshList(updatedUser) {
  const idx = users.value.findIndex((u) => u.id === updatedUser.id);
  if (idx !== -1) {
    users.value[idx] = { ...users.value[idx], ...updatedUser };
  }
  emitBreadcrumb();
}

function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleString();
}

function toggleSelectAll() {
  if (selectAll.value) {
    selectedIds.value = users.value.map((u) => u.id);
  } else {
    selectedIds.value = [];
  }
}

function confirmSuspend(user) {
  suspendTarget.value = user;
}

async function suspendUser(user) {
  try {
    await suspendUserApi(user.id);
    user.status = "SUSPENDED";
    refreshList(user);
  } catch (err) {
    console.error("Failed to suspend user", err);
  } finally {
    suspendTarget.value = null;
  }
}

function confirmDelete(user) {
  deleteTarget.value = user;
}

async function deleteUser(user) {
  try {
    users.value = users.value.filter((u) => u.id !== user.id);
  } catch (err) {
    console.error("Failed to delete user", err);
  } finally {
    deleteTarget.value = null;
  }
}

async function bulkSuspend() {
  try {
    for (const id of selectedIds.value) {
      await suspendUserApi(id);
      const user = users.value.find((u) => u.id === id);
      if (user) user.status = "SUSPENDED";
    }
  } catch (err) {
    console.error("Bulk suspend failed", err);
  } finally {
    showBulkSuspendModal.value = false;
    selectedIds.value = [];
    selectAll.value = false;
  }
}

async function bulkDelete() {
  try {
    users.value = users.value.filter((u) => !selectedIds.value.includes(u.id));
  } catch (err) {
    console.error("Bulk delete failed", err);
  } finally {
    showBulkDeleteModal.value = false;
    selectedIds.value = [];
    selectAll.value = false;
  }
}

onMounted(async () => {
  await fetchUsers();
  emitBreadcrumb();
});

// Update breadcrumbs when role changes
watch(selectedRole, () => {
  emitBreadcrumb();
});
</script>

<style scoped>
.users-page { font-family: 'Outfit', sans-serif; color: #111; }
.page-body { padding: 1rem 2rem; }

/* Header */
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.5rem; }
.page-header h1 { margin: 0; font-size: 1.25rem; }
.stats { display: flex; align-items: center; gap: 1rem; margin-top: 0.25rem; }

/* Role Toggle */
.role-toggle { display: flex; gap: 0.5rem; }
.toggle-btn { padding: 0.25rem 0.6rem; border: 1px solid #ccc; border-radius: 4px; background: #f4f5f7; cursor: pointer; font-size: 0.8rem; }
.toggle-btn.active { background: #0747a6; color: white; border-color: #0747a6; }

/* Stat badge */
.stat-badge { background: #f3f4f6; padding: 0.25rem 0.5rem; border-radius: 6px; font-size: 0.8rem; font-weight: 600; }

/* Primary actions */
.primary-actions { display: flex; gap: 0.5rem; }

/* Toolbar */
.toolbar { display: flex; margin: 0.5rem 0 1rem; }
.bulk-actions { display: flex; gap: 0.5rem; }

/* Table */
.table-wrapper { overflow-x: auto; }
.users-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
.users-table th, .users-table td { text-align: left; padding: 0.5rem 0.75rem; border-bottom: 1px solid #e5e7eb; }
.users-table th { background: #f9fafb; font-weight: 600; color: #374151; }
.row:hover { background: #f6f7f9; }
.row.clickable { cursor: pointer; }

/* Badges (Kibana-style pills with icons) */
.badge { display: inline-flex; align-items: center; justify-content: center; padding: 0.15rem 0.5rem; font-size: 0.75rem; font-weight: 500; border-radius: 9999px; border: 1px solid #d1d5db; background: #f9fafb; color: #374151; }
.badge .icon-sm { width: 14px; height: 14px; }

/* Role-specific */
.badge.owner { border-color: #bfdbfe; background: #eff6ff; color: #1e40af; }
.badge.admin { border-color: #fde68a; background: #fefce8; color: #92400e; }
.badge.user { border-color: #e5e7eb; background: #f9fafb; color: #374151; }

/* Status */
.badge.active { border-color: #bbf7d0; background: #ecfdf5; color: #166534; }
.badge.suspended { border-color: #fecaca; background: #fef2f2; color: #991b1b; }

/* Email verification */
.badge.verified { border-color: #bbf7d0; background: #ecfdf5; color: #166534; }
.badge.unverified { border-color: #fecaca; background: #fef2f2; color: #991b1b; }

/* Icon buttons */
.icon-btn { background: none; border: none; cursor: pointer; padding: 0.25rem; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; margin-left: 0.25rem; }
.icon-btn:hover { background: #f3f4f6; }
.icon-btn.danger { color: #dc2626; }
.icon-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.icon-btn .icon { width: 18px; height: 18px; }

/* Empty state */
.empty-state { text-align: center; padding: 2rem; color: #6b7280; }

/* Modals */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 200; }
.confirm-modal { background: #fff; padding: 1rem 1.5rem; border-radius: 8px; width: 350px; text-align: center; }
.confirm-modal h3 { margin-top: 0; margin-bottom: 0.5rem; }
.modal-actions { display: flex; justify-content: space-between; margin-top: 1rem; }
</style>
