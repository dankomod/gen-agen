<template>
  <div class="space-y-2">
    <base-form-element
      :element-type="'inputText'"
      :element-label="'Nome'"
      :element-value="localFormData[1].name"
      @keyup="appointmentInfo.name = $event.target.value"
    ></base-form-element>
    <div v-if="appointmentInfo.transport" class="space-y-2">
      <base-form-element
        :element-type="'inputText'"
        :element-enabled="formEnabled"
        :element-label="'Endereço'"
        :element-value="localClientInfo[1].address"
        @keyup="clientInfo.address = $event.target.value"
      ></base-form-element>
      <base-form-element
        :element-type="'inputText'"
        :element-enabled="formEnabled"
        :element-label="'Número'"
        :element-value="localClientInfo[1].number"
        @keyup="clientInfo.number = $event.target.value"
      ></base-form-element>
      <base-form-element
        :element-type="'inputText'"
        :element-enabled="formEnabled"
        :element-label="'Bairro'"
        :element-value="localClientInfo[1].district"
        @keyup="clientInfo.district = $event.target.value"
      ></base-form-element>
      <base-form-element
        :element-type="'inputText'"
        :element-enabled="formEnabled"
        :element-label="'Cidade'"
        :element-value="localClientInfo[1].city"
        @keyup="clientInfo.city = $event.target.value"
      ></base-form-element>
    </div>
    <base-form-element
      :element-type="'inputNumber'"
      :element-enabled="formEnabled"
      :element-label="'Valor'"
      :element-value="localFormData[1].price"
      @keyup="appointmentInfo.price = $event.target.value"
    ></base-form-element>
    <base-form-element
      :element-type="'select'"
      :element-enabled="formEnabled"
      :element-label="'Forma de Pagamento'"
      :element-value="localFormData[1].paymentMethod"
      :options="paymentMethods"
      @keyup="appointmentInfo.paymentMethod = $event.target.value"
    ></base-form-element>
    <!-- * This only works if a string is sent when true and null when false -->
    <base-form-element
      :element-type="'checkbox'"
      :element-enabled="formEnabled"
      :element-label="'Leva e tras'"
      :element-value="localFormData[1].transport ? 'true' : null"
      @change="appointmentInfo.transport = $event.target.checked"
    ></base-form-element>
    <base-form-element
      :element-type="'checkbox'"
      :element-enabled="formEnabled"
      :element-label="'Pago'"
      :element-value="localFormData[1].isPaid ? 'true' : null"
      @change="appointmentInfo.isPaid = $event.target.checked"
    ></base-form-element>
    <base-form-element
      :element-type="'checkbox'"
      :element-enabled="formEnabled"
      :element-label="'Concluído'"
      :element-value="localFormData[1].isDone ? 'true' : null"
      @change="appointmentInfo.isDone = $event.target.checked"
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
    return {
      appointmentInfo: {},
      clientInfo: {},
      localFormData: {},
      transport: false,
      localClientInfo: {},
      paymentMethods: [],
    };
  },
  watch: {
    // Watches for deep changes in (local) data()
    $data: {
      handler() {
        // ? Maybe this If can be removed
        // If form is enabled then dispatch every change in the form to the State
        if (this.formEnabled === true) {
          this.$store.dispatch(
            "agenda/setAppointmentNewData",
            this.appointmentInfo
          );
          if (this.appointmentInfo && this.appointmentInfo.transport) {
            this.localClientInfo =
              this.$store.getters["clients/selectedClient"];
          }
          if (this.clientInfo) {
            this.$store.dispatch("clients/setClientNewData", this.clientInfo);
          }
        }
      },
      deep: true,
    },
  },
  async created() {
    // If no form data given then data is retrieved from the state. Localformdata holds both sources
    if (!this.formData) {
      this.localFormData = this.$store.getters["clients/selectedClient"];
    } else {
      this.localFormData = this.formData;
    }
    // TODO: Error catching
    // TODO: Hold this information on the state
    this.paymentMethods = await this.$store.dispatch(
      "configs/getPaymentMethods"
    );
  },
};
import BaseFormElement from "./../ui/BaseFormElement.vue";
</script>
