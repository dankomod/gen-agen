import { createRouter, createWebHistory } from "vue-router";

// Imports of pages as components
import TheSchedule from "./pages/schedule/TheSchedule.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/schedule" },
    { path: "/schedule", component: TheSchedule },
  ],
});

export default router;
