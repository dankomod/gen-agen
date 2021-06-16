<template>
  <div>
    <h1>Base de clientes</h1>
    <!-- TOP MENU -->
    <div class="pb-5">
      <!-- Search Button -->
      <base-button @click="toggleSearch(true), toggleCreation(false)">
        Pesquisar
      </base-button>
      <!-- New Client Button -->
      <base-button
        @click="toggleCreation(true), toggleSearch(false)"
        buttonType="success"
      >
        Cadastrar
      </base-button>
    </div>
  </div>

  <client-search v-if="showSearch" @selection="selection"></client-search>

  <client-form
    v-if="showForm"
    :formData="formData"
    :formEnabled="clientFormEnabled"
  ></client-form>

  <div v-if="showForm && showCreationMenu">
    <base-button buttonType="success" @click="createClient">
      Cadastrar Cliente
    </base-button>
  </div>

  <!-- ACTIONS MENU -->
  <div v-if="showForm && showActionsMenu && !showEditMenu">
    <!-- Edit Client Button -->
    <base-button
      buttonType="warning"
      @click="toggleInputs(true), toggleEditMenu(true)"
    >
      Editar
    </base-button>
    <!-- Delete Client Button -->
    <base-button buttonType="danger" @click="deleteClient">
      Remover
    </base-button>
  </div>

  <!-- EDIT MENU -->
  <div v-if="showForm && showActionsMenu && showEditMenu">
    <!-- Confirm Edit Button -->
    <base-button
      buttonType="success"
      @click="editClient, toggleInputs(false), toggleEditMenu(false)"
    >
      Confirmar alterações
    </base-button>
    <!-- //TODO: -->
    <!-- Cancel Edit Button -->
    <base-button
      buttonType="danger"
      @click="toggleInputs(false), toggleEditMenu(false)"
      >Cancelar</base-button
    >
  </div>
</template>

<script>
import ClientForm from "./../../components/clients/ClientForm.vue";
import ClientSearch from "./../../components/clients/ClientSearch.vue";
export default {
  methods: {
    //!
    //!
    //!
    //!
    //!
    //!
    //!
    //!
    //!
    //!
    //!
    //!
    //!
    //!
    //!
    //!
    //!
    //!
    //!
    //!
    //!
    //!
    //!
    // async createClient() {
    //   // TODO: Better form validation
    //   try {
    //     await this.$store.dispatch("clients/createClient", createClientInfo);
    //     this.toggleCreation(false);
    //     // TODO: Popup message
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },
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
  components: { ClientForm, ClientSearch },
};
</script>
