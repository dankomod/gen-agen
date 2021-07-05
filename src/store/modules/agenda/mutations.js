export default {
  // Sets the data of a new appointment
  setAppointmentNewData(state, appointmentNewData) {
    state.appointmentNewData = appointmentNewData;
  },
  // Sets the date selected by the user
  setSelectedDate(state, selectedDate) {
    state.selectedDate = selectedDate;
  },
  // Sets the slot(s) selected by the user
  setSelectedSlots(state, selectedSlots) {
    state.selectedSlots = selectedSlots;
  },
  // Sets the appointments of the currently selected slot
  setSlotAppointments(state, slotAppointments) {
    state.slotAppointments = slotAppointments;
  },
  // Set an array of all the taken slots on the currently selected date
  setTakenHours(state, takenHours) {
    state.takenHours = takenHours;
  },
};
