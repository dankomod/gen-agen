export default {
  setAlertData(state, alertData) {
    state.alertData = alertData;
  },
  setUser(state, payload) {
    state.token = payload.token;
    state.userId = payload.userId;
  },
};
