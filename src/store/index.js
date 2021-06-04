import { createStore } from "vuex";

// Store modules
import agendaModule from "./modules/agenda/index.js";

const store = createStore({
  modules: {
    agenda: agendaModule,
  },
  state() {},
  mutations: {},
  actions: {},
});

export default store;
