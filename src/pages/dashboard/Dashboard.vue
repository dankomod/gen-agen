<template>
  <div>
    <h1 class="pb-6 text-2xl text-center">Administração</h1>
    <div class="flex flex-wrap">
      <div class="w-full p-2 xs:w-1/2 sm:w-1/3">
        <div class="w-full p-5 border border-indigo-300">
          <h2 class="pb-2 text-xl deep-purple-700-accent">
            Agendamentos: {{ allAppointments.length }}
          </h2>
          <p>-30 dias: {{ filter("appointments", "past", 30).length }}</p>
          <p>-15 dias: {{ filter("appointments", "past", 15).length }}</p>
          <p>-7 dias: {{ filter("appointments", "past", 7).length }}</p>
          <p>Ontem: {{ filter("appointments", "past", 1).length }}</p>
          <p>Hoje: {{ filter("appointments").length }}</p>
          <p>Amanhã: {{ filter("appointments", "future", 1).length }}</p>
          <p>+7 dias: {{ filter("appointments", "future", 7).length }}</p>
        </div>
      </div>
      <div class="w-full p-2 xs:w-1/2 sm:w-1/3">
        <div class="w-full p-5 border border-indigo-300">
          <h2 class="pb-2 text-xl">Clientes Ativos</h2>
          <p>-30 dias: {{ filter("lastAppointment", "past", 30).length }}</p>
          <p>-15 dias: {{ filter("lastAppointment", "past", 15).length }}</p>
          <p>-7 dias: {{ filter("lastAppointment", "past", 7).length }}</p>
          <p>Ontem: {{ filter("lastAppointment", "past", 1).length }}</p>
          Hoje: {{ filter("lastAppointment").length }}
        </div>
      </div>
      <div class="w-full p-2 xs:w-1/2 sm:w-1/3">
        <div class="w-full p-5 border border-indigo-300">
          <h2 class="pb-2 text-xl">Novos Clientes: {{ allClients.length }}</h2>
          <p>-30 dias: {{ filter("clients", "past", 30).length }}</p>
          <p>-15 dias: {{ filter("clients", "past", 15).length }}</p>
          <p>-7 dias: {{ filter("clients", "past", 7).length }}</p>
          <p>Ontem: {{ filter("clients", "past", 1).length }}</p>
          <p>Hoje: {{ filter("clients").length }}</p>
        </div>
      </div>
      <div class="w-full p-2 xs:w-1/2 sm:w-1/3">
        <div class="w-full p-5 border border-indigo-300">
          <h2 class="pb-2 text-xl">Pagamentos</h2>
          <p>-30 dias: {{ paid.last30 }}</p>
          <p>-15 dias: {{ paid.last15 }}</p>
          <p>-7 dias: {{ paid.last7 }}</p>
          <p>Ontem: {{ paid.yesterday }}</p>
          <p>Hoje: {{ paid.today }}</p>
        </div>
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
      paid: {},
    };
  },
  async created() {
    await this.loadClients();
    await this.loadAppointments();
    this.filterPaid();
  },
  methods: {
    // This function minimizes filter() calls
    filterPaid() {
      let paidAppointments = [];
      const queries = [
        ["today", "null", "today"],
        ["past", 1, "yesterday"], // TODO: Fix: This = 'yesterday' + 'today', must show 'yesterday' only
        ["past", 7, "last7"],
        ["past", 15, "last15"],
        ["past", 30, "last30"],
      ];
      for (let query of queries) {
        const dateFiltered = this.filter("appointments", query[0], query[1]);
        for (let appointment of dateFiltered) {
          if (appointment.isPaid) {
            paidAppointments.push(parseInt(appointment.price));
          }
        }
        this.paid[query[2]] = paidAppointments.reduce((a, b) => {
          return a + b;
        }, 0);
      }
    },
    // Returns filtered appointments based on time and number of days. Takes the 'today', 'past' and 'future' time filters.
    filter(type, when = "today", value = null) {
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
      } else {
        return null;
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
      } else if (when === "today") {
        return arrayToFilter.filter((val) => {
          const dateTime = DateTime.fromISO(val[filterKey]);
          return dateTime >= startOfToday && dateTime <= endOfToday; // >= Start of current day, <= End of current day
        });
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
    // Requests appointments for current, past and last month
    async loadAppointments() {
      const today = DateTime.now(); // Current YYYY/MM
      const past = today.minus({ months: 1 }); // Past YYYY/MM
      const future = today.plus({ months: 1 }); // Future YYYY/MM
      for (let time of [today, past, future]) {
        this.joinAppointments(
          await this.$store.dispatch("agenda/monthAppointments", time) // Retrieves data and sends it to be joined
        );
      }
    },
    async loadClients() {
      const response = await this.$store.dispatch("clients/loadClients");
      if (response && "alertMessage" in response) {
        this.$store.dispatch("setAlertData", response);
      } else {
        for (let client of Object.values(response)) {
          this.allClients.push(client);
        }
      }
    },
  },
};
import { DateTime } from "luxon";
</script>
