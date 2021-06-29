<template>
  <div class="flex flex-col items-center">
    <div class="space-x-2">
      <base-button v-if="showInfoButton" @click="showInfo">
        {{ infoButtonText ? "Mostrar Informações" : "Fechar" }}
      </base-button>
      <base-button @click="showSearch = true">
        {{ appointmentButtonText }}
      </base-button>
    </div>
    <client-search v-if="showSearch" @selection="selection"></client-search>
    <client-form
      v-if="showClientForm"
      :form-data="clientFormData"
      :form-enabled="true"
    ></client-form>
    <div v-if="showClientForm">
      <base-button button-type="success" @click="createClient">
        Cadastrar Cliente
      </base-button>
    </div>
    <appointment-form
      v-if="showAppointmentForm"
      :key="appointmentFormKey"
      :form-enabled="appointmentFormEnabled"
    ></appointment-form>
    <div v-if="showAppointmentForm">
      <base-button button-type="success" @click="createAppointment">
        Concluir Agendamento
      </base-button>
    </div>
  </div>
</template>

<script>
export default {
  components: { AppointmentForm, ClientForm, ClientSearch },
  emits: ["newAppointment", "toggleSlotDetail"],
  data() {
    return {
      appointmentFormEnabled: true,
      appointmentFormKey: 0,
      clientFormData: [],
      infoButtonText: true,
      selectedSlots: [],
      showAppointmentForm: false,
      showClientForm: false,
      showInfoButton: false,
      showSearch: false,
    };
  },
  computed: {
    appointmentButtonText() {
      // If any form is visible
      return this.showAppointmentForm || this.showClientForm
        ? "Pesquisar Novamente"
        : "Novo Agendamento";
    },
  },
  async created() {
    this.resetValues();
    this.selectedSlots = this.$store.getters["agenda/selectedSlots"];
    const takenHours = this.$store.getters["agenda/takenHours"];
    // Show info button if there is any slot selected and it's value is taken
    this.showInfoButton =
      this.selectedSlots &&
      this.selectedSlots.length === 1 &&
      takenHours.includes(this.selectedSlots[0].toString())
        ? true
        : false;
    // Watches the store for changes in the selected slots
    this.$store.watch(
      () => {
        return this.$store.state.selectedSlots;
        //  ? The watch with this getter can't detect when the selectedSlots array looses a value and turns to length = 1
        // //  return this.$store.getters["agenda/selectedSlots"];
      },
      (newValue) => {
        // If newValue is not null and has length 1
        if (newValue && newValue.length === 1) {
          this.showInfoButton = true;
        }
        this.showInfoButton = false;
        console.log(this.$store.getters["agenda/selectedSlots"]);
      },
      { deep: true }
    );
  },
  methods: {
    async createAppointment() {
      const response = await this.$store.dispatch("agenda/createAppointment");
      this.$store.dispatch("setAlertData", response);
      if (response.alertType === "success") {
        this.showAppointmentForm = false;
        this.appointmentFormEnabled = false;
        this.$store.dispatch("agenda/setSelectedSlots", null);
        this.$emit("newAppointment");
      }
    },
    // Creates a new client and resets the rendering
    async createClient() {
      // TODO: Better form validation
      const response = await this.$store.dispatch("clients/createClient");
      this.$store.dispatch("setAlertData", response);
      if (response.alertType === "success") {
        this.toggleCreation(false);
      }
    },
    // Called on creation to assure t reset all data when this component is re-rendered
    resetValues() {
      this.showSearch = false;
      this.showAppointmentForm = false;
      this.showClientForm = false;
    },
    // Called when a client is selected in the search
    selection(value, data) {
      this.clientFormData = [null, { name: data }]; // The same format of a Object.entries output
      if (!value) {
        this.showAppointmentForm = false;
        this.showClientForm = true;
      } else {
        this.showClientForm = false;
        // Assures that the appointment form will hold actual client data by forced re-rendering
        this.appointmentFormKey++;
        this.showAppointmentForm = true;
      }
      this.showSearch = false;
    },
    // Loads the appointments then shows the slot details
    async showInfo() {
      if (this.selectedSlots && this.selectedSlots.length === 1) {
        let slotAppointments = [];
        const responseAppointments = await this.$store.dispatch(
          "agenda/loadAppointments"
        );
        if (!("alertMessage" in responseAppointments)) {
          for (let appointment of Object.entries(responseAppointments)) {
            if (appointment[1].dateTime === this.selectedSlots[0].toString()) {
              const responseClients = await this.$store.dispatch(
                "clients/loadClients",
                appointment[1].clientId
              );
              if (
                responseClients &&
                !("alertMessage" in responseClients) &&
                appointment[1].name !== responseClients.name
              ) {
                appointment[1].name = responseClients.name;
              }
              slotAppointments.push(appointment);
            }
          }
        }
        this.infoButtonText = !this.infoButtonText;
        this.$store.dispatch("agenda/setSlotAppointments", slotAppointments);
      }
      this.$emit("toggleSlotDetail");
    },
  },
};
// eslint-disable-next-line
import { DateTime } from "luxon";
import AppointmentForm from "./AppointmentForm.vue";
import ClientForm from "./../clients/ClientForm.vue";
import ClientSearch from "./../clients/ClientSearch.vue";
</script>
