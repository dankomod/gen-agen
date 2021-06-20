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
        Cadastrar novo Cliente
      </base-button>
    </div>
    <client-search v-if="showSearch" @selection="selection"></client-search>
    <client-form
      v-if="showForm"
      :form-data="formData"
      :form-enabled="clientFormEnabled"
    ></client-form>
    <div v-if="showForm && showCreationMenu">
      <base-button button-type="success" @click="createClient">
        Cadastrar Cliente
      </base-button>
    </div>
    <!-- ACTIONS MENU -->
    <div v-if="showForm && showActionsMenu && !showEditMenu" class="space-x-2">
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
    <div v-if="showForm && showActionsMenu && showEditMenu" class="space-x-2">
      <!-- Confirm Edit Button -->
      <base-button
        button-type="success"
        @click="editClient, toggleInputs(false), toggleEditMenu(false)"
      >
        Confirmar alterações
      </base-button>
      <!-- //TODO: -->
      <!-- Cancel Edit Button -->
      <base-button
        button-type="danger"
        @click="toggleInputs(false), toggleEditMenu(false)"
        >Cancelar</base-button
      >
    </div>
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
      showForm: false,
      showSearch: false,
    };
  },
  methods: {
    async createClient() {
      // TODO: Better form validation
      try {
        await this.$store.dispatch("clients/createClient");
        this.toggleCreation(false);
        // TODO: Popup message
      } catch (error) {
        console.log(error);
      }
    },
    async deleteClient() {
      try {
        // this.formData[0] is the id of the client, the array is formatted as [id,{data}]
        await this.$store.dispatch("clients/deleteClient", this.formData[0]);
        this.toggleInputs(false);
        this.toggleForm(false);
        this.toggleSearch(false);
        // TODO: Popup Asking for confirmation and the confirming the deletion or denying
      } catch (error) {
        console.log(error);
      }
    },
    async editClient() {
      try {
        await this.$store.dispatch("clients/editClient", this.formData[0]);
        this.toggleInputs(false);
        this.toggleForm(false);
        this.toggleSearch(false);
        // TODO: Popup Informing the success or failure of the operation
      } catch (error) {
        console.log(error);
      }
    },
    // Called when a client is selected in ClientSearch component
    selection() {
      this.formData = this.$store.getters["clients/selectedClient"];
      this.toggleForm();
      this.toggleActionsMenu(true);
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
      this.showForm = value;
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
