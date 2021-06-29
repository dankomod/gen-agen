// eslint-disable-next-line no-unused-vars
import { DateTime } from "luxon";
export default {
  // Posts a new client to the API.
  // * POST requests to the Firebase Rest API automatically creates an ID.
  async createClient({ dispatch }) {
    const formNewData = this.getters["clients/formNewData"];
    formNewData.creationDate = DateTime.now();
    let alertData = {};
    if (formNewData.name !== undefined && formNewData.phone !== undefined) {
      const response = await fetch(
        "https://gen-agen-default-rtdb.firebaseio.com/clients.json",
        { method: "POST", body: JSON.stringify(formNewData) }
      );
      const responseData = await response.json();
      if (!response.ok) {
        alertData["alertMessage"] = responseData.message;
        alertData["alertType"] = "danger";
      } else {
        dispatch("setSelectedClient", [responseData.name, formNewData]); // [id, { data }]
        alertData["alertMessage"] = "Cadastro criado";
        alertData["alertType"] = "success";
      }
    } else {
      alertData["alertMessage"] = "Data is lacking";
      alertData["alertType"] = "danger";
    }
    return alertData;
  },
  // Deletes a client based on it's ID
  async deleteClient(getters, payload) {
    let alertData = {};
    const response = await fetch(
      `https://gen-agen-default-rtdb.firebaseio.com/clients/${payload}.json`,
      { method: "DELETE" }
    );
    const responseData = await response.json();
    if (!response.ok) {
      alertData["alertMessage"] = responseData.message;
      alertData["alertType"] = "danger";
    } else {
      alertData["alertMessage"] = "Cadastro removido";
      alertData["alertType"] = "success";
    }
    return alertData;
  },
  // Edits a client based on it's ID. Retrieves the data to be changed from the state
  async editClient(getters, payload) {
    const newData = this.getters["clients/formNewData"];
    let alertData = {};
    if (Object.values(newData).length === 0) {
      alertData["alertMessage"] = "Nenhum dado foi inserido";
      alertData["alertType"] = "info";
    } else {
      const response = await fetch(
        `https://gen-agen-default-rtdb.firebaseio.com/clients/${payload}.json`,
        {
          method: "PATCH",
          body: JSON.stringify(newData),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        alertData["alertMessage"] = responseData.message;
        alertData["alertType"] = "danger";
      } else {
        alertData["alertMessage"] = "Cadastro editado";
        alertData["alertType"] = "success";
      }
      this.dispatch("clients/setFormNewData", {}, { root: true });
    }
    return alertData;
  },
  // Load all clients from the API
  async loadClients(getters, payload) {
    let alertData = {};
    const query = payload
      ? `https://gen-agen-default-rtdb.firebaseio.com/clients/${payload}.json`
      : 'https://gen-agen-default-rtdb.firebaseio.com/clients.json?orderBy="$key"';
    const response = await fetch(query);
    const responseData = await response.json();
    if (!response.ok) {
      alertData["alertMessage"] = responseData.message;
      alertData["alertType"] = "danger";
      return alertData;
    }
    return responseData;
  },
  // Forwards data from clients form's inputs
  setFormNewData(context, formNewData) {
    context.commit("setFormNewData", formNewData);
  },
  // Forwards data of the client that was selected by the user trough the search mecanism
  setSelectedClient(context, selectedClient) {
    context.commit("setSelectedClient", selectedClient);
  },
};
