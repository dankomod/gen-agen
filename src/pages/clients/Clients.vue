<template>
  <div class="flex flex-col items-center justify-center space-y-10">
    <!-- TOP MENU -->
    <div class="space-x-2">
      <!-- Search Button -->
      <base-button @click="toggleSearch(true), toggleCreation(false)">
        Pesquisar Clientes
      </base-button>
      <!-- New Client Button -->
      <base-button
        button-type="success"
        @click="toggleCreation(true), toggleSearch(false)"
      >
        Cadastrar Cliente
      </base-button>
    </div>
    <client-search v-if="showSearch" @selection="selection"></client-search>
    <client-form
      v-if="showClientForm"
      :form-data="formData"
      :form-enabled="clientFormEnabled"
    ></client-form>
    <div v-if="showClientForm && showCreationMenu">
      <base-button button-type="success" @click="createClient">
        Cadastrar Cliente
      </base-button>
    </div>
    <!-- ACTIONS MENU -->
    <div
      v-if="showClientForm && showActionsMenu && !showEditMenu"
      class="space-x-2"
    >
      <!-- Edit Client Button -->
      <base-button
        button-type="warning"
        @click="toggleInputs(true), toggleEditMenu(true)"
      >
        Editar
      </base-button>
      <!-- Delete Client Button -->
      <base-button button-type="danger" @click="deleteClient">
        Remover
      </base-button>
    </div>
    <!-- EDIT MENU -->
    <base-binary-buttons
      v-if="showClientForm && showActionsMenu && showEditMenu"
      @yes="editClient"
      @no="toggleInputs(false), toggleEditMenu(false)"
    ></base-binary-buttons>
  </div>
</template>

<script>
export default {
  components: { ClientForm, ClientSearch },
  data() {
    return {
      clientFormEnabled: false,
      formData: null,
      showActionsMenu: false,
      showCreationMenu: false,
      showEditMenu: false,
      showClientForm: false,
      showSearch: false,
    };
  },
  methods: {
    async createClient() {
      // TODO: Better form validation
      const response = await this.$store.dispatch("clients/createClient");
      this.$store.dispatch("setAlertData", response);
      if (response.alertType === "success") {
        this.toggleCreation(false);
      }
    },
    async deleteClient() {
      const response = await this.$store.dispatch(
        "clients/deleteClient",
        this.formData[0]
      );
      this.$store.dispatch("setAlertData", response);
      if (response.alertType === "success") {
        this.toggleInputs(false);
        this.toggleForm(false);
        this.toggleEditMenu(false);
        this.toggleSearch(true);
      }
    },
    async editClient() {
      const response = await this.$store.dispatch(
        "clients/editClient",
        this.formData[0]
      );
      this.$store.dispatch("setAlertData", response);
      if (response.alertType === "success") {
        this.toggleInputs(false);
        this.toggleForm(false);
        this.toggleSearch(false);
      }
    },
    // Called when a client is selected in ClientSearch component
    selection() {
      this.formData = this.$store.getters["clients/selectedClient"];
      this.toggleActionsMenu(true);
      this.toggleForm();
    },
    toggleActionsMenu(value = true) {
      this.showActionsMenu = value;
    },
    toggleCreation(value = true) {
      this.toggleForm(value);
      this.toggleInputs(value);
      this.showCreationMenu = value;
    },
    toggleEditMenu(value = true) {
      this.showEditMenu = value;
    },
    toggleForm(value = true) {
      this.showClientForm = value;
    },
    // Toggle form inputs
    toggleInputs(value = true) {
      this.clientFormEnabled = value;
    },
    toggleSearch(value = true) {
      this.showSearch = value;
    },
  },
};
import ClientForm from "./../../components/clients/ClientForm.vue";
import ClientSearch from "./../../components/clients/ClientSearch.vue";
</script>
