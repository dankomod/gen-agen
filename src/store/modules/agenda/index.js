import actions from "./actions.js";
import getters from "./getters.js";
import mutations from "./mutations.js";
export default {
  namespaced: true,
  state() {
    return {
      openingHour: 9,
      closingHour: 16,
      selectedDate: "",
      selectedSlots: [],
      appointmentNewData: "",
      takenHours: [],
    };
  },
  actions,
  getters,
  mutations,
};
