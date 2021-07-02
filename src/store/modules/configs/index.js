import actions from "./actions.js";
import getters from "./getters.js";
import mutations from "./mutations.js";
export default {
  namespaced: true,
  state() {
    return {
      closingHour: null,
      openingHour: null,
      paymentMethods: [],
    };
  },
  actions,
  getters,
  mutations,
};
