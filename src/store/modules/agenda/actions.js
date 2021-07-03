// eslint-disable-next-line no-unused-vars
import { DateTime } from "luxon";
export default {
  async createAppointment(context) {
    let alertData = {};
    const appointmentNewData = this.getters["agenda/appointmentNewData"];
    let selectedClient = this.getters["clients/selectedClient"];
    const newData = this.getters["clients/formNewData"];
    if (Object.values(newData).length !== 0) {
      await context.dispatch("clients/editClient", selectedClient[0], {
        root: true,
      });
      const updatedClient = await context.dispatch(
        "clients/loadClients",
        selectedClient[0],
        { root: true }
      );
      await context.dispatch(
        "clients/setSelectedClient",
        [selectedClient[0], updatedClient],
        { root: true }
      );
      selectedClient = this.getters["clients/selectedClient"];
    }
    if (
      appointmentNewData.transport &&
      (!selectedClient[1].address ||
        !selectedClient[1].number ||
        !selectedClient[1].district ||
        !selectedClient[1].city)
    ) {
      alertData["alertMessage"] = "Complete o endereço do cliente";
      alertData["alertType"] = "warning";
      return alertData;
    }
    if (!appointmentNewData.price) {
      alertData["alertMessage"] = "Informe um preço";
      alertData["alertType"] = "danger";
      return alertData;
    }
    const selectedDate = this.getters["agenda/selectedDate"];
    const selectedSlots = this.getters["agenda/selectedSlots"];
    appointmentNewData.creationDate = DateTime.now();
    appointmentNewData.createdBy = this.getters.userId;
    // // Having the client's name and ID on the appointment information minimizes API requests
    appointmentNewData.clientId = selectedClient[0];
    appointmentNewData.name = selectedClient[1].name;
    for (let selectedSlot of selectedSlots) {
      appointmentNewData.dateTime = selectedSlot;
      const response = await fetch(
        `https://gen-agen-default-rtdb.firebaseio.com/schedule/${selectedDate.year}/${selectedDate.month}/${selectedDate.day}.json?auth=${this.getters.token}`,
        { method: "POST", body: JSON.stringify(appointmentNewData) }
      );
      const responseData = await response.json();
      if (!response.ok) {
        alertData["alertMessage"] = responseData.message;
        alertData["alertType"] = "danger";
      }
      // Adds a dateTime for this appointment in the client's data
      context.dispatch(
        "clients/setFormNewData",
        { lastAppointment: appointmentNewData.creationDate },
        { root: true }
      );
      // Sends the new appointment datetime to the API
      context.dispatch("clients/editClient", selectedClient[0], { root: true }); // (action, clientID, root: true to reach a namespaced action)
    }
    alertData["alertMessage"] =
      Object.values(selectedSlots).length > 1
        ? "Agendamentos criados"
        : "Agendamento criado";
    alertData["alertType"] = "success";
    return alertData;
  },
  async deleteAppointment(context, appointmentId) {
    let alertData = {};
    const selectedDate = this.getters["agenda/selectedDate"];
    const response = await fetch(
      `https://gen-agen-default-rtdb.firebaseio.com/schedule/${selectedDate.year}/${selectedDate.month}/${selectedDate.day}/${appointmentId}.json?auth=${this.getters.token}`,
      {
        method: "DELETE",
      }
    );
    const responseData = await response.json();
    if (!response.ok) {
      alertData["alertMessage"] = responseData.message;
      alertData["alertType"] = "danger";
    } else {
      alertData["alertMessage"] = "Agendamento removido";
      alertData["alertType"] = "success";
    }
    return alertData;
  },
  async editAppointment(context, appointmentId) {
    let alertData = {};
    const selectedDate = this.getters["agenda/selectedDate"];
    const response = await fetch(
      `https://gen-agen-default-rtdb.firebaseio.com/schedule/${selectedDate.year}/${selectedDate.month}/${selectedDate.day}/${appointmentId}.json?auth=${this.getters.token}`,
      {
        method: "PATCH",
        body: JSON.stringify(this.getters["agenda/appointmentNewData"]),
      }
    );
    const responseData = await response.json();
    if (!response.ok) {
      alertData["alertMessage"] = responseData.message;
      alertData["alertType"] = "danger";
    } else {
      alertData["alertMessage"] = "Agendamento editado";
      alertData["alertType"] = "success";
    }
    return alertData;
  },
  async loadAppointments(context) {
    let alertData = {};
    const selectedDate = this.getters["agenda/selectedDate"];
    const response = await fetch(
      `https://gen-agen-default-rtdb.firebaseio.com/schedule/${selectedDate.year}/${selectedDate.month}/${selectedDate.day}.json?auth=${this.getters.token}`
    );
    const responseData = await response.json();
    if (!response.ok) {
      alertData["alertMessage"] = responseData.message;
      alertData["alertType"] = "danger";
      return alertData;
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
  // TODO: Update error method
  async monthAppointments(context, payload) {
    let alertData = {};
    const response = await fetch(
      `https://gen-agen-default-rtdb.firebaseio.com/schedule/${payload.year}/${payload.month}.json?auth=${this.getters.token}`
    );
    const responseData = await response.json();
    if (!response.ok) {
      alertData["alertMessage"] = responseData.message;
      alertData["alertType"] = "danger";
      return alertData;
    } else {
      // Filters out null days and months
      if (responseData !== null) {
        const cleanResponse = {};
        for (let day of Object.entries(responseData)) {
          if (day[1] !== null) {
            cleanResponse[day[0]] = day[1];
          }
        }
        return cleanResponse;
      }
    }
  },
  setAppointmentNewData(context, appointmentNewData) {
    context.commit("setAppointmentNewData", appointmentNewData);
  },
  // Sets the date selected by the user
  setSelectedDate(context, selectedDate) {
    context.commit("setSelectedDate", selectedDate);
  },
  setSelectedSlots(context, selectedSlots) {
    context.commit("setSelectedSlots", selectedSlots);
  },
  setSlotAppointments(context, slotAppointments) {
    context.commit("setSlotAppointments", slotAppointments);
  },
};
