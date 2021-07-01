import { createStore } from "vuex";
import agendaModule from "./modules/agenda/index.js";
import clientsModule from "./modules/clients/index.js";
// The root state
import actions from "./actions.js";
import getters from "./getters.js";
import mutations from "./mutations.js";
const store = createStore({
  modules: {
    agenda: agendaModule,
    clients: clientsModule,
  },
  state() {
    return {
      alertData: {
        alertMessage: "",
        alertType: "",
        alertTimer: null,
        token: null,
        userId: null,
      },
    };
  },
  actions,
  getters,
  mutations,
});
export default store;
