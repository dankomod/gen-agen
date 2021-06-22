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
      currentMonthAppointments: {},
      pastMonthAppointments: {},
      nextMonthAppointments: {},
    };
  },
  async created() {
    await this.monthsAppointments();
    console.log(this.filterAppointments("future", 2).length);
  },
  methods: {
    filterAppointments(when = "now", value = null) {
      const startOfToday = DateTime.now().startOf("day");
      const endOfToday = DateTime.now()
        .startOf("day")
        .plus({ days: 1 })
        .minus({ milliseconds: 1 });
      if (when === "past") {
        const dateTimeFilter = startOfToday
          .minus({ days: value })
          .startOf("day");
        return this.allAppointments.filter((val) => {
          const valueDateTime = DateTime.fromISO(val.dateTime);
          return (
            valueDateTime >= dateTimeFilter && valueDateTime < startOfToday
          );
        });
      } else if (when === "future") {
        const dateTimeFilter = endOfToday.plus({ days: value }); // End of the future day
        return this.allAppointments.filter((val) => {
          const valueDateTime = DateTime.fromISO(val.dateTime);
          return valueDateTime > endOfToday && valueDateTime <= dateTimeFilter;
        });
      } else if (when === "now") {
        return this.allAppointments.filter((val) => {
          const valueDateTime = DateTime.fromISO(val.dateTime);
          return valueDateTime >= startOfToday && valueDateTime <= endOfToday;
        });
      }
    },
    // Requests appointments for current, past and last month and pushes all the appointments into an array
    async monthsAppointments() {
      // current yyyy/mm
      const currentMonthAppointments = await this.$store.dispatch(
        "agenda/monthAppointments",
        DateTime.now()
      );
      if (
        currentMonthAppointments &&
        Object.keys(currentMonthAppointments).length !== 0
      ) {
        for (let day of Object.values(currentMonthAppointments)) {
          for (let appointment of Object.values(day)) {
            this.allAppointments.push(appointment);
          }
        }
      }
      // past yyyy/mm
      const pastMonthAppointments = await this.$store.dispatch(
        "agenda/monthAppointments",
        DateTime.now().minus({ months: 1 })
      );
      if (
        pastMonthAppointments &&
        Object.keys(pastMonthAppointments).length !== 0
      ) {
        for (let day of Object.values(pastMonthAppointments)) {
          for (let appointment of Object.values(day)) {
            this.allAppointments.push(appointment);
          }
        }
      }
      // next yyyy/mm
      const nextMonthAppointments = await this.$store.dispatch(
        "agenda/monthAppointments",
        DateTime.now().plus({ months: 1 })
      );
      if (
        nextMonthAppointments &&
        Object.keys(nextMonthAppointments).length !== 0
      ) {
        for (let day of Object.values(nextMonthAppointments)) {
          for (let appointment of Object.values(day)) {
            this.allAppointments.push(appointment);
          }
        }
      }
    },
  },
};
</script>
