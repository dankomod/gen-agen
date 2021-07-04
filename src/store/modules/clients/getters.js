export default {
  // Returns the data that was inputted in the user form. Used for edits and creations.
  clientNewData(state) {
    return state.clientNewData;
  },
  // Returns the client that was selected by the user trough the search mecanism
  selectedClient(state) {
    return state.selectedClient;
  },
};
