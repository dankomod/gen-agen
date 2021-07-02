export default {
  async setHour(context, payload) {
    let alertData = {};
    const response = await fetch(
      `https://gen-agen-default-rtdb.firebaseio.com/configs.json?auth=${this.getters.token}`,
      {
        method: "PATCH",
        body: JSON.stringify({ [payload[0]]: payload[1] }), // [] allow a variable to be used as key
      }
    );
    const responseData = await response.json();
    if (!response.ok) {
      alertData["alertMessage"] = responseData.message;
      alertData["alertType"] = "danger";
    } else {
      alertData["alertMessage"] = "Novo horário configurado";
      alertData["alertType"] = "success";
    }
    context.commit("setClosingHour", payload);
    return alertData;
  },
  setOpeningHour(context, newOpeningHour) {
    context.commit("setOpeningHour", newOpeningHour);
  },
};
