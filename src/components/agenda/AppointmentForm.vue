<template>
  <!-- // TODO: Remove DIV tag -->
  <div>
    <base-form-element
      :element-type="'inputText'"
      :element-label="'Nome'"
      :element-value="localFormData[1].name"
      @keyup="appointmentInfo.name = $event.target.value"
    ></base-form-element>
    <base-form-element
      :element-type="'inputNumber'"
      :element-enabled="formEnabled"
      :element-label="'Valor'"
      :element-value="localFormData[1].price"
      @keyup="appointmentInfo.price = $event.target.value"
    ></base-form-element>
    <!-- //TODO: this only works if a string is sent when true and null when false -->
    <base-form-element
      :element-type="'checkbox'"
      :element-enabled="formEnabled"
      :element-label="'Leva e tras'"
      :element-value="localFormData[1].transport ? 'true' : null"
      @change="appointmentInfo.transport = $event.target.checked"
    ></base-form-element>
    <base-form-element
      :element-type="'textarea'"
      :element-enabled="formEnabled"
      :element-label="'Observações'"
      :element-value="localFormData[1].observations"
      @keyup="appointmentInfo.observations = $event.target.value"
    ></base-form-element>
  </div>
</template>
<script>
export default {
  components: { BaseFormElement },
  props: {
    formEnabled: { type: Boolean, default: false },
    formData: { type: Array, default: () => {} },
  },
  data() {
    return { appointmentInfo: {}, localFormData: {} };
  },
  // Watches for deep changes in data()
  watch: {
    $data: {
      handler() {
        // If form is enabled then dispatch every change in the form to the state
        if (this.formEnabled === true) {
          this.$store.dispatch(
            "agenda/setAppointmentNewData",
            this.appointmentInfo
          );
        }
      },
      deep: true,
    },
  },
  created() {
    // If no form data given then data is retrieved from the state. Localformdata holds both types of data input
    if (!this.formData) {
      this.localFormData = this.$store.getters["clients/selectedClient"];
    } else {
      this.localFormData = this.formData;
    }
  },
};
import BaseFormElement from "./../ui/BaseFormElement.vue";
</script>
