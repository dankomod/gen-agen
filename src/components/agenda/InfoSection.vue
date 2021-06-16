<template>
  <!-- //TODO: change text of this button if a user is being added or an appointment is being made -->
  <base-button @click="toggleSearch">Novo Agendamento</base-button>
  <!-- //TODO: reset the forms if the button is clicked or the search returns a new value -->
  <client-search v-if="showSearch" @selection="selection"></client-search>
  <client-form
    v-if="showClientForm"
    :formData="clientFormData"
    :formEnabled="clientFormEnabled"
  ></client-form>
  <div v-if="showClientForm">
    <base-button buttonType="success" @click="createClient">
      Cadastrar Cliente
    </base-button>
  </div>
  <appointment-form
    v-if="showAppointmentForm"
    :formEnabled="appointmentFormEnabled"
  ></appointment-form>
  <div v-if="showAppointmentForm">
    <base-button buttonType="success" @click="createAppointment"
      >Concluir Agendamento</base-button
    >
  </div>
</template>

<script>
export default {
  methods: {
    async createAppointment() {
      try {
        await this.$store.dispatch("agenda/createAppointment");
        this.toggleAppointmentForm(false);
        // TODO: Clear the State
      } catch (error) {
        console.log(error);
      }
    },
    async createClient() {
      // TODO: Better form validation
      try {
        await this.$store.dispatch("clients/createClient");
        console.log(this.$store.getters["clients/selectedClient"]);
        this.toggleClientForm(false);
        this.toggleAppointmentForm(true);
      } catch (error) {
        console.log(error);
      }
    },
    toggleAppointmentForm(value = true) {
      this.showAppointmentForm = value;
      this.appointmentFormEnabled = value;
    },
    toggleClientForm(value = true) {
      this.showClientForm = value;
      this.clientFormEnabled = value;
    },
    toggleSearch(value = true) {
      this.showSearch = value;
      this.toggleClientForm(!value);
    },
    selection(value, data) {
      if (!value) {
        this.clientFormData = [null, { name: data }];
        this.toggleClientForm(true);
      } else {
        this.toggleAppointmentForm(true);
      }
      this.toggleSearch(false);
    },
    // Called on creation to be sure to reset all data when this component is re-rendered
    resetValues() {
      this.clientFormData = [];
      this.showAppointmentForm = false;
      this.showClientForm = false;
    },
  },
  created() {
    this.resetValues();
  },
  data() {
    return {
      clientFormData: [],
      showAppointmentForm: false,
      showClientForm: false,
      appointmentFormEnabled: true,
      clientFormEnabled: true,
      showSearch: false,
    };
  },
  components: { AppointmentForm, ClientForm, ClientSearch },
};
import AppointmentForm from "./AppointmentForm.vue";
import ClientForm from "./../clients/ClientForm.vue";
import ClientSearch from "./../clients/ClientSearch.vue";
</script>
