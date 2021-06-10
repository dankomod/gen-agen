import actions from "./actions.js";
import getters from "./getters.js";
import mutations from "./mutations.js";

export default {
  namespaced: true, // "agenda/...""
  state() {
    return {
      agendaDetails: {},
      agendaHours: {},
      appointmentInfo: {},
      selectedHours: [],
      baseDate: "",
      openingHour: 9,
      closingHour: 16,
    };
  },
  actions,
  getters,
  mutations,
};
