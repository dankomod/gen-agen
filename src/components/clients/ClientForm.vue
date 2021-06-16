<template>
  <form @submit.prevent="newClient">
    <!-- //! Assumes that the prop will have the format ['id', {data}] -->
    <!-- Uses prop values if a formData prop is given -->
    <!-- Switches view and edition mode if a elementEnabled prop is given -->
    <base-form-element
      :elementType="'inputText'"
      :elementEnabled="formEnabled"
      :elementLabel="'Nome'"
      :elementValue="formData ? formData[1].name : ''"
      @keyup="clientInfo.name = $event.target.value"
    ></base-form-element>
    <base-form-element
      :elementType="'inputNumber'"
      :elementEnabled="formEnabled"
      :elementLabel="'Telefone'"
      :elementValue="formData ? formData[1].phone : ''"
      @keyup="clientInfo.phone = $event.target.value"
    ></base-form-element>
    <base-form-element
      :elementType="'inputText'"
      :elementEnabled="formEnabled"
      :elementLabel="'Endereço'"
      :elementValue="formData ? formData[1].address : ''"
      @keyup="clientInfo.address = $event.target.value"
    ></base-form-element>
    <base-form-element
      :elementType="'inputNumber'"
      :elementEnabled="formEnabled"
      :elementLabel="'Número'"
      :elementValue="formData ? formData[1].number : ''"
      @keyup="clientInfo.number = $event.target.value"
    ></base-form-element>
    <base-form-element
      :elementType="'inputText'"
      :elementEnabled="formEnabled"
      :elementLabel="'Bairro'"
      :elementValue="formData ? formData[1].district : ''"
      @keyup="clientInfo.district = $event.target.value"
    ></base-form-element>
    <base-form-element
      :elementType="'inputText'"
      :elementEnabled="formEnabled"
      :elementLabel="'Cidade'"
      :elementValue="formData ? formData[1].city : ''"
      @keyup="clientInfo.city = $event.target.value"
    ></base-form-element>
    <!-- //TODO: Mask -->
    <base-form-element
      :elementType="'inputNumber'"
      :elementEnabled="formEnabled"
      :elementLabel="'CPF'"
      :elementValue="formData ? formData[1].cpf : ''"
      @keyup="clientInfo.cpf = $event.target.value"
    ></base-form-element>
    <base-form-element
      :elementType="'textarea'"
      :elementEnabled="formEnabled"
      :elementLabel="'Observações'"
      :elementValue="formData ? formData[1].observations : ''"
      @keyup="clientInfo.observations = $event.target.value"
    ></base-form-element>
  </form>
</template>

<script>
import BaseFormElement from "./../ui/BaseFormElement.vue";
export default {
  // Watches for deep changes in data()
  watch: {
    $data: {
      handler() {
        // If form is enabled then dispatch every change in the form to the state
        if (this.formEnabled === true) {
          this.$store.dispatch("clients/setFormNewData", this.clientInfo);
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
  data() {
    return {
      // Holds all the inputs data
      clientInfo: {},
    };
  },
  props: ["formData", "formEnabled"],
  components: { BaseFormElement },
};
</script>
