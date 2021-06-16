import { createRouter, createWebHistory } from "vue-router";

// Imports of pages as components
import Agenda from "./pages/agenda/Agenda.vue";
import Clients from "./pages/clients/Clients.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/agenda" },
    { path: "/agenda", component: Agenda },
    { path: "/clients", component: Clients },
  ],
});

export default router;
