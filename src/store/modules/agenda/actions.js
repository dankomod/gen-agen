// eslint-disable-next-line no-unused-vars
import { DateTime } from "luxon";
export default {
  async editAppointment(getters, payload) {
    let entryId = "";
    // For entry in entries of the agendaDetails State value
    for (let entry of Object.entries(this.getters["agenda/agendaDetails"])) {
      // If there is a entry with a name value equals to the payload name value (and times)
      if (entry[1].id === payload.id) {
        // The entry's id is the one to be deleted
        entryId = entry[0];
      } // TODO: else return error
    }
    const editData = JSON.parse(JSON.stringify(payload));
    delete editData.dateTime;
    const response = await fetch(
      `https://gen-agen-default-rtdb.firebaseio.com/schedule/${payload.dateTime.year}/${payload.dateTime.month}/${payload.dateTime.day}/${entryId}.json`,
      { method: "PATCH", body: JSON.stringify(editData) }
    ); //TODO: error catching
    const responseData = await response;
    if (!response.ok) {
      const error = new Error(
        responseData.message || "Erro ao enviar solicitação."
      );
      throw error;
    }
  },

  async removeAppointment(context, payload) {
    let entryId = "";
    // For entry in entries of the agendaDetails State value
    for (let entry of Object.entries(this.getters["agenda/agendaDetails"])) {
      // If there is a entry with a name value equals to the payload name value (and times)
      if (entry[1].id === payload.id) {
        // The entry's id is the one to be deleted
        entryId = entry[0];
      } // TODO: else return error
    }
    const response = await fetch(
      `https://gen-agen-default-rtdb.firebaseio.com/schedule/${payload.dateTime.year}/${payload.dateTime.month}/${payload.dateTime.day}/${entryId}.json`,
      { method: "DELETE" }
    );
    const responseData = JSON.stringify(response);
    if (!response.ok) {
      const error = new Error(
        responseData.message || "Erro ao enviar solicitação."
      );
      throw error;
    }
  },

  setBaseDate(context, payload) {
    context.commit("setBaseDate", payload);
  },

  setAgendaHours(context, agendaHours) {
    context.commit("setAgendaHours", agendaHours);
  },

  setSelectedHours(context, selectedHours) {
    context.commit("setSelectedHours", selectedHours);
  },

  setAppointmentInfo(context, appointmentInfo) {
    context.commit("setAppointmentInfo", appointmentInfo);
  },

  ///////////////////////////////////////////

  // Sets the date selected by the user
  setSelectedDate(context, selectedDate) {
    context.commit("setSelectedDate", selectedDate);
  },
  setSelectedSlots(context, selectedSlots) {
    context.commit("setSelectedSlots", selectedSlots);
  },
  setAppointmentNewData(context, appointmentNewData) {
    context.commit("setAppointmentNewData", appointmentNewData);
  },
  async createAppointment() {
    const selectedDate = this.getters["agenda/selectedDate"];
    const selectedSlots = this.getters["agenda/selectedSlots"];
    const appointmentNewData = this.getters["agenda/appointmentNewData"];
    const selectedClient = this.getters["clients/selectedClient"];
    // Adds the client's name and ID to the appointment information. The name is needed despite of the ID because it avoids requests to get the client name when an appointment is shown
    appointmentNewData.clientId = selectedClient[0];
    appointmentNewData.name = selectedClient[1].name;
    for (let selectedSlot of selectedSlots) {
      appointmentNewData.dateTime = "";
      appointmentNewData.dateTime = selectedSlot;
      // TODO:better error handling
      if (appointmentNewData.price !== undefined) {
        const response = await fetch(
          `https://gen-agen-default-rtdb.firebaseio.com/schedule/${selectedDate.year}/${selectedDate.month}/${selectedDate.day}.json`,
          { method: "POST", body: JSON.stringify(appointmentNewData) }
        );
        const responseData = await response.json();
        if (!response.ok) {
          const error = new Error(responseData.message);
          throw error;
        }
        // } else {
        //   dispatch("setSelectedClient", [responseData.name, formNewData]); // [id, { data }]
        // }
      } else {
        const error = "Data is lacking";
        throw error;
      }
    }
  },
  async loadAppointments(context) {
    const selectedDate = this.getters["agenda/selectedDate"];
    const response = await fetch(
      `https://gen-agen-default-rtdb.firebaseio.com/schedule/${selectedDate.year}/${selectedDate.month}/${selectedDate.day}.json`
    );
    const responseData = await response.json();
    if (!response.ok) {
      const error = new Error(
        responseData.message || "Erro ao enviar solicitação."
      );
      throw error;
    }
    // If any appointment, pushes an array to the state with all the selected hours. This will be used by TimeSlots and InfoSection
    // * Having the array in the State allows fast data access
    if (await responseData) {
      const takenHours = [];
      for (let appointment of Object.values(responseData)) {
        takenHours.push(appointment.dateTime);
      }
      context.commit("setTakenHours", takenHours);
    }
    return responseData;
  },
};
