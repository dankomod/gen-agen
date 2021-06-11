<template>
  <base-dialog @close="close" v-if="showInfoDialog">
    <div v-for="detail in selectedHourDetails" :key="detail.id" class="">
      <!-- TODO: computed property -->
      <div
        class="w-96"
        v-if="visibleAppointment === null || visibleAppointment === detail.name"
      >
        <!-- TODO: remove hover styling when details are shown  -->
        <form class="p-2 hover:bg-blue-50">
          <!-- BASIC INFO -->
          <div @click="toggleDetails(detail.name)">
            <div class="flex flex-row items-center p-1">
              <p class="w-24">Nome</p>
              <p v-if="editingEnabled">{{ detail.name }}</p>
              <input
                v-else
                @change="appointmentInfo.name = $event.target.value"
                class="px-3 py-1 bg-gray-200"
                type="text"
                :value="detail.name"
              />
            </div>
            <div class="flex flex-row items-center p-1">
              <label class="w-24">Telefone</label>
              <p v-if="editingEnabled">{{ detail.phone }}</p>
              <input
                v-else
                @change="appointmentInfo.phone = $event.target.value"
                class="px-3 py-1 bg-gray-200"
                type="number"
                :value="detail.phone"
              />
            </div>
            <div class="flex flex-row items-center p-1">
              <label class="w-24">Valor</label>
              <p v-if="editingEnabled">{{ detail.price }}</p>
              <input
                v-else
                @change="appointmentInfo.price = $event.target.value"
                class="px-3 py-1 bg-gray-200"
                type="number"
                :value="detail.price"
              />
            </div>
          </div>
          <!-- DETAILS -->
          <div v-if="showDetails">
            <div class="flex flex-row items-center p-1">
              <label class="w-24">Pagamento</label>
              <p v-if="editingEnabled">{{ detail.paymentMethod }}</p>
              <input
                v-else
                @change="appointmentInfo.paymentMethod = $event.target.value"
                class="px-3 py-1 bg-gray-200"
                type="text"
                :value="detail.paymentMethod"
              />
            </div>
            <div class="flex flex-row items-center p-1">
              <label class="w-24">Endereço</label>
              <p v-if="editingEnabled">{{ detail.address }}</p>
              <input
                v-else
                @change="appointmentInfo.address = $event.target.value"
                class="px-3 py-1 bg-gray-200"
                type="text"
                :value="detail.address"
              />
            </div>
            <div class="flex flex-row items-center p-1">
              <label class="w-24">Número</label>
              <p v-if="editingEnabled">{{ detail.number }}</p>
              <input
                v-else
                @change="appointmentInfo.number = $event.target.value"
                class="px-3 py-1 bg-gray-200"
                type="number"
                :value="detail.number"
              />
            </div>
            <div class="flex flex-row items-center p-1">
              <label class="w-24">Bairro</label>
              <p v-if="editingEnabled">{{ detail.district }}</p>
              <input
                v-else
                @change="appointmentInfo.district = $event.target.value"
                class="px-3 py-1 bg-gray-200"
                type="text"
                :value="detail.district"
              />
            </div>
            <div class="flex flex-row items-center p-1">
              <label class="w-24">Cidade</label>
              <p v-if="editingEnabled">{{ detail.city }}</p>
              <input
                v-else
                @change="appointmentInfo.city = $event.target.value"
                class="px-3 py-1 bg-gray-200"
                type="text"
                :value="detail.city"
              />
            </div>
            <div class="flex flex-row items-center p-1">
              <label class="w-24">Observações</label>
              <p v-if="editingEnabled">{{ detail.observations }}</p>
              <textarea
                v-else
                @change="appointmentInfo.observations = $event.target.value"
                class="px-3 py-1 bg-gray-200"
                type="text"
                :value="detail.observations"
              ></textarea>
            </div>
          </div>
        </form>
        <!-- BASE BUTTONS -->
        <div v-if="showDetails && editingEnabled">
          <!-- TODO: computed property -->
          <button
            v-if="visibleAppointment !== null && selectedHourDetails.length > 0"
            @click="clear"
            class="w-32 px-4 py-1 mt-5 -mb-8 text-lg text-white bg-green-700 border border-green-300 "
          >
            Ver todos
          </button>
          <button
            @click="toggleEditing()"
            class="w-32 px-4 py-1 mt-5 -mb-8 text-lg bg-yellow-500 border border-yellow-300 "
          >
            Alterar</button
          ><button
            @click="removeAppointment(detail.id)"
            class="w-32 px-4 py-1 mt-5 -mb-8 text-lg text-white bg-red-700 border border-red-300 "
          >
            Remover
          </button>
        </div>
        <!-- EDIT BUTTONS -->
        <div v-if="showDetails && !editingEnabled">
          <button
            @click="editAppointment(detail.id) + toggleEditing()"
            class="w-32 px-4 py-1 mt-5 -mb-8 text-lg text-white bg-green-700 border border-green-300 "
          >
            Confirmar
          </button>
          <button
            @click="toggleEditing()"
            class="w-32 px-4 py-1 mt-5 -mb-8 text-lg text-white bg-red-700 border border-red-300 "
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </base-dialog>
  <div class="flex flex-wrap justify-center text-lg text-white">
    <button
      v-if="showAddButton"
      class="w-32 py-3 m-1 font-medium tracking-wide bg-green-700"
      @click="addAppointment"
    >
      Adicionar
    </button>
    <button
      v-if="showInfoButton"
      class="w-32 py-3 m-1 font-medium tracking-wide bg-blue-700"
      @click="showInfo(true)"
    >
      Informações
    </button>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { DateTime } from "luxon";
