import { createRouter, createWebHistory } from "vue-router";

// Imports of pages as components
import TheAdminAgenda from "./pages/adminagenda/TheAdminAgenda.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // TODO: make a root page
    { path: "/", redirect: "/adminagenda" },
    { path: "/adminagenda", component: TheAdminAgenda },
  ],
});

export default router;
