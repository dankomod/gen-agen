import actions from "./actions.js";
import getters from "./getters.js";
import mutations from "./mutations.js";
export default {
  state() {
    return {
      token: null,
      userId: null,
    };
  },
  actions,
  getters,
  mutations,
};
