import { createStore } from "vuex";
import agendaModule from "./modules/agenda/index.js";
import authModule from "./modules/auth/index.js";
import clientsModule from "./modules/clients/index.js";
import configsModule from "./modules/configs/index.js";
// The root state
import actions from "./actions.js";
import getters from "./getters.js";
import mutations from "./mutations.js";
const store = createStore({
  modules: {
    agenda: agendaModule,
    auth: authModule,
    clients: clientsModule,
    configs: configsModule,
  },
  state() {
    return {
      alertData: {
        alertMessage: "",
        alertType: "",
        alertTimer: null,
      },
    };
  },
  actions,
  getters,
  mutations,
});
export default store;
