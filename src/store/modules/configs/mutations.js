export default {
  setHour(state, newHour) {
    state[Object.keys(newHour)[0]] = Object.values(newHour)[0];
  },
};
