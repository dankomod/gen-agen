// eslint-disable-next-line no-unused-vars
import { DateTime } from "luxon";
export default {
  // Posts a new client to the API. // * "POST" requests to the Firebase Rest API automatically creates an ID.
  async createClient(context) {
    const clientNewData = this.getters["clients/clientNewData"];
    clientNewData.creationDate = DateTime.now();
    clientNewData.createdBy = this.getters.userId;
    const alertData = {}; // Alert container
    if (clientNewData.name !== undefined && clientNewData.phone !== undefined) {
      const response = await fetch(
        `https://gen-agen-default-rtdb.firebaseio.com/clients.json?auth=${this.getters.token}`,
        { method: "POST", body: JSON.stringify(clientNewData) }
      );
      const responseData = await response.json();
      if (!response.ok) {
        alertData["alertMessage"] = responseData.message;
        alertData["alertType"] = "danger";
      } else {
        context.dispatch("setSelectedClient", [
          responseData.name,
          clientNewData,
        ]); // [id, { data }]
        alertData["alertMessage"] = "Cadastro criado";
        alertData["alertType"] = "success";
      }
    } else {
      alertData["alertMessage"] = "Informe um Nome e um Telefone";
      alertData["alertType"] = "danger";
    }
    return alertData;
  },
  // Deletes a client based on it's ID
  async deleteClient(getters, payload) {
    const response = await fetch(
      `https://gen-agen-default-rtdb.firebaseio.com/clients/${payload}.json?auth=${this.getters.token}`,
      { method: "DELETE" }
    );
    const responseData = await response.json();
    const alertData = {}; // Alert container
    if (!response.ok) {
      alertData["alertMessage"] = responseData.message;
      alertData["alertType"] = "danger";
    } else {
      alertData["alertMessage"] = "Cadastro removido";
      alertData["alertType"] = "success";
    }
    return alertData;
  },
  // Edits a client based on ID. Retrieves the data to be changed from the state
  async editClient(getters, payload) {
    const newData = this.getters["clients/clientNewData"];
    const alertData = {}; // Alert container
    if (Object.values(newData).length === 0) {
      alertData["alertMessage"] = "Nenhum dado foi inserido";
      alertData["alertType"] = "info";
    } else {
      const response = await fetch(
        `https://gen-agen-default-rtdb.firebaseio.com/clients/${payload}.json?auth=${this.getters.token}`,
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
      this.dispatch("clients/setClientNewData", {}, { root: true });
    }
    return alertData;
  },
  // Load all clients from the API
  async loadClients(getters, payload) {
    const query = payload
      ? `https://gen-agen-default-rtdb.firebaseio.com/clients/${payload}.json?auth=${this.getters.token}`
      : `https://gen-agen-default-rtdb.firebaseio.com/clients.json?orderBy="$key"&auth=${this.getters.token}`;
    const response = await fetch(query);
    const responseData = await response.json();
    if (!response.ok) {
      const alertData = {}; // Alert container
      alertData["alertMessage"] = responseData.message;
      alertData["alertType"] = "danger";
      return alertData;
    }
    return responseData;
  },
  // Forwards data from clients form's inputs
  setClientNewData(context, clientNewData) {
    context.commit("setClientNewData", clientNewData);
  },
  // Forwards data of the client that was selected by the user trough the search mecanism
  setSelectedClient(context, selectedClient) {
    context.commit("setSelectedClient", selectedClient);
  },
};
