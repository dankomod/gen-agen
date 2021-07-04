import actions from "./actions.js";
import getters from "./getters.js";
import mutations from "./mutations.js";
export default {
  namespaced: true,
  state() {
    return {
      // Data inputted in the clients form
      clientNewData: [],
      // The currently selected user
      selectedClient: [],
    };
  },
  actions,
  getters,
  mutations,
};
