import { createStore } from "vuex";

// Store modules
import scheduleModule from "./modules/schedule/index.js";

import authModule from "./modules/auth/index.js";

const store = createStore({
  modules: {
    schedule: scheduleModule,
    auth: authModule,
  },
  state() {
    return { activeUser: "1" };
  },
  mutations: {},
  actions: {},
});

export default store;
