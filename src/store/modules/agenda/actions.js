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

  async newAppointment(getters, payload) {
    const appointmentInfo = this.getters["agenda/appointmentInfo"];
    if (
      appointmentInfo.name &&
      appointmentInfo.phone &&
      appointmentInfo.price
    ) {
      appointmentInfo.addedBy = payload;
      appointmentInfo["id"] = DateTime.now();
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
        // * Must await for the fetch and for the const that has the fetch. Must be called from an async function and be awaited to give a response
        if (!response.ok) {
          const error = new Error(
            responseData.message || "Erro ao enviar solicitação."
          );
          throw error;
        }
      }
    } else {
      const error = new Error(
        "Preencha o nome e o telefone do cliente e o preço do serviço."
      );
      throw error;
    }
  },

  async loadAppointments(context, payload) {
    const response = await fetch(
      `https://gen-agen-default-rtdb.firebaseio.com/schedule/${payload.year}/${payload.month}/${payload.day}.json`
    );
    const responseData = await response.json();
    if (!response.ok) {
      const error = new Error(
        responseData.message || "Erro ao enviar solicitação."
      );
      throw error;
    }
    // Sets all the response in the State
    context.commit("setAgendaDetails", responseData);
    // TODO: add error catching
    // TODO: do this on AgendaMenu
    // Preps the counts of appointments
    const takenSlots = [];
    for (const res in responseData) {
      takenSlots.push(responseData[res].timeString);
    }
    return takenSlots;
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
};
