import actions from "./actions.js";
import getters from "./getters.js";
import mutations from "./mutations.js";

export default {
  namespaced: true, // "agenda/...""
  state() {
    return {
      start: "",
      end: "",
      baseDate: "",
      openingHour: 8,
      closingHour: 17,
    };
  },
  actions,
  getters,
  mutations,
};
