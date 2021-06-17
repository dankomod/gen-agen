<template>
  <base-button v-if="showInfoButton" @click="showInfo">
    Mostrar Informações
  </base-button>
  <slot-detail
    v-if="showSlotDetail"
    :slot-appointments="slotAppointments"
  ></slot-detail>
  <base-button @click="showSearch = true">
    {{ appointmentButtonText }}
  </base-button>
  <client-search v-if="showSearch" @selection="selection"></client-search>
  <client-form
    v-if="showClientForm"
    :form-data="clientFormData"
    :form-enabled="clientFormEnabled"
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
</template>

<script>
export default {
  components: { AppointmentForm, ClientForm, ClientSearch, SlotDetail },
  emits: ["newAppointment"],
  data() {
    return {
      clientFormData: [],
      showAppointmentForm: false,
      showClientForm: false,
      appointmentFormEnabled: true,
      clientFormEnabled: true,
      showSearch: false,
      appointmentFormKey: 0,
      showInfoButton: false,
      selectedSlots: [],
      showSlotDetail: false,
      slotAppointments: [],
    };
  },
  computed: {
    appointmentButtonText() {
      // If any form is shown...
      return this.showAppointmentForm || this.showClientForm
        ? "Pesquisar Novamente"
        : "Novo Agendamento";
    },
  },
  async created() {
    this.resetValues();
    this.selectedSlots = this.$store.getters["agenda/selectedSlots"];
    const takenHours = this.$store.getters["agenda/takenHours"];

    // If newValue is not null, has length 1 and
    this.showInfoButton =
      this.selectedSlots &&
      this.selectedSlots.length === 1 &&
      takenHours.includes(this.selectedSlots[0].toString())
        ? true
        : false;
    this.$store.watch(
      () => {
        return this.$store.getters["agenda/selectedSlots"];
      },
      (newValue) => {
        // If newValue is not null and has length 1
        if (newValue && newValue.length === 1) {
          this.showInfoButton = true;
        }
        this.showInfoButton = false;
      }
    );
  },
  methods: {
    async showInfo() {
      if (this.selectedSlots && this.selectedSlots.length === 1) {
        // for (let appointment of Object.values(
        //   await this.$store.dispatch("agenda/loadAppointments")
        // )) {
        //   if (appointment.dateTime === this.selectedSlots[0].toString()) {
        //     this.slotAppointments.push(appointment);
        //   }
        // }
        for (let appointment of Object.entries(
          await this.$store.dispatch("agenda/loadAppointments")
        )) {
          if (appointment[1].dateTime === this.selectedSlots[0].toString()) {
            this.slotAppointments.push(appointment);
          }
        }
      }
      this.showSlotDetail = true;
    },
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
};
// eslint-disable-next-line
import { DateTime } from "luxon";
import AppointmentForm from "./AppointmentForm.vue";
import SlotDetail from "./SlotDetail.vue";
import ClientForm from "./../clients/ClientForm.vue";
import ClientSearch from "./../clients/ClientSearch.vue";
</script>
