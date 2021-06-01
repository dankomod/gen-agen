export default {
  setStart(state, payload) {
    // console.log("setStart Mutation");
    // console.log(payload);
    state.start = payload;
  },
  setEnd(state, payload) {
    // console.log("setEnd Mutation");
    // console.log(payload);
    state.end = payload;
  },
};
