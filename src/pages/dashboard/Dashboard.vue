<template>
  <div>
    <h1 class="text-2xl text-center">Administração</h1>
    <div class="flex flex-wrap">
      <div class="p-5">
        <h2 class="pb-2 text-xl">Agendamentos</h2>
        <p>Últimos 30 dias: {{ filterAppointments("past", 30).length }}</p>
        <p>Últimos 15 dias: {{ filterAppointments("past", 15).length }}</p>
        <p>Últimos 7 dias: {{ filterAppointments("past", 7).length }}</p>
        <p>Ontem: {{ filterAppointments("past", 1).length }}</p>
        <p>Hoje: {{ filterAppointments().length }}</p>
        <p>Amanhã: {{ filterAppointments("future", 1).length }}</p>
        <p>Próximos 7 dias: {{ filterAppointments("future", 7).length }}</p>
        <p>Próximos 15 dias: {{ filterAppointments("future", 15).length }}</p>
        <p>Próximos 30 dias: {{ filterAppointments("future", 30).length }}</p>
      </div>
      <div class="p-5 pb-2">
        <h2 class="text-xl">Clientes</h2>
        <p>Últimos 30 dias: {{}}</p>
        <p>Últimos 15 dias: {{}}</p>
        <p>Últimos 7 dias: {{}}</p>
        <p>Ontem: {{}}</p>
        <p>Hoje: {{}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { DateTime } from "luxon";
export default {
  data() {
    return {
      allAppointments: [],
    };
  },
  async created() {
    await this.getAppointments();
  },
  methods: {
    // Requests appointments for current, past and last month
    async getAppointments() {
      const now = DateTime.now(); // Current YYYY/MM
      const past = now.minus({ months: 1 }); // Past YYYY/MM
      const future = now.plus({ months: 1 }); // Future YYYY/MM
      for (let time of [now, past, future]) {
        this.joinAppointments(
          await this.$store.dispatch("agenda/monthAppointments", time) // Retrieves data and sends it to be joined
        );
      }
    },
    // Join the appointments to a single array
    joinAppointments(monthAppointments) {
      if (monthAppointments && Object.keys(monthAppointments).length !== 0) {
        for (let day of Object.values(monthAppointments)) {
          for (let appointment of Object.values(day)) {
            this.allAppointments.push(appointment);
          }
        }
      }
    },
    filterAppointments(when = "now", value = null) {
      const startOfToday = DateTime.now().startOf("day"); // Today, 00h:00m
      const endOfToday = DateTime.now()
        .startOf("day")
        .plus({ days: 1 })
        .minus({ milliseconds: 1 }); // Today, 23h:59m:59s:999ms
      // Past Filter
      if (when === "past") {
        const pastTimeFilter = startOfToday.minus({ days: value }); // Today minus number of days argument
        return this.allAppointments.filter((val) => {
          const valDateTime = DateTime.fromISO(val.dateTime); // The DateTime of each appointment
          return (
            valDateTime >= pastTimeFilter && valDateTime < startOfToday // >= Start of first day of the past, < start of current day
          );
        });
        // Future Filter
      } else if (when === "future") {
        const futureTimeFilter = endOfToday.plus({ days: value }); // End of the future day
        return this.allAppointments.filter((val) => {
          const valDateTime = DateTime.fromISO(val.dateTime);
          return valDateTime > endOfToday && valDateTime <= futureTimeFilter; // > End of current day, <= end of future day
        });
        // Current date filter
      } else if (when === "now") {
        return this.allAppointments.filter((val) => {
          const valDateTime = DateTime.fromISO(val.dateTime);
          return valDateTime >= startOfToday && valDateTime <= endOfToday; // >= Start of current day, <= End of current day
        });
      }
    },
  },
};
</script>
