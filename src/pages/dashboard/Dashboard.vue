<template>
  <div>
    <h1 class="text-2xl text-center">Administração</h1>
    <div class="flex flex-wrap">
      <div class="p-5">
        <h2 class="pb-2 text-xl">Agendamentos {{ allAppointments.length }}</h2>
        <p>Últimos 30 dias: {{ filter("appointments", "past", 30).length }}</p>
        <p>Últimos 15 dias: {{ filter("appointments", "past", 15).length }}</p>
        <p>Últimos 7 dias: {{ filter("appointments", "past", 7).length }}</p>
        <p>Ontem: {{ filter("appointments", "past", 1).length }}</p>
        <p>Hoje: {{ filter("appointments").length }}</p>
        <p>Amanhã: {{ filter("appointments", "future", 1).length }}</p>
        <p>Próximos 7 dias: {{ filter("appointments", "future", 7).length }}</p>
        <!-- <p>
          Próximos 15 dias: {{ filter("appointments", "future", 15).length }}
        </p>
        <p>
          Próximos 30 dias: {{ filter("appointments", "future", 30).length }}
        </p> -->
      </div>
      <div class="p-5 pb-2">
        <h2 class="pb-2 text-xl">Clientes {{ allClients.length }}</h2>
        <p>Últimos 30 dias: {{ filter("clients", "past", 30).length }}</p>
        <p>Últimos 15 dias: {{ filter("clients", "past", 15).length }}</p>
        <p>Últimos 7 dias: {{ filter("clients", "past", 7).length }}</p>
        <p>Ontem: {{ filter("clients", "past", 1).length }}</p>
        <p>Hoje: {{ filter("clients").length }}</p>
      </div>
      <div class="p-5 pb-2">
        <h2 class="pb-2 text-xl">Clientes Ativos</h2>
        <p>
          Últimos 30 dias: {{ filter("lastAppointment", "past", 30).length }}
        </p>
        <p>
          Últimos 15 dias: {{ filter("lastAppointment", "past", 15).length }}
        </p>
        <p>Últimos 7 dias: {{ filter("lastAppointment", "past", 7).length }}</p>
        <p>Ontem: {{ filter("lastAppointment", "past", 1).length }}</p>
        <p>Hoje: {{ filter("lastAppointment").length }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      allAppointments: [],
      allClients: [],
      showHeatmap: false,
    };
  },
  async created() {
    await this.loadAppointments();
    await this.loadClients();
    this.showHeatmap = true;
  },
  methods: {
    // Requests appointments for current, past and last month
    async loadAppointments() {
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
    // Returns filtered appointments based on time and number of days. Takes the 'now', 'past' and 'future' time filters.
    filter(type, when = "now", value = null) {
      let arrayToFilter = [];
      let filterKey = "";
      if (type === "appointments") {
        arrayToFilter = this.allAppointments;
        filterKey = "dateTime";
      } else if (type === "clients") {
        arrayToFilter = this.allClients;
        filterKey = "creationDate";
      } else if (type === "lastAppointment") {
        arrayToFilter = this.allClients;
        filterKey = "lastAppointment";
      }
      const startOfToday = DateTime.now().startOf("day"); // Today, 00h:00m
      const endOfToday = startOfToday
        .plus({ days: 1 })
        .minus({ milliseconds: 1 }); // Today, 23h:59m:59s:999ms
      // Past Filter
      if (when === "past") {
        const pastTimeFilter = startOfToday.minus({ days: value }); // Today minus number of days argument
        return arrayToFilter.filter((val) => {
          const dateTime = DateTime.fromISO(val[filterKey]); // The DateTime of each appointment
          return (
            dateTime >= pastTimeFilter && dateTime < startOfToday // >= Start of first day of the past, < start of current day
          );
        });
        // Future Filter
      } else if (when === "future") {
        const futureTimeFilter = endOfToday.plus({ days: value }); // End of the future day
        return arrayToFilter.filter((val) => {
          const dateTime = DateTime.fromISO(val[filterKey]);
          return dateTime > endOfToday && dateTime <= futureTimeFilter; // > End of current day, <= end of future day
        });
        // Current date filter
      } else if (when === "now") {
        return arrayToFilter.filter((val) => {
          const dateTime = DateTime.fromISO(val[filterKey]);
          return dateTime >= startOfToday && dateTime <= endOfToday; // >= Start of current day, <= End of current day
        });
      }
    },
    async loadClients() {
      const clients = await this.$store.dispatch("clients/loadClients");
      for (let client of Object.values(clients)) {
        this.allClients.push(client);
      }
    },
  },
};
import { DateTime } from "luxon";
</script>
