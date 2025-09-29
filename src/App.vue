<template>
  <div id="app">
    <!-- Auth pages: no sidebar -->
    <template v-if="!isAuthRoute">
      <div class="layout">
        <NavBar />
        <main class="content">
          <router-view v-slot="{ Component }">
            <component :is="Component" />
          </router-view>
        </main>
      </div>
    </template>

    <!-- Auth pages (login/signup): show routed content only -->
    <template v-else>
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </template>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import NavBar from "./components/SideBar.vue";

const route = useRoute();

const isAuthRoute = computed(() =>
  ["/login", "/signup"].includes(route.path)
);
</script>

<style>
/* Root */
#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Layout: sidebar + main content */
.layout {
  display: flex;
  height: 100%;
}

/* Main content area: push right so it’s not behind sidebar */
.content {
  flex: 1;
  margin-left: 180px; /* match sidebar width */
  padding: 1rem;
  overflow-y: auto;
  transition: margin-left 0.3s ease;
}

/* Optional: if you use collapsed state */
.sidebar.collapsed + .content {
  margin-left: 60px; /* match collapsed sidebar width */
}
</style>
