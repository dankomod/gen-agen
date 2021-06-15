export default {
  // Returns the data that was inputted in the user form. Used for edits and creations.
  formNewData(state) {
    return state.formNewData;
  },
  // Returns the client that was selected by the user trough the search mecanism
  selectedClient(state) {
    return state.selectedClient;
  },
};
