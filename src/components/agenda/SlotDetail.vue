<template>
  <div
    v-for="(appointment, index) in slotAppointments"
    :key="appointment[0]"
    class="p-1"
  >
    <div
      v-if="
        showAppointmentItem === null || showAppointmentItem === appointment[0]
      "
      class="p-4 space-y-1 border border-indigo-300 hover:bg-indigo-100"
    >
      <p v-if="Object.keys(slotAppointments).length > 1" class="pb-2 text-lg">
        Agendamento {{ index + 1 }}
      </p>
      <appointment-form
        :form-data="appointment"
        :form-enabled="appointmentFormEnabled"
        class="pb-2"
      ></appointment-form>
      <client-form
        v-if="showClientForm && selectedClient[0] === appointment[1].clientId"
        :form-data="selectedClient"
        :form-enabled="clientFormEnabled"
        class="pb-2"
      ></client-form>
      <!-- Action Buttons -->
      <div class="flex flex-row justify-between">
        <!-- Client Action Buttons -->
        <span v-if="!appointmentFormEnabled" class="space-x-2">
          <!-- View Client Information Button -->
          <!-- // TODO: Prevent the conditional formatting of the view client button on non-selected appointments -->
          <base-button
            v-if="!clientFormEnabled"
            @click="viewClient(appointment[1].clientId)"
          >
            {{ !showClientForm ? "Ver Cliente" : "Ocultar Detalhes" }}
          </base-button>
          <base-button
            v-if="!appointment.isPaid"
            :button-type="'success'"
            @click="changeStatus(appointment[0], 'isPaid')"
            >Pago</base-button
          >
          <base-button
            v-if="!appointment.isDone"
            :button-type="'success'"
            @click="changeStatus(appointment[0], 'isDone')"
            >Concluído</base-button
          >
          <span v-if="showClientForm">
            <!-- Edit Client Button -->
            <base-button
              v-if="!clientFormEnabled"
              :button-type="'warning'"
              @click="clientFormEnabled = true"
            >
              Editar Cliente
            </base-button>
            <span v-else class="space-x-2">
              <!-- Confirm Client Editing Button -->
              <base-button
                :button-type="'success'"
                @click="editClient(appointment[1].clientId)"
              >
                Confirmar
              </base-button>
              <!-- Cancel Client Editing Button -->
              <base-button
                :button-type="'danger'"
                @click="clientFormEnabled = false"
              >
                Cancelar
              </base-button></span
            >
          </span>
        </span>
        <!-- Appointment Action Buttons -->
        <span v-if="!showClientForm">
          <span v-if="!appointmentFormEnabled" class="space-x-2">
            <!-- Edit Appointment Button -->
            <base-button
              :button-type="'warning'"
              @click="toggleAppointmentFormInput(true, appointment[0])"
            >
              Editar
            </base-button>
            <!-- Delete Appointment Button -->
            <base-button
              :button-type="'danger'"
              @click="deleteAppointment(appointment[0])"
              >Remover</base-button
            >
          </span>
          <span v-else class="space-x-2">
            <!-- Confirm Edition Button -->
            <base-button
              :button-type="'success'"
              @click="editAppointment(appointment[0])"
            >
              Confirmar
            </base-button>
            <!-- Delete Appointment Button -->
            <base-button
              :button-type="'danger'"
              @click="toggleAppointmentFormInput(false, null)"
            >
              Cancelar
            </base-button>
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: { AppointmentForm, BaseButton, ClientForm },
  data() {
    return {
      appointmentFormEnabled: false,
      dialogKey: 0,
      showAppointmentItem: null,
      showClientForm: false,
      selectedClient: [],
      clientFormEnabled: false,
      slotAppointments: [],
    };
  },
  created() {
    this.slotAppointments = this.$store.getters["agenda/slotAppointments"];
  },
  methods: {
    // Retrieves client by Id
    async viewClient(clientId) {
      // Only sends requests when no client has been selected
      if (this.selectedClient[0] !== clientId) {
        let clientsBulk = {};
        try {
          clientsBulk = await this.$store.dispatch("clients/loadClients");
        } catch (error) {
          console.log(error || "Something went wrong!");
        }
        // For entry of clientsBulk
        for (let client of Object.entries(clientsBulk)) {
          // If the name in the entry contains the this.searchQuery as a substring, push the entry onto the this.filteredClients array
          if (client[0].includes(clientId)) {
            this.selectedClient = client;
            this.showClientForm = true;
          }
        }
      } else {
        this.showClientForm = !this.showClientForm;
      }
    },
    async changeStatus(appointmentId, status) {
      const appointmentInfo = {};
      if (status === "isPaid") {
        appointmentInfo.isPaid = true;
      } else if (status === "isDone") {
        appointmentInfo.isDone = true;
      }
      this.$store.dispatch("agenda/setAppointmentNewData", appointmentInfo);
      this.editAppointment(appointmentId);
    },
    async editClient(clientId) {
      try {
        await this.$store.dispatch("clients/editClient", clientId);
      } catch (error) {
        console.log(error || "Something went wrong!");
      }
      this.clientFormEnabled = false;
      this.showClientForm = false;
      // TODO: Confirmation popup and rerendering
    },
    async deleteAppointment(appointmentId) {
      this.toggleAppointmentFormInput(false, null);
      try {
        await this.$store.dispatch("agenda/deleteAppointment", appointmentId);
      } catch (error) {
        console.log(error || "Something went wrong!");
      }
      // TODO: Confirmation popup and rerendering
    },
    async editAppointment(appointmentId) {
      this.toggleAppointmentFormInput(false, null);
      try {
        await this.$store.dispatch("agenda/editAppointment", appointmentId);
      } catch (error) {
        console.log(error || "Something went wrong!");
      }
      // TODO: Confirmation popup and rerendering
    },
    toggleAppointmentFormInput(value, appointmentId) {
      this.appointmentFormEnabled = value;
      this.showAppointmentItem = appointmentId;
    },
  },
};
import BaseButton from "./../ui/BaseButton.vue";
import AppointmentForm from "./AppointmentForm.vue";
import ClientForm from "./../clients/ClientForm.vue";
</script>
