export default {
  setAgendaDetails(state, agendaDetails) {
    state.agendaDetails = agendaDetails;
  },
  setAgendaHours(state, payload) {
    state.agendaHours = payload;
  },
  setAppointmentInfo(state, appointmentInfo) {
    state.appointmentInfo = appointmentInfo;
  },
  setBaseDate(state, payload) {
    state.baseDate = payload;
  },
  setSelectedHours(state, selectedHours) {
    state.selectedHours = selectedHours;
  },

  ///////////////////////////////////////////

  setSelectedDate(state, selectedDate) {
    state.selectedDate = selectedDate;
  },
  setSelectedSlots(state, selectedSlots) {
    state.selectedSlots = selectedSlots;
  },
  setAppointmentNewData(state, appointmentNewData) {
    state.appointmentNewData = appointmentNewData;
  },
};
