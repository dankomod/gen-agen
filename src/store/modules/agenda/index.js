import actions from "./actions.js";
import getters from "./getters.js";
import mutations from "./mutations.js";

export default {
  namespaced: true, // "agenda/...""
  state() {
    return {
      baseDate: "",
      openingHour: 8,
      closingHour: 17,
      agendaHours: {},
      selectedHours: [],
      appointmentInfo: {},
    };
  },
  actions,
  getters,
  mutations,
};
