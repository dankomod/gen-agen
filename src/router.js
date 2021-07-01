import { createRouter, createWebHistory } from "vue-router";
// Imports of pages as components
import Agenda from "./pages/agenda/Agenda.vue";
import Auth from "./pages/auth/UserAuth.vue";
import Clients from "./pages/clients/Clients.vue";
import Dashboard from "./pages/dashboard/Dashboard.vue";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/dashboard" },
    { path: "/agenda", name: "Agenda", component: Agenda },
    { path: "/auth", name: "Auth", component: Auth },
    { path: "/clients", name: "Clients", component: Clients },
    { path: "/dashboard", name: "Dashboard", component: Dashboard },
  ],
});
export default router;
