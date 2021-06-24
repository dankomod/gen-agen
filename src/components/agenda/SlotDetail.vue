<template>
  <div
    v-for="(appointment, index) in slotAppointments"
    :key="appointment[0]"
    class="p-1"
  >
    <div
      v-if="
        showAppointmentItem === null || showAppointmentItem === appointment[0]
      "
      :key="appointment[0]"
      class="p-4 space-y-1 border border-indigo-300 hover:bg-indigo-100"
    >
      <p v-if="Object.keys(slotAppointments).length > 1" class="pb-2 text-lg">
        Agendamento {{ index + 1 }}
      </p>
      <appointment-form
        :form-data="appointment"
        :form-enabled="appointmentFormEnabled"
        class="pb-2"
      ></appointment-form>
      <client-form
        v-if="showClientForm && selectedClient[0] === appointment[1].clientId"
        :form-data="selectedClient"
        :form-enabled="clientFormEnabled"
        class="pb-2"
      ></client-form>
      <div class="flex flex-row justify-between">
        <div class="relative inline-block text-left">
          <div>
            <button
              type="button"
              class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
              aria-expanded="true"
              aria-haspopup="true"
              @click="toggleDrop()"
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
            :key="appointment[0]"
            v-if="showDrop"
            class="absolute left-0 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg  ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabindex="-1"
          >
            <div v-if="showDrop" class="py-1" role="none">
              <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->
              <a
                href="#"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100"
                role="menuitem"
                tabindex="-1"
                @click="viewClient(appointment[1].clientId), toggleDrop()"
              >
                {{ !showClientForm ? "Ver Cliente" : "Ocultar Detalhes" }}</a
              >
              <a
                v-if="showClientForm && !clientFormEnabled"
                href="#"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100"
                role="menuitem"
                tabindex="-1"
                @click="
                  viewClient(appointment[1].clientId),
                    toggleDrop(),
                    (clientFormEnabled = true)
                "
              >
                Editar Cliente
              </a>
              <a
                v-if="!appointment.isPaid"
                href="#"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100"
                role="menuitem"
                tabindex="-1"
                @click="changeStatus(appointment[0], 'isPaid'), toggleDrop()"
              >
                Marcar como Pago</a
              >
              <a
                v-if="!appointment.isDone"
                href="#"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100"
                role="menuitem"
                tabindex="-1"
                @click="changeStatus(appointment[0], 'isDone'), toggleDrop()"
              >
                Marcar como Concluído</a
              >
              <a
                href="#"
                class="block px-4 py-2 text-sm text-yellow-700  hover:bg-blue-100"
                role="menuitem"
                tabindex="-1"
                @click="
                  toggleDrop(), toggleAppointmentFormInput(true, appointment[0])
                "
                >Editar Agendamento</a
              >
              <a
                href="#"
                class="block px-4 py-2 text-sm text-red-700 hover:bg-blue-100"
                role="menuitem"
                tabindex="-1"
                @click="toggleDrop(), deleteAppointment(appointment[0])"
                >Excluir Agendamento</a
              >
            </div>
          </div>
        </div>
        <!-- Start of Action Buttons -->
        <div class="flex flex-row justify-between">
          <!-- Start of Client Action Buttons -->
          <span v-if="!appointmentFormEnabled" class="space-x-2">
            <!-- Start of Client Edition Menu -->
            <span v-if="showClientForm && !clientFormEnabled" class="space-x-2">
              <!-- Confirm Client Editing Button -->
              <base-button
                :button-type="'success'"
                @click="editClient(appointment[1].clientId)"
              >
                Confirmar
              </base-button>
              <!-- Cancel Client Editing Button -->
              <base-button
                :button-type="'danger'"
                @click="clientFormEnabled = false"
              >
                Cancelar
              </base-button>
            </span>
            <!-- End of Client Edition Menu -->
          </span>
          <!-- End of Client Action Buttons -->
          <!-- Appointment Action Buttons -->
          <span v-if="!showClientForm">
            <!-- Start of Appointment Edition Menu -->
            <span v-if="!appointmentFormEnabled" class="space-x-2">
              <!-- Confirm Edition Button -->
              <base-button
                :button-type="'success'"
                @click="editAppointment(appointment[0])"
              >
                Confirmar
              </base-button>
              <!-- Delete Appointment Button -->
              <base-button
                :button-type="'danger'"
                @click="toggleAppointmentFormInput(false, null)"
              >
                Cancelar
              </base-button>
            </span>
            <!-- End of Appointment Edition Menu -->
          </span>
          <!-- End of Appointment Action Buttons -->
        </div>
        <!-- End of Action Buttons -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: { AppointmentForm, BaseButton, ClientForm },
  emits: ["update"],
  data() {
    return {
      showDrop: false,
      appointmentFormEnabled: false,
      dialogKey: 0,
      showAppointmentItem: null,
      showClientForm: false,
      selectedClient: [],
      clientFormEnabled: false,
      slotAppointments: [],
    };
  },
  created() {
    this.slotAppointments = this.$store.getters["agenda/slotAppointments"];
  },
  methods: {
    // Retrieves client by Id
    async viewClient(clientId) {
      // Only sends requests when no client has been selected
      if (this.selectedClient[0] !== clientId) {
        let clientsBulk = {};
        try {
          clientsBulk = await this.$store.dispatch("clients/loadClients");
        } catch (error) {
          console.log(error || "Something went wrong!");
        }
        // For entry of clientsBulk
        for (let client of Object.entries(clientsBulk)) {
          // If the name in the entry contains the this.searchQuery as a substring, push the entry onto the this.filteredClients array
          if (client[0].includes(clientId)) {
            this.selectedClient = client;
            this.showClientForm = true;
          }
        }
      } else {
        this.showClientForm = !this.showClientForm;
      }
    },
    async changeStatus(appointmentId, status) {
      const appointmentInfo = {};
      if (status === "isPaid") {
        appointmentInfo.isPaid = true;
      } else if (status === "isDone") {
        appointmentInfo.isDone = true;
      }
      this.$store.dispatch("agenda/setAppointmentNewData", appointmentInfo);
      this.editAppointment(appointmentId);
      this.$emit("update");
    },
    async editClient(clientId) {
      try {
        await this.$store.dispatch("clients/editClient", clientId);
      } catch (error) {
        console.log(error || "Something went wrong!");
      }
      this.clientFormEnabled = false;
      this.showClientForm = false;
      this.update();
      // TODO: Confirmation popup
    },
    async deleteAppointment(appointmentId) {
      this.toggleAppointmentFormInput(false, null);
      try {
        await this.$store.dispatch("agenda/deleteAppointment", appointmentId);
      } catch (error) {
        console.log(error || "Something went wrong!");
      }
      this.showClientForm = false;
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
      this.showClientForm = false;
      this.update();
      // TODO: Confirmation popup
    },
    toggleAppointmentFormInput(value, appointmentId) {
      this.appointmentFormEnabled = value;
      this.showAppointmentItem = appointmentId;
    },
    // Re-rendering
    update() {
      this.$emit("update");
    },
    toggleDrop() {
      this.showDrop = !this.showDrop;
    },
  },
};
import BaseButton from "./../ui/BaseButton.vue";
import AppointmentForm from "./AppointmentForm.vue";
import ClientForm from "./../clients/ClientForm.vue";
</script>
