import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../store/auth.store";  // import Pinia store

const routes = [
  // Auth
  {
    path: "/login",
    component: () => import("../modules/auth/pages/Login.vue"),
    meta: { guest: true },
  },
  {
    path: "/signup",
    component: () => import("../modules/auth/pages/Signup.vue"),
    meta: { guest: true },
  },

  // Main App
  {
    path: "/dashboard",
    component: () => import("../modules/dashboard/pages/Dashboard.vue"),
    meta: { requiresAuth: true },
  },

  // Jobs
  {
    path: "/jobs",
    component: () => import("../modules/jobs/pages/Jobs.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/jobs/:id",
    component: () => import("../modules/jobs/pages/JobDetails.vue"),
    props: true,
    meta: { requiresAuth: true },
  },

  // Runs
  {
    path: "/runs",
    component: () => import("../modules/runs/pages/Runs.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/runs/:id",
    component: () => import("../modules/runs/pages/RunDetails.vue"),
    props: true,
    meta: { requiresAuth: true },
  },

  // Scheduler
  {
    path: "/scheduler",
    component: () => import("../modules/scheduler/pages/Scheduler.vue"),
    meta: { requiresAuth: true },
  },

  // Logs
  {
    path: "/logs",
    component: () => import("../modules/logs/pages/Logs.vue"),
    meta: { requiresAuth: true },
  },

  // Job Management
  {
    path: "/job-management",
    component: () => import("../modules/jobManagement/pages/JobManagement.vue"),
    meta: { requiresAuth: true, roles: ["OWNER", "ADMIN"] },
  },

  // Integrations
  {
    path: "/integrations",
    component: () => import("../modules/integrations/pages/Integrations.vue"),
    meta: { requiresAuth: true },
  },
  {path: "/integrations/aws",
    component: () => import("../modules/integrations/pages/AWSIntegration.vue"),
    meta: { requiresAuth: true }
  },

  // Cluster Management
  {
    path: "/cluster",
    component: () => import("../modules/cluster/pages/Cluster.vue"),
    meta: { requiresAuth: true },
  },

  // User Management
  {
    path: "/users",
    component: () => import("../modules/users/pages/Users.vue"),
    meta: { requiresAuth: true, roles: ["OWNER", "ADMIN"] },
  },

  // Settings
  {
    path: "/settings",
    component: () => import("../modules/settings/pages/Settings.vue"),
    meta: { requiresAuth: true },
  },

  {
    path: "/profile",
    component: () => import("../modules/profile/pages/Profile.vue"),
    meta:{requiresAuth: true}
  },

  // Fallback
  {
    path: "/:pathMatch(.*)*",
    redirect: "/login",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Global guard
// router.beforeEach((to, from, next) => {
//   const authStore = useAuthStore();

//   if (to.meta.requiresAuth && !authStore.isAuthenticated) {
//     return next("/login");
//   }

//   if (to.meta.guest && authStore.isAuthenticated) {
//     return next("/dashboard");
//   }

//   if (to.meta.roles && !authStore.hasRole(to.meta.roles)) {
//     return next("/dashboard");
//   }

//   next();
// });

export default router;
