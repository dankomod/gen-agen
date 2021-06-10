<template>
  <form>
    <div id="basic-data">
      <div class="p-1">
        <label for="name">Nome do Cliente</label
        ><input
          type="text"
          id="name"
          class="bg-blue-100 border border-blue-500"
          v-model.trim="appointmentInfo.name"
        />
      </div>
      <div class="p-1">
        <label for="phone">Telefone</label>
        <input
          type="number"
          id="phone"
          class="bg-blue-100 border border-blue-500"
          v-model.trim.number="appointmentInfo.phone"
        />
      </div>
      <div class="p-1">
        <label for="price">Valor</label>
        <input
          type="number"
          id="price"
          class="bg-blue-100 border border-blue-500"
          v-model.trim.number="appointmentInfo.price"
        />
      </div>
    </div>
    <a @click="toggleDetails" class="text-lg cursor-pointer"
      >Mostrar detalhes</a
    >
    <div id="details" v-if="showDetails">
      <div class="p-1">
        <label for="address">Endereço</label>
        <input
          type="text"
          id="address"
          class="bg-blue-100 border border-blue-500"
          v-model.trim="appointmentInfo.address"
        />
      </div>
      <div class="p-1">
        <label for="number">Número</label>
        <input
          type="number"
          id="number"
          class="bg-blue-100 border border-blue-500"
          v-model.trim.number="appointmentInfo.number"
        />
      </div>
      <div class="p-1">
        <label for="district">Bairro</label>
        <input
          type="text"
          id="district"
          class="bg-blue-100 border border-blue-500"
          v-model.trim="appointmentInfo.district"
        />
      </div>
      <div class="p-1">
        <label for="city">Cidade</label>
        <input
          type="text"
          id="city"
          class="bg-blue-100 border border-blue-500"
          v-model.trim="appointmentInfo.city"
        />
      </div>
      <div class="p-1">
        <label for="payment-method">Pagamento</label>
        <input
          type="text"
          id="payment-method"
          class="bg-blue-100 border border-blue-500"
          v-model.trim="appointmentInfo.paymentMethod"
        />
      </div>
      <div class="p-1">
        <label for="observations">Observações</label>
        <textarea
          name=""
          id="observations"
          cols="20"
          rows="3"
          class="bg-blue-100 border border-blue-500"
          v-model.trim="appointmentInfo.observations"
        ></textarea>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  watch: {
    $data: {
      handler: function (data) {
        // TODO: refuse empty values
        if (
          data.appointmentInfo.name !== "" ||
          data.appointmentInfo.phone !== "" ||
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
