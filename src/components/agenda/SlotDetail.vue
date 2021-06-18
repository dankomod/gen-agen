<template>
  <base-dialog v-if="showDialog" @close="close">
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
        <p>Agendamento {{ index + 1 }}</p>
        <appointment-form
          :form-data="appointment"
          :form-enabled="appointmentFormEnabled"
        ></appointment-form>
        <client-form
          v-if="showClientForm && selectedClient[0] === appointment[1].clientId"
          :form-data="selectedClient"
          :form-enabled="clientFormEnabled"
        ></client-form>
        <!-- Action Buttons -->
        <div class="flex flex-row justify-between">
          <!-- // TODO: Prevent the conditional formatting of the view client button on non-selected appointments -->
          <!-- View Client Information Button -->

          <span>
            <base-button
              v-if="!clientFormEnabled"
              @click="viewClient(appointment[1].clientId)"
            >
              {{ !showClientForm ? "Ver Cliente" : "Ocultar Detalhes" }}
            </base-button>
            <span v-if="showClientForm">
              <base-button
                v-if="!clientFormEnabled"
                @click="clientFormEnabled = true"
              >
                Editar Cliente
              </base-button>
              <span v-else>
                <base-button :button-type="'success'"> Confirmar </base-button>
                <!-- Delete Appointment Button -->
                <base-button
                  :button-type="'danger'"
                  @click="clientFormEnabled = false"
                >
                  Cancelar
                </base-button></span
              >
            </span>
          </span>
          <span v-if="!appointmentFormEnabled">
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
          <span v-else>
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
        </div>
      </div>
    </div>
  </base-dialog>
</template>

<script>
export default {
  components: { AppointmentForm, BaseButton, BaseDialog, ClientForm },
  props: { slotAppointments: { type: Array, default: () => [] } },
  data() {
    return {
      appointmentFormEnabled: false,
      dialogKey: 0,
      showAppointmentItem: null,
      showClientForm: false,
      showDialog: true,
      selectedClient: [],
      clientFormEnabled: false,
    };
  },
  methods: {
    async viewClient(clientId) {
      // If client have not been selected
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
    close() {
      this.showDialog = false;
    },
    async deleteAppointment(appointmentId) {
      this.toggleAppointmentFormInput(false, null);
      await this.$store.dispatch("agenda/deleteAppointment", appointmentId);
      // TODO: Confirmation popup
      this.close();
    },
    async editAppointment(appointmentId) {
      this.toggleAppointmentFormInput(false, null);
      await this.$store.dispatch("agenda/editAppointment", appointmentId);
      // TODO: Confirmation popup
      this.close();
    },
    toggleAppointmentFormInput(value, appointmentId) {
      this.appointmentFormEnabled = value;
      this.showAppointmentItem = appointmentId;
    },
  },
};
import BaseButton from "./../ui/BaseButton.vue";
import BaseDialog from "./../ui/BaseDialog.vue";
import AppointmentForm from "./AppointmentForm.vue";
import ClientForm from "./../clients/ClientForm.vue";
</script>
