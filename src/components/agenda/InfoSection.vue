<template>
  <!-- //TODO: change text of this button if a user is being added or an appointment is being made -->
  <base-button @click="showSearch = true">{{
    appointmentButtonText
  }}</base-button>
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
    :key="appointmentFormKey"
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
        this.showAppointmentForm = false;
        this.appointmentFormEnabled = false;
        this.$store.dispatch("agenda/setSelectedSlots", null);
        this.$emit("newAppointment");
      } catch (error) {
        console.log(error);
      }
    },
    async createClient() {
      // TODO: Better form validation
      try {
        await this.$store.dispatch("clients/createClient");
        console.log(this.$store.getters["clients/selectedClient"]);
        this.showClientForm = false;
        this.showAppointmentForm = true;
        this.appointmentFormEnabled = true;
      } catch (error) {
        console.log(error);
      }
    },
    selection(value, data) {
      this.clientFormData = [null, { name: data }];
      if (!value) {
        this.showAppointmentForm = false;
        this.showClientForm = true;
      } else {
        this.showClientForm = false;
        // Forced re-rendering to assure that the appointment form will hold the most recent client data
        this.appointmentFormKey++;
        this.showAppointmentForm = true;
      }
      this.showSearch = false;
    },
    // Called on creation to be sure to reset all data when this component is re-rendered
    resetValues() {
      this.showSearch = false;
      this.showAppointmentForm = false;
      this.showClientForm = false;
    },
  },
  computed: {
    appointmentButtonText() {
      // If any form is shown...
      return this.showAppointmentForm || this.showClientForm
        ? "Pesquisar Novamente"
        : "Novo Agendamento";
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
      appointmentFormKey: 0,
    };
  },
  components: { AppointmentForm, ClientForm, ClientSearch },
  emits: ["newAppointment"],
};
import AppointmentForm from "./AppointmentForm.vue";
import ClientForm from "./../clients/ClientForm.vue";
import ClientSearch from "./../clients/ClientSearch.vue";
</script>
