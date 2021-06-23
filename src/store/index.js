import { createStore } from "vuex";
// Store modules
import agendaModule from "./modules/agenda/index.js";
import clientsModule from "./modules/clients/index.js";
import dashboardModule from "./modules/dashboard/index.js";
const store = createStore({
  modules: {
    agenda: agendaModule,
    clients: clientsModule,
    dashboard: dashboardModule,
  },
});
export default store;
