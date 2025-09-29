<template>
  <aside :class="['sidebar', { collapsed: isCollapsed }]">
    <!-- Header -->
    <div class="sidebar-header">
      <button class="menu-btn" @click="toggleSidebar">
        <!-- Hamburger Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <span v-if="!isCollapsed" class="brand">
        <img src="./../assets/logo/logo.png" alt="TMS Logo" class="brand-logo-small" />
      </span>
    </div>

    <!-- Return to Home -->
    <nav class="sidebar-nav">
      <ul>
        <li>
          <router-link to="/dashboard">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 9.75L12 4l9 5.75V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V9.75z" />
            </svg>
            <span v-if="!isCollapsed">Dashboard</span>
          </router-link>
        </li>
      </ul>

      <!-- Main Menu Label -->
      <p v-if="!isCollapsed" class="sidebar-mainmenu">Main Menu</p>

      <!-- Menu -->
      <ul>
        <li>
          <router-link to="/jobs">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 17v-6h6v6m2 0H7m10 0a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
            <span v-if="!isCollapsed">Jobs</span>
          </router-link>
        </li>

        <li>
          <router-link to="/runs">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span v-if="!isCollapsed">Runs</span>
          </router-link>
        </li>

        <li>
          <router-link to="/logs">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <span v-if="!isCollapsed">Logs</span>
          </router-link>
        </li>

        <li class="divider"></li>

        <li>
          <router-link to="/job-management">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8c-2.21 0-4 1.79-4 4 0 .93.32 1.79.84 2.47L6.34 18.97a1 1 0 101.42 1.42l2.5-2.5A3.98 3.98 0 0016 12c0-2.21-1.79-4-4-4z"/>
            </svg>
            <span v-if="!isCollapsed">Job Management</span>
          </router-link>
        </li>

        <li>
          <router-link to="/integrations">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m5-3a9 9 0 11-8-8"/>
            </svg>
            <span v-if="!isCollapsed">Integrations</span>
          </router-link>
        </li>

        <li>
          <router-link to="/cluster">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 4v16m8-8H4"/>
            </svg>
            <span v-if="!isCollapsed">Cluster</span>
          </router-link>
        </li>

        <li>
          <router-link to="/users">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5.121 17.804A10 10 0 0112 15c2.486 0 4.735.91 6.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span v-if="!isCollapsed">User Management</span>
          </router-link>
        </li>

        <li class="divider"></li>

        <!-- 🔴 Logout Option -->
        <li>
          <button class="logout-btn" @click="handleprofile">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
            </svg>
            <span v-if="!isCollapsed">Profile</span>
          </button>
          <button class="logout-btn" @click="handleLogout">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
            </svg>
            <span v-if="!isCollapsed">Logout</span>
          </button>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth.store";

const isCollapsed = ref(false);
const router = useRouter();
const authStore = useAuthStore();

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value;
}
async function handleprofile() {
  router.push("/profile");
}
async function handleLogout() {
  await authStore.logout(); // clears state + calls backend
  router.push("/login");
}
</script>

<style scoped>
.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0.5rem 1rem;
  width: 100%;
  text-align: left;
}
.logout-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>
