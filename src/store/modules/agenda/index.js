import actions from "./actions.js";
import getters from "./getters.js";
import mutations from "./mutations.js";
export default {
  namespaced: true,
  state() {
    return {
      selectedDate: "",
      selectedSlots: [],
      appointmentNewData: "",
      takenHours: [],
      slotAppointments: [], //The appointments of the currently selected hour slot
    };
  },
  actions,
  getters,
  mutations,
};
