export default {
  async setHour(context, payload) {
    const response = await fetch(
      `https://gen-agen-default-rtdb.firebaseio.com/configs.json?auth=${this.getters.token}`,
      {
        method: "PATCH",
        body: JSON.stringify({ [payload[0]]: payload[1] }), // [var] allow a variable to be used as key
      }
    );
    const responseData = await response.json();
    const alertData = {}; // Alert container
    if (!response.ok) {
      alertData["alertMessage"] = responseData.message;
      alertData["alertType"] = "danger";
    } else {
      alertData["alertMessage"] = "Configurações salvas";
      alertData["alertType"] = "success";
    }
    context.commit("setHour", payload);
    return alertData;
  },
  async getPaymentMethods(context) {
    const response = await fetch(
      `https://gen-agen-default-rtdb.firebaseio.com/configs/paymentMethods.json?auth=${this.getters.token}`
    );
    const responseData = await response.json();
    if (!response.ok) {
      const alertData = {}; // Alert container
      alertData["alertMessage"] = responseData.message;
      alertData["alertType"] = "danger";
      return alertData;
    }
    context.commit("setPaymentMethods", responseData);
    return responseData;
  },
  async newPaymentMethod(context, payload) {
    const response = await fetch(
      `https://gen-agen-default-rtdb.firebaseio.com/configs.json?auth=${this.getters.token}`,
      {
        method: "PATCH",
        body: JSON.stringify({ paymentMethods: payload }),
      }
    );
    const responseData = await response.json();
    const alertData = {}; // Alert container
    if (!response.ok) {
      alertData["alertMessage"] = responseData.message;
      alertData["alertType"] = "danger";
    } else {
      alertData["alertMessage"] = "Configurações salvas";
      alertData["alertType"] = "success";
    }
    return alertData;
  },
  async getHours(context) {
    for (let hour of ["openingHour", "closingHour"]) {
      const response = await fetch(
        `https://gen-agen-default-rtdb.firebaseio.com/configs/${hour}.json?auth=${this.getters.token}`
      );
      const responseData = await response.json();
      if (!response.ok) {
        const alertData = {}; // Alert container
        alertData["alertMessage"] = responseData.message;
        alertData["alertType"] = "danger";
        return alertData;
      }
      context.commit("setHour", { [hour]: responseData });
    }
  },
};
