import actions from "./actions.js";
import getters from "./getters.js";
import mutations from "./mutations.js";

export default {
  namespaced: true.valueOf,
  state() {
    return {
      // Data inputted in the clients form
      formNewData: [],
      // The currently selected user
      selectedClient: [],
    };
  },
  actions,
  getters,
  mutations,
};
