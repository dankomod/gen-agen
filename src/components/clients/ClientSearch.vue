<template>
  <div class="relative py-3">
    <div class="flex flex-row">
      <input
        v-model="searchQuery"
        type="text"
        class="p-3 pl-12 mb-2 border border-indigo-100  bg-indigo-50 placeholder-grey-900"
        placeholder="Pesquisar cadastros"
        @keyup="filteredList"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="absolute w-6 h-6 transform translate-y-1/2 left-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
    <div
      v-show="searchQuery.length > 0"
      class="absolute left-0 z-10 w-full mt-1 bg-white border border-indigo-300 shadow "
    >
      <ul class="block text-grey-900">
        <li
          v-for="client in filteredClients"
          :key="client[0]"
          @click="showClient(client[0])"
        >
          <a href="#" class="block px-3 py-2 hover:bg-indigo-50">
            {{ client[1].name }} ({{ client[1].phone }})
          </a>
        </li>
        <li>
          <a
            href="#"
            class="block px-3 py-2 font-medium bg-indigo-100"
            @click="emitSelection(false)"
          >
            Cadastrar Cliente
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["selection"],
  data() {
    return {
      // Clients' data retrieved from the API
      clientsBulk: [],
      // Clients filtered after a search
      filteredClients: [],
      searchQuery: "",
    };
  },
  computed: {
    // Shows the client list if this.SearchQuery has any length
    showList() {
      return this.searchQuery.length;
    },
    // Shows the client form if a client has been selected
    showForm() {
      return this.selectedClient.length;
    },
  },
  created() {
    // An API request is sent everytime the component is created to retrive all the clients
    // ? This may become troubling as the ammount of clients grow
    this.loadClients();
  },
  methods: {
    emitSelection(value) {
      this.$emit("selection", value, this.searchQuery);
      // Clearing this.searchQuery to hide the query and this.filteredClients to destroy the rendering
      this.searchQuery = "";
      this.filteredClients = [];
    },
    // Filters this.clientsBulk acording to the this.searchQuery string
    filteredList() {
      this.filteredClients = [];
      // For entry of this.clientsBulk
      for (let client of Object.entries(this.clientsBulk)) {
        // If the name in the entry contains the this.searchQuery as a substring, push the entry onto the this.filteredClients array
        if (
          client &&
          client[1].name &&
          client[1].name.toLowerCase().includes(this.searchQuery.toLowerCase())
        ) {
          this.filteredClients.push(client);
        }
      }
    },
    // Calls the API for the clients data and fills this.clientsBulk with the response
    async loadClients() {
      const response = await this.$store.dispatch("clients/loadClients");
      if ("alertMessage" in response) {
        this.$store.dispatch("setAlertData", response);
      } else {
        this.clientsBulk = response;
      }
    },
    // Receives the ID of a client, search for it in this.filteredClients and fills this.selectedClient with it's full data
    showClient(clientId) {
      for (let client of this.filteredClients) {
        if (client[0] === clientId) {
          this.$store.dispatch("clients/setSelectedClient", client);
          this.emitSelection(true);
        }
      }
    },
  },
};
</script>
