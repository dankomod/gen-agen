export default {
  // Data of a new appointment
  appointmentNewData(state) {
    return state.appointmentNewData;
  },
  // Currently selected date
  selectedDate(state) {
    return state.selectedDate;
  },
  // Currently selected slots
  selectedSlots(state) {
    return state.selectedSlots;
  },
  // Appointments of the currently selected slot
  slotAppointments(state) {
    return state.slotAppointments;
  },
  // Array of all the taken slots on the currently selected date
  takenHours(state) {
    return state.takenHours;
  },
};
