import { DateTime } from "luxon";
export default {
  async newAppointment(getters, payload) {
    const appointmentInfo = this.getters["agenda/appointmentInfo"];
    appointmentInfo.addedBy = payload;
    const baseDate = this.getters["agenda/baseDate"];
    for (let selectedHour of this.getters["agenda/selectedHours"]) {
      appointmentInfo.timeString = selectedHour.toFormat("HH:mm");
      const response = await fetch(
        `https://gen-agen-default-rtdb.firebaseio.com/schedule/${baseDate.year}/${baseDate.month}/${baseDate.day}.json`,
        {
          method: "POST",
          body: JSON.stringify(appointmentInfo),
        }
      );
      const responseData = await response.json();
      console.log(responseData);
    }
    // TODO: add error catching
    // // * Must await for the fetch for the const that has the fetch and must return a value. Must be called from an async function and be awaited to give a response
    // // return responseData;
    // * Must await for the fetch and for the const that has the fetch. Must be called from an async function and be awaited to give a response
  },
  async loadAppointments(context, payload) {
    const response = await fetch(
      `https://gen-agen-default-rtdb.firebaseio.com/schedule/${payload.year}/${payload.month}/${payload.day}.json`
    );
    const responseData = await response.json();
    // TODO: add error catching
    const appointments = [];
    for (const res in responseData) {
      appointments.push(responseData[res].timeString);
    }
    return appointments;
  },
  setBaseDate(context, payload) {
    context.commit("setBaseDate", payload);
  },
  // TODO: find a way to avoid having to use DateTime like this
  nothing() {
    DateTime.now();
  },
  setAgendaHours(context, agendaHours) {
    context.commit("setAgendaHours", agendaHours);
  },
  setSelectecHours(context, selectedHours) {
    context.commit("setSelectecHours", selectedHours);
  },
  setAppointmentInfo(context, appointmentInfo) {
    context.commit("setAppointmentInfo", appointmentInfo);
  },
};
