export default {
  setAppointmentNewData(state, appointmentNewData) {
    state.appointmentNewData = appointmentNewData;
  },
  setSelectedDate(state, selectedDate) {
    state.selectedDate = selectedDate;
  },
  setSelectedSlots(state, selectedSlots) {
    state.selectedSlots = selectedSlots;
  },
  setTakenHours(state, takenHours) {
    state.takenHours = takenHours;
  },
  setSlotAppointments(state, slotAppointments) {
    state.slotAppointments = slotAppointments;
  },
};
