export default {
  // Posts a new client to the API.
  // * POST requests to the Firebase Rest API automatically creates an ID.
  async createClient({ dispatch }) {
    const formNewData = this.getters["clients/formNewData"];
    console.log(formNewData);
    if (formNewData.name !== undefined && formNewData.phone !== undefined) {
      const response = await fetch(
        "https://gen-agen-default-rtdb.firebaseio.com/clients.json",
        { method: "POST", body: JSON.stringify(formNewData) }
      );
      const responseData = await response.json();
      if (!response.ok) {
        const error = new Error(responseData.message);
        throw error;
      } else {
        dispatch("setSelectedClient", [responseData.name, formNewData]); // [id, { data }]
      }
    } else {
      const error = "Data is lacking";
      throw error;
    }
  },
  // Deletes a client based on it's ID
  async deleteClient(getters, payload) {
    const response = await fetch(
      `https://gen-agen-default-rtdb.firebaseio.com/clients/${payload}.json`,
      { method: "DELETE" }
    );
    const responseData = await response.json();
    if (!response.ok) {
      const error = new Error(responseData.message);
      throw error;
    }
  },
  // Edits a client based on it's ID. Retrieves the data to be changed from the state
  async editClient(getters, payload) {
    const response = await fetch(
      `https://gen-agen-default-rtdb.firebaseio.com/clients/${payload}.json`,
      {
        method: "PATCH",
        body: JSON.stringify(this.getters["clients/formNewData"]),
      }
    );
    const responseData = await response.json();
    if (!response.ok) {
      const error = new Error(responseData.message);
      throw error;
    }
  },
  // Load all clients from the API
  async loadClients() {
    const response = await fetch(
      'https://gen-agen-default-rtdb.firebaseio.com/clients.json?orderBy="$key"'
    );
    const responseData = await response.json();
    if (!response.ok) {
      const error = new Error(responseData.message);
      throw error;
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
