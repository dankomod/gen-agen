<template>
  <div class="relative py-3">
    <input
      v-model="searchQuery"
      type="text"
      class="p-2 mb-2 placeholder-gray-600 bg-indigo-100"
      placeholder="Digite o nome do cliente"
      @keyup="filteredList"
    />
    <div
      class="absolute left-0 z-10 w-full mt-1 bg-gray-100 border border-gray-400 shadow "
      :class="this.searchQuery.length > 0 ? 'opacity-100' : 'opacity-0'"
    >
      <ul class="block text-gray-900">
        <li
          v-for="client in filteredClients"
          :key="client[0]"
          @click="showClient(client[0])"
        >
          <a href="#" class="block px-3 py-2 hover:bg-gray-200">
            {{ client[1].name }} ({{ client[1].phone }})
          </a>
        </li>
        <li>
          <a
            href="#"
            class="block px-3 py-2 bg-gray-200"
            @click="emitSelection(false)"
          >
            Adicionar Novo Cliente
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
      // Search query
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
          client[1].name.toLowerCase().includes(this.searchQuery.toLowerCase())
        ) {
          this.filteredClients.push(client);
        }
      }
    },
    // Calls the API for the clients data and fills this.clientsBulk with the response
    async loadClients() {
      try {
        this.clientsBulk = await this.$store.dispatch("clients/loadClients");
      } catch (error) {
        console.log(error || "Something went wrong!");
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