export default {
  methods: {
    // Adds a new appointment, reloads all data and refreshes the rendering
    async addAppointment() {
      let payload = {
        user: "h1",
      };
      try {
        await this.$store.dispatch("agenda/newAppointment", payload);
      } catch (error) {
        // TODO: Popup error? => this.error + computed
        console.log(error || "Algo deu errado.");
      }
      this.updateRendering();
    },
    async editAppointment(value) {
      const payload = {
        id: value,
        dateTime: this.selectedHours,
      };
      for (let info of Object.entries(this.appointmentInfo)) {
        if (info[1] !== "") {
          payload[info[0]] = info[1];
        }
      }
      try {
        await this.$store.dispatch("agenda/editAppointment", payload);
      } catch (error) {
        // TODO: Popup error? => this.error + computed
        console.log(error || "Algo deu errado.");
      }
      this.updateRendering();
    },
    async removeAppointment(value) {
      const payload = {
        id: value,
        dateTime: this.selectedHours,
      };
      try {
        await this.$store.dispatch("agenda/removeAppointment", payload);
      } catch (error) {
        // TODO: Popup error? => this.error + computed
        console.log(error || "Algo deu errado.");
      }
      this.close();
      this.updateRendering();
    },
    toggleDetails(value) {
      this.showDetails = true;
      this.visibleAppointment = value;
    },
    // Needs to be called as toggleEditing() in the template because a boolean argument is possible
    toggleEditing(value = null) {
      if (value !== null) {
        this.editingAllowed = value;
      } else {
        this.editingAllowed = !this.editingAllowed;
      }
    },
    clear() {
      this.showDetails = false;
      this.visibleAppointment = null;
    },
    close() {
      this.toggleEditing(false);
      this.showInfoDialog = false;
      this.clear();
    },
    showInfo(showDialog = false) {
      const agendaDetails = this.$store.getters["agenda/agendaDetails"];
      this.selectedHours = this.$store.getters["agenda/selectedHours"][0]; //[0] gets the first (and only because the info button is only shown when there is only one slot selected) array inside the object
      this.selectedHourString = this.selectedHours.toFormat("HH:mm");
      this.selectedHourDetails = [];
      for (let detail of Object.values(agendaDetails)) {
        if (detail.timeString === this.selectedHourString) {
          this.selectedHourDetails.push(detail);
        }
      }
      if (this.selectedHourDetails.length > 0) {
        this.showInfoButton = true;
      }
      if (showDialog === true) {
        this.showInfoDialog = true;
      }
    },
    updateRendering() {
      this.$emit("updateRendering");
    },
  },
  computed: {
    editingEnabled() {
      return this.editingAllowed ? false : true;
    },
  },
  created() {
    this.$store.watch(
      () => {
        return this.$store.getters["agenda/selectedHours"];
      },
      (newValue) => {
        if (newValue.length === 1) {
          this.showAddButton = true;
          this.showInfo();
        } else {
          this.showAddButton = false;
          this.showInfoButton = false;
          this.showInfoDialog = false;
        }
      }
    );
  },
  data() {
    return {
      showInfoDialog: false,
      selectedHourDetails: [],
      showDetails: false,
      visibleAppointment: null,
      selectedHours: [],
      editingAllowed: false,
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
      selectedHourString: "",
      showInfoButton: false,
      showAddButton: false,
      id: 0,
    };
  },
  emits: ["updateRendering"],
};
// TODO: Show add button if no selection of taken time, hide others
// TODO: Show edit and remove button if selection of taken time, hide add
// TODO: Block buttons if free and taken times are selected
</script>
