import actions from "./actions.js";
import getters from "./getters.js";
import mutations from "./mutations.js";

export default {
  namespaced: true, // "auth/...""
  state() {
    return { activeUser: "1" };
  },
  actions,
  getters,
  mutations,
};
