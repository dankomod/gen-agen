<template>
  <div class="flex flex-col items-center">
    <h1 class="pb-10 text-2xl">Agenda</h1>
    <div class="flex flex-wrap items-center justify-center pb-10">
      <article
        v-for="agendaHour in agendaHours"
        :key="agendaHour.dateTime"
        class="relative float-left w-24 h-20 m-1 overflow-hidden border"
        :class="
          takenHourCheck(agendaHour.displayTime)
            ? 'text-red-600 border-red-200 bg-red-100'
            : 'text-green-600 border-green-200 bg-green-100'
        "
      >
        <input
          v-model="selectedHours"
          @change="hoursSelected"
          :value="agendaHour.dateTime"
          type="checkbox"
          class="absolute top-0 left-0 w-24 h-20 opacity-0 cursor-pointer"
        />
        <div
          class="flex items-center justify-center w-full h-full transition duration-100 ease-linear "
        >
          <span class="text-2xl">{{ agendaHour.displayTime }}</span>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
// TODO: a better way to deal with conditional classes -- maybe computed properties are a need for this
// TODO: incorporate the css inside the style tag onto tailwind
// TODO: clear inputs after action and force the rerendering
// TODO: conditional formatting based on occupancy. Green for completelly free, yellow to moderate and red for full.
// TODO: possibility to mark hours as disabled
import { DateTime } from "luxon";
export default {
  data() {
    return {
      agendaHours: [],
      takenHours: [],
      baseDate: null,
      closingHour: "",
      openingHour: "",
      selectedHours: [],
    };
  },
  created() {
    // Gets the opening and closing hours from the state
    this.openingHour = this.$store.getters["agenda/openingHour"];
    this.closingHour = this.$store.getters["agenda/closingHour"];
    this.setDate();
    this.loadAppointments();
    this.intervalCalculator();
  },
  methods: {
    hoursSelected() {
      this.$emit("selectedHours", this.selectedHours);
    },
    intervalCalculator() {
      // TODO: opening and closing hours may be defined on a daily basis (weekends and holydays)
      let opening = this.baseDate.plus({ hours: this.openingHour });
      const closing = this.baseDate.plus({ hours: this.closingHour });
      // Push of the starting hour
      this.agendaHours.push({
        dateTime: opening,
        displayTime: opening.toFormat("HH:mm"),
      });
      // Push of hours until closing time
      while (opening < closing) {
        opening = opening.plus({ minutes: 30 });
        // Won't push the closing time
        if (opening < closing) {
          this.agendaHours.push({
            dateTime: opening,
            displayTime: opening.toFormat("HH:mm"),
          });
        }
      }
    },
    // TODO: must receive the date from elsewhere
    setDate() {
      this.baseDate = DateTime.local(2021, 6, 2);
      this.$store.dispatch("agenda/setBaseDate", this.baseDate);
    },
    async loadAppointments() {
      // TODO: must not be manually inputted
      const payload = {
        year: 2021,
        month: 6,
        day: 2,
      };
      this.takenHours = await this.$store.dispatch(
        "agenda/loadAppointments",
        payload
      );
    },
    takenHourCheck(agendaHour) {
      return this.takenHours.includes(agendaHour);
    },
  },
};
</script>

<style>
input[type="checkbox"]:checked ~ div {
  background-color: rgb(191, 217, 257);
  color: rgb(30, 64, 175);
}
</style>
