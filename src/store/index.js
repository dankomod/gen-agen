import { createStore } from "vuex";
import agendaModule from "./modules/agenda/index.js";
import clientsModule from "./modules/clients/index.js";
const store = createStore({
  modules: {
    agenda: agendaModule,
    clients: clientsModule,
  },
});
export default store;
