<template>
  <div id="app">
    <!-- Auth pages: no sidebar, no breadcrumb -->
    <template v-if="!isAuthRoute">
      <div class="layout">
        <NavBar />
        <main class="content">
          <!-- breadcrumb bar -->
          <Breadcrumb :items="breadcrumbs" />

          <!-- route content -->
          <router-view v-slot="{ Component }" @update-breadcrumb="setBreadcrumb">
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
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import NavBar from "./components/SideBar.vue";
import Breadcrumb from "./components/Breadcrumb.vue";

const route = useRoute();
const breadcrumbs = ref([]);

const isAuthRoute = computed(() =>
  ["/login", "/signup"].includes(route.path)
);

function setBreadcrumb(items) {
  breadcrumbs.value = items;
}
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
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  transition: margin-left 0.3s ease;
}

/* Breadcrumb sits at top of content */
.content > nav {
  flex-shrink: 0;
}

/* Route content fills remaining */
.content > *:not(nav) {
  flex: 1;
}

/* Optional: collapsed sidebar */
.sidebar.collapsed + .content {
  margin-left: 60px;
}
</style>
