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
        <!-- Action Buttons -->
        <div class="flex flex-row justify-between">
          <!-- View Client Information Button -->
          <base-button>Ver Cliente</base-button>
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
              >Cancelar</base-button
            >
          </span>
        </div>
      </div>
    </div>
  </base-dialog>
</template>

<script>
export default {
  components: { AppointmentForm, BaseButton, BaseDialog },
  props: { slotAppointments: { type: Array, default: () => [] } },
  data() {
    return {
      appointmentFormEnabled: false,
      dialogKey: 0,
      showAppointmentItem: null,
      showDialog: true,
    };
  },
  methods: {
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
</script>
