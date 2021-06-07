<template>
  <div class="flex flex-wrap justify-center text-lg text-white">
    <button
      class="w-32 py-3 m-1 font-medium tracking-wide bg-green-700"
      @click="addAppointment"
    >
      Adicionar
    </button>
  </div>
</template>

<script>
export default {
  methods: {
    // Adds a new appointment, reloads all data and refreshes the rendering
    async addAppointment() {
      let payload = {
        user: "h1",
      };
      await this.$store.dispatch("agenda/newAppointment", payload);
      // TODO: Refresh
    },
  },
};
// TODO: Show add button if no selection of taken time, hide others
// TODO: Show edit and remove button if selection of taken time, hide add
// TODO: Block buttons if free and taken times are selected
</script>
