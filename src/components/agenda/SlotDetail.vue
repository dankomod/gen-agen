<template>
  <div v-for="(appointment, index) in slotAppointments" :key="appointment[0]">
    <div
      v-if="
        showAppointmentItem === null || showAppointmentItem === appointment[0]
      "
      class="p-4 space-y-2 border border-indigo-300 hover:bg-indigo-100"
    >
      <p v-if="Object.keys(slotAppointments).length > 1" class="text-lg">
        Agendamento {{ index + 1 }}
      </p>
      <appointment-form
        :form-data="appointment"
        :form-enabled="appointmentFormEnabled"
      ></appointment-form>
      <client-form
        v-if="showClientForm === appointment[1].clientId"
        :form-data="selectedClient"
        :form-enabled="clientFormEnabled"
      ></client-form>
      <div class="flex flex-row justify-between">
        <div class="relative inline-block text-left">
          <div>
            <button
              type="button"
              class="inline-flex justify-center w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
              aria-expanded="true"
              aria-haspopup="true"
              @click="toggleDrop(appointment[0])"
            >
              Opções
              <svg
                class="w-5 h-5 ml-2 -mr-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div
            v-if="showDropMenu === appointment[0]"
            class="absolute left-0 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg  ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabindex="-1"
            @click="toggleDrop(appointment[0])"
          >
            <div
              v-if="showDropMenu"
              class="py-1 text-sm text-gray-700"
              role="none"
            >
              <a
                href="#"
                class="block px-4 py-2 hover:bg-blue-100"
                role="menuitem"
                tabindex="-1"
                @click="viewClient(appointment[1].clientId)"
              >
                {{
                  showClientForm !== appointment[1].clientId
                    ? "Ver Cliente"
                    : "Ocultar Detalhes"
                }}</a
              >
              <a
                v-if="showClientForm === appointment[1].clientId"
                href="#"
                class="block px-4 py-2 hover:bg-blue-100"
                role="menuitem"
                tabindex="-1"
                @click="clientFormEnabled = true"
              >
                Editar Cliente
              </a>
              <a
                v-if="!appointment[1].isPaid"
                href="#"
                class="block px-4 py-2 hover:bg-blue-100"
                role="menuitem"
                tabindex="-1"
                @click="changeStatus(appointment[0], 'isPaid')"
              >
                Marcar como Pago
              </a>
              <a
                v-if="!appointment[1].isDone"
                href="#"
                class="block px-4 py-2 hover:bg-blue-100"
                role="menuitem"
                tabindex="-1"
                @click="changeStatus(appointment[0], 'isDone')"
              >
                Marcar como Concluído
              </a>
              <a
                href="#"
                class="block px-4 py-2 hover:bg-blue-100"
                role="menuitem"
                tabindex="-1"
                @click="toggleAppointmentFormInput(true, appointment[0])"
                >Editar Agendamento
              </a>
              <a
                href="#"
                class="block px-4 py-2 text-red-700 hover:bg-blue-100"
                role="menuitem"
                tabindex="-1"
                @click="deleteAppointment(appointment[0])"
                >Excluir Agendamento
              </a>
            </div>
          </div>
        </div>
        <div class="flex flex-row justify-between">
          <!-- Client Action Buttons -->
          <base-binary-buttons
            v-if="
              showClientForm === appointment[1].clientId && clientFormEnabled
            "
            @yes="
              editClient(appointment[1].clientId), (clientFormEnabled = false)
            "
            @no="clientFormEnabled = false"
          ></base-binary-buttons>
          <!-- Appointment Action Buttons -->
          <base-binary-buttons
            v-if="!showClientForm && appointmentFormEnabled"
            @yes="editAppointment(appointment[0])"
            @no="toggleAppointmentFormInput(false, null)"
          ></base-binary-buttons>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable prettier/prettier */
export default {
  components: { AppointmentForm, ClientForm },
  emits: ["update"],
  data() {
    return {
      appointmentFormEnabled: false,
      clientFormEnabled: false,
      dialogKey: 0,
      selectedClient: [],
      showAppointmentItem: null,
      showClientForm: null,
      showDropMenu: null,
      slotAppointments: [],
    };
  },
  created() {
    this.slotAppointments = this.$store.getters["agenda/slotAppointments"];
  },
  methods: {
    async changeStatus(appointmentId, status) {
      const appointmentInfo = {};
      if (status === "isPaid") {
        appointmentInfo.isPaid = true;
      } else if (status === "isDone") {
        appointmentInfo.isDone = true;
      }
      this.$store.dispatch("agenda/setAppointmentNewData", appointmentInfo);
      this.editAppointment(appointmentId);
    },
    async deleteAppointment(appointmentId) {
      this.toggleAppointmentFormInput(false, null);
      try {
        await this.$store.dispatch("agenda/deleteAppointment", appointmentId);
      } catch (error) {
        console.log(error || "Something went wrong!");
      }
      this.update();
      // TODO: Confirmation popup
    },
    async editAppointment(appointmentId) {
      this.toggleAppointmentFormInput(false, null);
      try {
        await this.$store.dispatch("agenda/editAppointment", appointmentId);
      } catch (error) {
        console.log(error || "Something went wrong!");
      }
      this.update();
      // TODO: Confirmation popup
    },
    async editClient(clientId) {
      try {
        await this.$store.dispatch("clients/editClient", clientId);
      } catch (error) {
        console.log(error || "Something went wrong!");
      }
      this.clientFormEnabled = false;
      this.update();
      // TODO: Confirmation popup
    },
    toggleAppointmentFormInput(value, appointmentId) {
      this.appointmentFormEnabled = value;
      this.showAppointmentItem = appointmentId;
    },
    toggleDrop(value) {
      this.showDropMenu === value
        ? (this.showDropMenu = null)
        : (this.showDropMenu = value);
    },
    // Re-rendering
    update() {
      this.showClientForm = null;
      this.$emit("update");
    },
    // Retrieves client by Id
    async viewClient(clientId) {
      // Only sends requests when a new selection is made
      if (this.selectedClient[0] !== clientId) {
        let clientsBulk = {};
        try {
          clientsBulk = await this.$store.dispatch("clients/loadClients");
        } catch (error) {
          console.log(error || "Something went wrong!");
        }
        // For entry of clientsBulk
        for (let client of Object.entries(clientsBulk)) {
          // If the name in the entry contains the this.searchQuery as a substring, push the entry to the this.filteredClients array
          if (client[0].includes(clientId)) {
            this.selectedClient = client;
            this.showClientForm = clientId;
          }
        }
        // Toggles the view if no new selection is made, resets selectedClient
      } else {
        this.selectedClient = {};
        this.showClientForm = null;
      }
    },
  },
};
import AppointmentForm from "./AppointmentForm.vue";
import ClientForm from "./../clients/ClientForm.vue";
</script>
