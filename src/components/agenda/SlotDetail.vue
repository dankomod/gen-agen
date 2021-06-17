<template>
  <base-dialog v-if="showDialog" @close="close">
    <div>
      <appointment-form
        v-for="appointment in slotAppointments"
        :key="appointment[0]"
        :form-data="appointment"
        :form-enabled="false"
      ></appointment-form>
    </div>
  </base-dialog>
</template>

<script>
export default {
  components: { AppointmentForm, BaseDialog },
  props: { slotAppointments: { type: Array, default: () => [] } },
  data() {
    return { showDialog: true };
  },
  computed: {},
  methods: {
    close() {
      this.showDialog = false;
    },
  },
};
import BaseDialog from "./../ui/BaseDialog.vue";
import AppointmentForm from "./AppointmentForm.vue";
</script>
