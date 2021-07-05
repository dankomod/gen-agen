import actions from "./actions.js";
import getters from "./getters.js";
import mutations from "./mutations.js";
export default {
  namespaced: true,
  state() {
    return {
      selectedDate: "", // Currently selected date
      selectedSlots: [], // Currently selected slots
      appointmentNewData: "", // Data of a new appointment
      takenHours: [], // Array of all the taken slots on the currently selected date
      slotAppointments: [], // Appointments of the currently selected hour slot
    };
  },
  actions,
  getters,
  mutations,
};
