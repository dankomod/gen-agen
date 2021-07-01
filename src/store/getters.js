export default {
  alertData(state) {
    return state.alertData;
  },
  isAuthenticated(state) {
    // !! converts to a Boolean, will return true if there is a token
    return !!state.token;
  },
  token(state) {
    return state.token;
  },
  // gets the user Id and makes it available in the root
  userId(state) {
    return state.userId;
  },
};
