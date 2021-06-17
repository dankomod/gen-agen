<template>
  <div>
    <base-form-element
      :element-type="'inputText'"
      :element-label="'Nome'"
      :element-value="formData ? formData[1].name : ''"
      @keyup="appointmentInfo.name = $event.target.value"
    ></base-form-element>
    <base-form-element
      :element-type="'inputNumber'"
      :element-enabled="formEnabled"
      :element-label="'Valor'"
      :element-value="formData ? formData[1].price : ''"
      @keyup="appointmentInfo.price = $event.target.value"
    ></base-form-element>
    <base-form-element
      :element-type="'checkbox'"
      :element-enabled="formEnabled"
      :element-label="'Leva e tras'"
      :element-value="formData ? formData[1].transport : ''"
      @change="appointmentInfo.transport = $event.target.checked"
    ></base-form-element>
    <base-form-element
      :element-type="'textarea'"
      :element-enabled="formEnabled"
      :element-label="'Observações'"
      :element-value="formData ? formData[1].observations : ''"
      @keyup="appointmentInfo.observations = $event.target.value"
    ></base-form-element>
  </div>
</template>
<script>
export default {
  components: { BaseFormElement },
  props: { formEnabled: Boolean },
  data() {
    return { appointmentInfo: {}, formData: {} };
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
    if (this.formEnabled) {
      this.formData = this.$store.getters["clients/selectedClient"];
    }
  },
};
import BaseFormElement from "./../ui/BaseFormElement.vue";
</script>
