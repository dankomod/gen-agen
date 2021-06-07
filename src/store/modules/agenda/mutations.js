export default {
  setBaseDate(state, payload) {
    state.baseDate = payload;
  },
  setAgendaHours(state, payload) {
    state.agendaHours = payload;
  },
  setSelectecHours(state, selectedHours) {
    state.selectedHours = selectedHours;
  },
  setAppointmentInfo(state, appointmentInfo) {
    state.appointmentInfo = appointmentInfo;
  },
};
