<template>
  <div class="flex flex-col items-center justify-center space-y-10">
    <!-- TOP MENU -->
    <div class="space-x-2">
      <!-- Search View -->
      <base-button @click="toggleClientCreation(false)">
        Pesquisar Clientes
      </base-button>
      <!-- New Client View -->
      <base-button button-type="success" @click="toggleClientCreation(true)">
        Cadastrar Cliente
      </base-button>
    </div>
    <!-- Search -->
    <client-search
      v-if="showClientSearch"
      @selection="selection"
    ></client-search>
    <client-form
      v-if="showClientForm"
      :form-data="formData"
      :form-enabled="clientFormEnabled"
    ></client-form>
    <!-- New Client Menu -->
    <div>
      <base-button
        v-if="showCreationButton"
        button-type="success"
        @click="createClient"
      >
        Cadastrar Cliente
      </base-button>
    </div>
    <!-- Existing Client Menu -->
    <div v-if="showEditMenu" class="space-x-2">
      <div v-if="!showEditConfirmation && !showDeletionConfirmation">
        <!-- Edit Client Button -->
        <base-button
          button-type="warning"
          @click="(clientFormEnabled = true), (showEditConfirmation = true)"
        >
          Editar
        </base-button>
        <!-- Delete Client Button -->
        <base-button
          button-type="danger"
          @click="showDeletionConfirmation = true"
        >
          Remover
        </base-button>
      </div>
      <base-binary-buttons
        v-if="showEditConfirmation"
        @yes="editClient()"
        @no="(clientFormEnabled = false), (showEditConfirmation = false)"
      ></base-binary-buttons>
      <base-dialog v-if="showDeletionConfirmation" :dialog-type="'danger'">
        Tem certeza de que deseja remover o cadastro do cliente?
      </base-dialog>
      <base-binary-buttons
        v-if="showDeletionConfirmation"
        @yes="deleteClient"
        @no="showDeletionConfirmation = false"
      ></base-binary-buttons>
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
      showEditMenu: false,
      showCreationButton: false,
      showDeletionConfirmation: false,
      showEditConfirmation: false,
      showClientForm: false,
      showClientSearch: false,
    };
  },
  methods: {
    async createClient() {
      const response = await this.$store.dispatch("clients/createClient");
      this.$store.dispatch("setAlertData", response);
      if (response.alertType === "success") {
        this.clientFormEnabled = false;
        this.showCreationButton = false;
        this.showClientForm = false;
      }
    },
    async deleteClient() {
      const response = await this.$store.dispatch(
        "clients/deleteClient",
        this.formData[0]
      );
      this.$store.dispatch("setAlertData", response);
      if (response.alertType === "success") {
        this.clientFormEnabled = false;
        this.showClientForm = false;
        this.showClientSearch = false;
        this.showEditMenu = false;
        this.showDeletionConfirmation = false;
      }
    },
    async editClient() {
      const response = await this.$store.dispatch(
        "clients/editClient",
        this.formData[0]
      );
      this.$store.dispatch("setAlertData", response);
      if (response.alertType === "success") {
        this.clientFormEnabled = false;
        this.showClientForm = false;
        this.showClientSearch = false;
        this.showEditConfirmation = false;
        this.showEditMenu = false;
      }
    },
    // Called when a client is selected in ClientSearch component
    selection(value) {
      // newClient prop triggers a client creation
      if (value === "newClient") {
        this.formData = [null, this.$store.getters["clients/clientNewData"]]; // format [id,{values}]
        this.clientFormEnabled = true;
        this.showCreationButton = true;
        this.showEditMenu = false;
      } else {
        this.formData = this.$store.getters["clients/selectedClient"];
        this.showCreationButton = false;
        this.showEditMenu = true;
      }
      this.showClientForm = true;
    },
    toggleClientCreation(value) {
      this.formData = null;
      this.showEditMenu = false;
      this.clientFormEnabled = value;
      this.showClientForm = value;
      this.showClientSearch = !value;
      this.showCreationButton = value;
    },
  },
};
import ClientForm from "./../../components/clients/ClientForm.vue";
import ClientSearch from "./../../components/clients/ClientSearch.vue";
</script>
