import { createRouter, createWebHistory } from "vue-router";

const routes = [
  // Auth
  {
    path: "/login",
    component: () => import("../modules/auth/pages/Login.vue"),
  },
  {
    path: "/signup",
    component: () => import("../modules/auth/pages/Signup.vue"),
  },

  // Main App
  {
    path: "/dashboard",
    component: () => import("../modules/dashboard/pages/Dashboard.vue"),
  },

  // Jobs
  {
    path: "/jobs",
    component: () => import("../modules/jobs/pages/Jobs.vue"),
  },
  {
    path: "/jobs/:id",
    component: () => import("../modules/jobs/pages/JobDetails.vue"),
    props: true,
  },

  // Runs
  {
    path: "/runs",
    component: () => import("../modules/runs/pages/Runs.vue"),
  },
  {
    path: "/runs/:id",
    component: () => import("../modules/runs/pages/RunDetails.vue"),
    props: true,
  },

  // Scheduler
  {
    path: "/scheduler",
    component: () => import("../modules/scheduler/pages/Scheduler.vue"),
  },

  // Logs
  {
    path: "/logs",
    component: () => import("../modules/logs/pages/Logs.vue"),
  },

  // Job Management (bulk actions, etc.)
  {
    path: "/job-management",
    component: () => import("../modules/jobManagement/pages/JobManagement.vue"),
  },

  // Integrations (AWS, GitHub config)
  {
    path: "/integrations",
    component: () => import("../modules/integrations/pages/Integrations.vue"),
  },

  // Cluster / Runner Management
  {
    path: "/cluster",
    component: () => import("../modules/cluster/pages/Cluster.vue"),
  },

  // User Management
  {
    path: "/users",
    component: () => import("../modules/users/pages/Users.vue"),
  },

  // Settings
  {
    path: "/settings",
    component: () => import("../modules/settings/pages/Settings.vue"),
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

export default router;
