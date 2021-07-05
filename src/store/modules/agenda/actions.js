// eslint-disable-next-line no-unused-vars
import { DateTime } from "luxon";
export default {
  async createAppointment(context) {
    let alertData = {}; // Alert container
    const appointmentNewData = this.getters["agenda/appointmentNewData"]; // Appointment data
    let selectedClient = this.getters["clients/selectedClient"]; // Selected client
    const newData = this.getters["clients/clientNewData"]; // ! What is this?
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
    // Data validation
    // Address check
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
      // Price check
    } else if (!appointmentNewData.price) {
      alertData["alertMessage"] = "Informe um preço";
      alertData["alertType"] = "danger";
      return alertData;
      // Payment method check
    } else if (!appointmentNewData.paymentMethod) {
      alertData["alertMessage"] = "Informe uma forma de pagamento";
      alertData["alertType"] = "danger";
      return alertData;
    }
    // Date and slot of the appointment(s)
    const selectedDate = this.getters["agenda/selectedDate"];
    const selectedSlots = this.getters["agenda/selectedSlots"];
    appointmentNewData.creationDate = DateTime.now();
    // Who is creating the appointment
    appointmentNewData.createdBy = this.getters.userId;
    // Having the client's name and ID on the appointment information minimizes API requests
    appointmentNewData.clientId = selectedClient[0];
    appointmentNewData.name = selectedClient[1].name;
    // Iterates over (possible) multiple slot selections
    for (let selectedSlot of selectedSlots) {
      appointmentNewData.dateTime = selectedSlot; // The time of the slot in DateTime format
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
        "clients/setClientNewData",
        { lastAppointment: appointmentNewData.creationDate },
        { root: true }
      );
      // Sends the new appointment datetime to the API
      context.dispatch("clients/editClient", selectedClient[0], { root: true }); // format: (action, clientID, root: true to reach a namespaced action)
    }
    // Success alert
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
    // TODO: Error catching
    // If any appointment, pushes an array to the state with all the selected hours. This will be used by TimeSlots and InfoSection
    if (await responseData) {
      const takenHours = [];
      for (let appointment of Object.values(responseData)) {
        takenHours.push(appointment.dateTime);
      }
      context.commit("setTakenHours", takenHours);
    }
    return responseData;
  },
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
  // Sets the data of a new appointment
  setAppointmentNewData(context, appointmentNewData) {
    context.commit("setAppointmentNewData", appointmentNewData);
  },
  // Sets the date selected by the user
  setSelectedDate(context, selectedDate) {
    context.commit("setSelectedDate", selectedDate);
  },
  // Sets the slot(s) selected by the user
  setSelectedSlots(context, selectedSlots) {
    context.commit("setSelectedSlots", selectedSlots);
  },
  // Sets the appointments of the currently selected slot
  setSlotAppointments(context, slotAppointments) {
    context.commit("setSlotAppointments", slotAppointments);
  },
};
