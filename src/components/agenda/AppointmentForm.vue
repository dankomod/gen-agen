<template>
  <div>
    <base-form-element
      :elementType="'inputText'"
      :elementLabel="'Nome'"
      :elementValue="formData ? formData[1].name : ''"
      @keyup="appointmentInfo.name = $event.target.value"
    ></base-form-element>
    <base-form-element
      :elementType="'inputNumber'"
      :elementEnabled="formEnabled"
      :elementLabel="'Valor'"
      :elementValue="formData ? formData[1].price : ''"
      @keyup="appointmentInfo.price = $event.target.value"
    ></base-form-element>
    <base-form-element
      :elementType="'checkbox'"
      :elementEnabled="formEnabled"
      :elementLabel="'Leva e tras'"
      :elementValue="formData ? formData[1].transport : ''"
      @change="appointmentInfo.transport = $event.target.checked"
    ></base-form-element>
    <base-form-element
      :elementType="'textarea'"
      :elementEnabled="formEnabled"
      :elementLabel="'Observações'"
      :elementValue="formData ? formData[1].observations : ''"
      @keyup="appointmentInfo.observations = $event.target.value"
    ></base-form-element>
  </div>
</template>
<script>
export default {
  created() {
    if (this.formEnabled) {
      this.formData = this.$store.getters["clients/selectedClient"];
    }
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
  data() {
    return { appointmentInfo: {}, formData: {} };
  },
  components: { BaseFormElement },
  props: ["formEnabled"],
};
import BaseFormElement from "./../ui/BaseFormElement.vue";
</script>
