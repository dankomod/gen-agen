<template>
  <form>
    <div id="basic-data">
      <base-form-element
        :elementType="'inputText'"
        :elementEnabled="true"
        :elementLabel="'Nome'"
        @keyup="appointmentInfo.name = $event.target.value"
      ></base-form-element>
      <base-form-element
        :elementType="'inputNumber'"
        :elementEnabled="true"
        :elementLabel="'Telefone'"
        @keyup="appointmentInfo.phone = $event.target.value"
      ></base-form-element>
      <base-form-element
        :elementType="'inputNumber'"
        :elementEnabled="true"
        :elementLabel="'Valor'"
        @keyup="appointmentInfo.price = $event.target.value"
      ></base-form-element>
    </div>
    <base-button
      v-if="!showDetails"
      @click="toggleDetails"
      class="text-lg cursor-pointer"
      >Mostrar detalhes</base-button
    >
    <div id="details" v-if="showDetails">
      <base-form-element
        :elementType="'select'"
        :optionValueArray="[
          'Cartão de Crédito',
          'Cartão de Débito',
          'Dinheiro',
          'Pix/Transferência',
        ]"
        :elementEnabled="true"
        :elementLabel="'Método de Pagamento'"
        @keyup="appointmentInfo.paymentMethod = $event.target.value"
      ></base-form-element>
      <base-form-element
        :elementType="'inputText'"
        :elementEnabled="true"
        :elementLabel="'Endereço'"
        @keyup="appointmentInfo.address = $event.target.value"
      ></base-form-element>
      <base-form-element
        :elementType="'inputNumber'"
        :elementEnabled="true"
        :elementLabel="'Número'"
        @keyup="appointmentInfo.number = $event.target.value"
      ></base-form-element>
      <base-form-element
        :elementType="'inputText'"
        :elementEnabled="true"
        :elementLabel="'Bairro'"
        @keyup="appointmentInfo.district = $event.target.value"
      ></base-form-element>
      <base-form-element
        :elementType="'inputText'"
        :elementEnabled="true"
        :elementLabel="'Cidade'"
        @keyup="appointmentInfo.city = $event.target.value"
      ></base-form-element>
      <base-form-element
        :elementType="'textarea'"
        :elementEnabled="true"
        :elementLabel="'Observações'"
        @keyup="appointmentInfo.observations = $event.target.value"
      ></base-form-element>
    </div>
  </form>
</template>

<script>
export default {
  watch: {
    $data: {
      handler: function (data) {
        if (
          data.appointmentInfo.name !== "" &&
          data.appointmentInfo.phone !== "" &&
          data.appointmentInfo.price !== ""
        ) {
          this.$store.dispatch(
            "agenda/setAppointmentInfo",
            this.appointmentInfo
          );
        }
      },
      deep: true,
    },
  },
  data() {
    return {
      showDetails: false,
      appointmentInfo: {
        name: "",
        phone: "",
        price: "",
        paymentMethod: "",
        observations: "",
        address: "",
        number: "",
        district: "",
        city: "",
      },
    };
  },
  methods: {
    toggleDetails() {
      return (this.showDetails = !this.showDetails);
    },
  },
};
</script>
