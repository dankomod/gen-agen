<template>
  <base-dialog @close="close" v-if="showInfoDialog">
    <div v-for="detail in selectedHourDetails" :key="detail.id" class="w-full">
      <!-- TODO: computed property -->
      <div
        class="w-full"
        v-if="visibleAppointment === null || visibleAppointment === detail.name"
      >
        <!-- TODO: remove hover styling when details are shown  -->
        <form class="w-full p-2 space-y-1 hover:bg-blue-50">
          <!-- BASIC INFO -->
          <div @click="toggleDetails(detail.name)" class="space-y-1">
            <base-form-element
              :elementType="'inputText'"
              d
              :elementEnabled="!inputEnabled"
              :elementLabel="'Nome'"
              :elementValue="detail.name"
              @keyup="appointmentInfo.name = $event.target.value"
            ></base-form-element>
            <base-form-element
              :elementType="'inputNumber'"
              :elementEnabled="!inputEnabled"
              :elementLabel="'Telefone'"
              :elementValue="detail.phone"
              @keyup="appointmentInfo.phone = $event.target.value"
            ></base-form-element>
            <base-form-element
              :elementType="'inputNumber'"
              :elementEnabled="!inputEnabled"
              :elementLabel="'Valor'"
              :elementValue="detail.price"
              @keyup="appointmentInfo.price = $event.target.value"
            ></base-form-element>
          </div>
          <!-- DETAILS -->
          <div v-if="showDetails" class="space-y-1">
            <!-- Make this a dropdown of possible payment methods -->
            <base-form-element
              :elementType="'select'"
              :optionValueArray="[
                'Cartão de Crédito',
                'Cartão de Débito',
                'Dinheiro',
                'Pix/Transferência',
              ]"
              :elementEnabled="!inputEnabled"
              :elementLabel="'Método de Pagamento'"
              :elementValue="detail.paymentMethod"
              @keyup="appointmentInfo.paymentMethod = $event.target.value"
            ></base-form-element>
            <base-form-element
              :elementType="'inputText'"
              :elementEnabled="!inputEnabled"
              :elementLabel="'Endereço'"
              :elementValue="detail.address"
              @keyup="appointmentInfo.address = $event.target.value"
            ></base-form-element>
            <base-form-element
              :elementType="'inputNumber'"
              :elementEnabled="!inputEnabled"
              :elementLabel="'Número'"
              :elementValue="detail.number"
              @keyup="appointmentInfo.number = $event.target.value"
            ></base-form-element>
            <base-form-element
              :elementType="'inputText'"
              :elementEnabled="!inputEnabled"
              :elementLabel="'Bairro'"
              :elementValue="detail.district"
              @keyup="appointmentInfo.district = $event.target.value"
            ></base-form-element>
            <base-form-element
              :elementType="'inputText'"
              :elementEnabled="!inputEnabled"
              :elementLabel="'Cidade'"
              :elementValue="detail.city"
              @keyup="appointmentInfo.city = $event.target.value"
            ></base-form-element>
            <base-form-element
              :elementType="'textarea'"
              :elementEnabled="!inputEnabled"
              :elementLabel="'Observações'"
              :elementValue="detail.observations"
              @keyup="appointmentInfo.observations = $event.target.value"
            ></base-form-element>
          </div>
        </form>
        <!-- BASE BUTTONS -->
        <div v-if="showDetails && inputEnabled">
          <!-- TODO: computed property -->
          <base-button
            buttonType="success"
            v-if="visibleAppointment !== null && selectedHourDetails.length > 0"
            @click="clear"
          >
            Ver todos
          </base-button>
          <!-- <base-button buttonType="warning" @click="toggleEditing()">
            Alterar</base-button
          ><base-button
            buttonType="danger"
            @click="removeAppointment(detail.id)"
          >
            Remover
          </base-button> -->
        </div>
        <!-- EDIT BUTTONS -->
        <div v-if="showDetails && !inputEnabled">
          <base-button
            buttonType="success"
            @click="editAppointment(detail.id) + toggleEditing()"
          >
            Confirmar
          </base-button>
          <base-button buttonType="danger" @click="toggleEditing()">
            Cancelar
          </base-button>
        </div>
      </div>
    </div>
  </base-dialog>
  <div class="flex flex-wrap justify-center text-lg text-white">
    <base-button
      buttonType="success"
      v-if="showAddButton"
      @click="addAppointment"
    >
      Adicionar
    </base-button>
    <base-button v-if="showInfoButton" @click="showInfo(true)">
      Informações
    </base-button>
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
  watch: {
    appointmentInfo() {
      if (this.appointmentInfo.name !== "") {
        this.showAddButton = true;
      } else {
        this.showAddButton = false;
      }
    },
  },
  computed: {
    inputEnabled() {
      return this.editingAllowed ? false : true;
    },
  },
  created() {
    // Shows the info button if the selected hour already has an appointment
    if (this.$store.getters["agenda/selectedHours"].length === 1) {
      this.showInfoButton = true;
    }
    // Watches the store for valid values in the appointment object and shows the add button if needed
    this.$store.watch(
      () => {
        return this.$store.getters["agenda/appointmentInfo"];
      },
      () => {
        this.showAddButton = true;
      }
    );
    // Watches the store for changes in the selectedHours array and changes views accordingly
    this.$store.watch(
      () => {
        return this.$store.getters["agenda/selectedHours"];
      },
      (newValue) => {
        if (newValue.length === 1) {
          this.showInfo();
        } else {
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
</script>
