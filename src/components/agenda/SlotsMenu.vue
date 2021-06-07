<template>
  <div class="flex flex-wrap items-center justify-center pb-10">
    <!-- :key="key" -->
    <article
      v-for="agendaSlot in agendaSlots"
      :key="agendaSlot.dateTime"
      class="relative float-left w-24 h-24 m-1 overflow-hidden border"
      :class="takenFormat(agendaSlot.takenCount)"
    >
      <!--  -->
      <input
        v-model="selectedHours"
        :value="agendaSlot.dateTime"
        type="checkbox"
        class="absolute top-0 left-0 w-24 h-24 opacity-0 cursor-pointer"
      />
      <div
        class="
          flex
          items-center
          justify-center
          w-full
          h-full
          transition
          duration-100
          ease-linear
        "
      >
        <span class="text-2xl">{{ agendaSlot.displayTime }}</span>
      </div>
    </article>
  </div>
</template>

<script>
export default {
  methods: {
    async addAppointment() {
      let payload = {
        user: "h1",
        date: "",
      };
      for (const selectedHour of this.selectedHours) {
        payload.date = selectedHour;
        await this.$store.dispatch("agenda/newAppointment", payload);
      }
      this.selectedHours = []; // Removes the user selection
      this.intervalCalculator();
      this.loadAppointments();
      this.updateHourSelector();
    },
    // Defines the conditional formatting based on the ammount of appointments per slot
    takenFormat(takenCount) {
      if (takenCount === 0 || takenCount === undefined) {
        return "text-green-600 border-green-400 bg-green-100";
      } else if (takenCount === 1) {
        return "text-yellow-600 border-yellow-400 bg-yellow-100";
      } else if (takenCount >= 2) {
        return "text-red-600 border-red-300 bg-red-100";
      }
    },
  },
  created() {
    this.agendaSlots = this.$store.getters["agenda/agendaHours"];
    // Watches for changes of agendaHours in the store // https://stackoverflow.com/a/46097506 // https://vuejs.org/v2/api/#vm-watch
    this.$store.watch(
      () => {
        return this.$store.getters["agenda/agendaHours"]; // Will call the handler everytime this getter returns a *different* result
      },
      (newValue, oldValue) => {
        if (newValue !== oldValue) {
          this.agendaSlots = this.$store.getters["agenda/agendaHours"];
        }
      }
    );
  },
  watch: {
    selectedHours(newVal) {
      this.$store.dispatch("agenda/setSelectecHours", newVal);
    },
  },
  data() {
    return { agendaSlots: null, selectedHours: [] };
  },
};
</script>

<style scoped>
input[type="checkbox"]:checked ~ div {
  background-color: rgb(191, 217, 257);
  color: rgb(30, 64, 175);
}
</style>
