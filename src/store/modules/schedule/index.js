import actions from "./actions.js";
import getters from "./getters.js";
import mutations from "./mutations.js";

export default {
  namespaced: true, // "schedule/...""
  state() {
    return {
      start: "",
      end: "",
    };
  },
  actions,
  getters,
  mutations,
};
