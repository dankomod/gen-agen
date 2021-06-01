export default {
  async newAppointment(context, payload) {
    const newAppointment = {
      timeString: `${payload.date.hour}:${payload.date.minute}`,
      user: payload.user,
      obs: payload.obs,
    };
    const response = await fetch(
      `https://gen-agen-default-rtdb.firebaseio.com/schedule/${payload.date.year}/${payload.date.month}/${payload.date.day}.json`,
      {
        method: "POST",
        body: JSON.stringify(newAppointment),
      }
    );
    const responseData = await response.json();
    if (!response.ok) {
      const error = new Error(
        responseData.message || "Failed to send request."
      );
      throw error;
    }
    // * Must await for the fetch, for the const that has the fetch and must return a value. Must be called from an async function and be awaited to give a response
    return responseData;
  },
  async loadAppointments(context, payload) {
    const response = await fetch(
      `https://gen-agen-default-rtdb.firebaseio.com/schedule/${payload.year}/${payload.month}/${payload.day}.json`
    );
    const responseData = await response.json();
    if (!response.ok) {
      const error = new Error(
        responseData.message || "Failed to send request."
      );
      throw error;
    }
    const appointments = [];
    for (const res in responseData) {
      appointments.push(responseData[res].timeString);
    }
    return appointments;
  },
  setStart(context, payload) {
    context.commit("setStart", payload);
  },
  setEnd(context, payload) {
    context.commit("setEnd", payload);
  },
};
