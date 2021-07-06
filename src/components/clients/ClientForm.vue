<template>
  <form @submit.prevent="newClient">
    <div class="space-y-2">
      <!-- //! Assumes that the prop will have the format ['id', {data}] -->
      <!-- Uses prop values if a formData prop is given -->
      <!-- Switches view and edition mode if a element-enabled prop is given -->
      <base-form-element
        :element-type="'inputText'"
        :element-enabled="formEnabled"
        :element-label="'Nome'"
        :element-value="formData ? formData[1].name : ''"
        @keyup="clientInfo.name = $event.target.value"
      ></base-form-element>
      <base-form-element
        :element-type="'inputNumber'"
        :element-enabled="formEnabled"
        :element-label="'Telefone'"
        :element-value="formData ? formData[1].phone : ''"
        @keyup="clientInfo.phone = $event.target.value"
      ></base-form-element>
      <base-form-element
        :element-type="'inputText'"
        :element-enabled="formEnabled"
        :element-label="'Endereço'"
        :element-value="formData ? formData[1].address : ''"
        @keyup="clientInfo.address = $event.target.value"
      ></base-form-element>
      <base-form-element
        :element-type="'inputNumber'"
        :element-enabled="formEnabled"
        :element-label="'Número'"
        :element-value="formData ? formData[1].number : ''"
        @keyup="clientInfo.number = $event.target.value"
      ></base-form-element>
      <base-form-element
        :element-type="'inputText'"
        :element-enabled="formEnabled"
        :element-label="'Bairro'"
        :element-value="formData ? formData[1].district : ''"
        @keyup="clientInfo.district = $event.target.value"
      ></base-form-element>
      <base-form-element
        :element-type="'inputText'"
        :element-enabled="formEnabled"
        :element-label="'Cidade'"
        :element-value="formData ? formData[1].city : ''"
        @keyup="clientInfo.city = $event.target.value"
      ></base-form-element>
      <!-- //TODO: Mask -->
      <base-form-element
        :element-type="'inputText'"
        :element-enabled="formEnabled"
        :element-label="'CPF'"
        :element-value="formData ? formData[1].cpf : ''"
        @keyup="clientInfo.cpf = $event.target.value"
      ></base-form-element>
      <base-form-element
        :element-type="'textarea'"
        :element-enabled="formEnabled"
        :element-label="'Observações'"
        :element-value="formData ? formData[1].observations : ''"
        @keyup="clientInfo.observations = $event.target.value"
      ></base-form-element>
    </div>
  </form>
</template>

<script>
// TODO: Delete the future appointments of a client to be deleted
export default {
  components: { BaseFormElement },
  props: {
    formData: {
      type: Array,
      default: () => [],
    },
    formEnabled: Boolean,
  },
  data() {
    return {
      // Holds all the inputs data
      clientInfo: {},
    };
  },
  // Watches for deep changes in data()
  watch: {
    $data: {
      handler() {
        // If form is enabled then dispatch every change in the form to the State
        if (this.formEnabled === true) {
          this.$store.dispatch("clients/setClientNewData", this.clientInfo);
        }
      },
      deep: true,
    },
  },
  created() {
    // If the form is enabled and any data was provided
    if (this.formEnabled && this.formData) {
      // Spreads the formData prop [id,{values}]
      this.clientInfo = { ...this.formData[1] };
    }
  },
};
import BaseFormElement from "./../ui/BaseFormElement.vue";
</script>
