import { createRouter, createWebHistory } from "vue-router";
// Imports of pages as components
import Agenda from "./pages/agenda/Agenda.vue";
import Auth from "./pages/auth/UserAuth.vue";
import Clients from "./pages/clients/Clients.vue";
import Configs from "./pages/configs/Configs.vue";
import Dashboard from "./pages/dashboard/Dashboard.vue";
import store from "./store";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/dashboard" },
    {
      path: "/agenda",
      name: "Agenda",
      component: Agenda,
      meta: { requiresAuth: true },
    },
    {
      path: "/auth",
      name: "Auth",
      component: Auth,
      meta: { requiresAuth: false },
    },
    {
      path: "/clients",
      name: "Clients",
      component: Clients,
      meta: { requiresAuth: true },
    },
    {
      path: "/configs",
      name: "Configs",
      component: Configs,
      meta: { requiresAuth: true },
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: Dashboard,
      meta: { requiresAuth: true },
    },
  ],
});
router.beforeEach(function (to, from, next) {
  // If the meta value of the destination contains a true requiresAuth value and the user isn't logged in, redirect to the auth page
  if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
    next("/auth");
  } else {
    next();
  }
});
export default router;
