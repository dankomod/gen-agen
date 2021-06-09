<template>
  <base-dialog @close="close" v-if="showInfoDialog">
    <div
      v-for="detail in selectedHourDetails"
      :key="detail.name"
      class="p-2 hover:bg-indigo-200"
    >
      <!-- TODO: computed property -->
      <div
        v-if="visibleAppointment === null || visibleAppointment === detail.name"
      >
        <form class="cursor-pointer">
          <div @click="toggleDetails(detail.name)">
            <div class="flex flex-row items-center p-1">
              <p class="w-24">Nome</p>
              <input
                disabled
                class="px-3 py-1 bg-gray-200"
                type="text"
                :value="detail.name"
              />
            </div>
            <div class="flex flex-row items-center p-1">
              <label class="w-24">Telefone</label>
              <input
                disabled
                class="px-3 py-1 bg-gray-200"
                type="number"
                :value="detail.phone"
              />
            </div>
            <div class="flex flex-row items-center p-1">
              <label class="w-24">Valor</label>
              <input
                disabled
                class="px-3 py-1 bg-gray-200"
                type="number"
                :value="detail.price"
              />
            </div>
          </div>
          <div v-if="showDetails">
            <div class="flex flex-row items-center p-1">
              <label class="w-24">Pagamento</label>
              <input
                disabled
                class="px-3 py-1 bg-gray-200"
                type="text"
                :value="detail.paymentMethod"
              />
            </div>
            <div class="flex flex-row items-center p-1">
              <label class="w-24">Endereço</label>
              <input
                disabled
                class="px-3 py-1 bg-gray-200"
                type="text"
                :value="detail.address"
              />
            </div>
            <div class="flex flex-row items-center p-1">
              <label class="w-24">Número</label>
              <input
                disabled
                class="px-3 py-1 bg-gray-200"
                type="number"
                :value="detail.number"
              />
            </div>
            <div class="flex flex-row items-center p-1">
              <label class="w-24">Bairro</label>
              <input
                disabled
                class="px-3 py-1 bg-gray-200"
                type="text"
                :value="detail.district"
              />
            </div>
            <div class="flex flex-row items-center p-1">
              <label class="w-24">Cidade</label>
              <input
                disabled
                class="px-3 py-1 bg-gray-200"
                type="text"
                :value="detail.city"
              />
            </div>
            <div class="flex flex-row items-center p-1">
              <label class="w-24">Observações</label>
              <textarea
                disabled
                class="px-3 py-1 bg-gray-200"
                type="text"
                :value="detail.observations"
              ></textarea>
            </div>
          </div>
        </form>
      </div>
    </div>
    <!-- TODO: computed property -->
    <button
      v-if="visibleAppointment !== null && selectedHourDetails.length > 0"
      @click="clear"
      class="px-4 py-1 mt-5 -mb-8 text-lg text-indigo-200 bg-indigo-700 border border-indigo-300  w-min"
    >
      Ver todos os agendamentos
    </button>
  </base-dialog>
  <div class="flex flex-wrap justify-center text-lg text-white">
    <button
      class="w-32 py-3 m-1 font-medium tracking-wide bg-green-700"
      @click="addAppointment"
    >
      Adicionar
    </button>
    <button
      v-if="showInfoButton"
      class="w-32 py-3 m-1 font-medium tracking-wide bg-blue-700"
      @click="showInfo"
    >
      Informações
    </button>
  </div>
</template>

<script>
import { DateTime } from "luxon";
export default {
  methods: {
    toggleDetails(value) {
      this.showDetails = true;
      this.visibleAppointment = value;
    },
    clear() {
      this.showDetails = false;
      this.visibleAppointment = null;
    },
    close() {
      this.showInfoDialog = false;
      this.clear();
    },
    showInfo() {
      this.showInfoDialog = true;
      const agendaDetails = this.$store.getters["agenda/agendaDetails"];
      const selectedHours = this.$store.getters["agenda/selectedHours"][0]; //[0] gets the first (and only because the info button is only shown when there is only one slot selected) array inside the object
      const selectedHourString = selectedHours.toFormat("HH:mm");
      this.selectedHourDetails = [];
      for (let detail of Object.values(agendaDetails)) {
        if (detail.timeString === selectedHourString) {
          this.selectedHourDetails.push(detail);
        }
      }
    },
    // Adds a new appointment, reloads all data and refreshes the rendering
    async addAppointment() {
      DateTime.now(); //TODO: change this
      let payload = {
        user: "h1",
      };
      await this.$store.dispatch("agenda/newAppointment", payload);
      // TODO: Re-render?
    },
  },
  computed: {
    showInfoButton() {
      return this.$store.getters["agenda/selectedHours"].length === 1
        ? true
        : false;
    },
  },
  data() {
    return {
      showInfoDialog: false,
      selectedHourDetails: [],
      showDetails: false,
      visibleAppointment: null,
    };
  },
};
// TODO: Show add button if no selection of taken time, hide others
// TODO: Show edit and remove button if selection of taken time, hide add
// TODO: Block buttons if free and taken times are selected
</script>
