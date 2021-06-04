<template>
  <div class="flex flex-col items-center">
    <h1 class="pb-10 text-2xl">Agenda</h1>
    <!-- DATE SELECTOR -->
    <div class="flex">
      <label for="dateselector" class="pr-2">Data:</label>
      <input
        type="date"
        name="dateselector"
        id="dateselector"
        v-model="selectedDate"
        @change="dateSelected"
      />
    </div>
    <!-- HOUR SELECTOR -->
    <div
      v-if="selectedDate"
      class="flex flex-wrap items-center justify-center pb-10"
      :key="key"
    >
      <article
        v-for="agendaHour in agendaHours"
        :key="agendaHour.dateTime"
        class="relative float-left w-24 h-20 m-1 overflow-hidden border"
        :class="takenFormat(agendaHour.taken)"
      >
        <input
          v-model="selectedHours"
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
    <!-- ACTIONS MENU -->
    <actions-menu
      v-if="showActionsMenu"
      @agendaAction="agendaAction"
    ></actions-menu>
  </div>
</template>

<script>
import { DateTime } from "luxon";
import ActionsMenu from "./ActionsMenu.vue";
export default {
  data() {
    return {
      // Opening hour retrieved from the State
      openingHour: "",
      // Closing hour retrieved from the State
      closingHour: "",
      // Holds all the data from all the appointments
      agendaHours: [],
      // Holds the appointments retrieved from the API
      takenHours: [],
      // The selected date
      selectedDate: false,
      // A DateTime object of selected date
      baseDate: null,
      // Array of all the selected hours
      selectedHours: [],
      // Key of the hour selector div
      key: 0,
    };
  },
  computed: {
    // Returns if the actions menu should be rendered based on the length of the selectedHours array
    showActionsMenu() {
      return this.selectedHours.length > 0 ? true : false;
    },
  },
  created() {
    // Retriever the opening and closing hours from the state
    this.openingHour = this.$store.getters["agenda/openingHour"];
    this.closingHour = this.$store.getters["agenda/closingHour"];
  },
  methods: {
    // Turns the date input value into a DateTime object and calls the intervalCalculator and the loadAppointments functions
    dateSelected() {
      this.baseDate = DateTime.fromISO(this.selectedDate);
      this.intervalCalculator();
      this.loadAppointments();
    },
    // Defines what inputs must be rendered based on the opening and closing hours and on a minutes increment
    intervalCalculator() {
      let opening = this.baseDate.plus({ hours: this.openingHour });
      const closing = this.baseDate.plus({ hours: this.closingHour });
      this.agendaHours = [];
      // Push of the starting hour
      this.agendaHours.push({
        dateTime: opening,
        displayTime: opening.toFormat("HH:mm"),
      });
      // Push of hours until closing time
      while (opening < closing) {
        opening = opening.plus({ minutes: 30 }); // This increment defines the amount of appointment slots
        // Won't push the closing time
        if (opening < closing) {
          this.agendaHours.push({
            dateTime: opening, // DateTime object of each appointment slot
            displayTime: opening.toFormat("HH:mm").toString(), // Time string for each appointment slot
          });
        }
      }
    },
    // Retrieves appointments from the API and adds a counter for how many times a slot has been used
    async loadAppointments() {
      this.takenHours = [];
      const payload = {
        year: this.baseDate.year,
        month: this.baseDate.month,
        day: this.baseDate.day,
      };
      this.takenHours = await this.$store.dispatch(
        "agenda/loadAppointments",
        payload
      );
      // Adds a counter of how many times an slot has been used
      // * For each array of the proxy object 'this.agendaHours'
      for (let i of Object.values(this.agendaHours)) {
        // * displayTimeCheck equals the value of the second key (displayTime = [1])
        let displayTimeCheck = Object.values(i)[1];
        // * for value in takenHours array
        for (let x of this.takenHours) {
          // * check if the displayTime is checked
          if (displayTimeCheck.includes(x)) {
            // * if taken key does not exist, creats with the 1 value, else increments
            typeof i["taken"] === "undefined" ? (i["taken"] = 1) : i["taken"]++;
          }
        }
      }
    },
    // Defines the conditional formatting based on the ammount of appointments per slot
    takenFormat(takenValue) {
      if (takenValue === undefined) {
        return "text-green-600 border-green-400 bg-green-100";
      } else if (takenValue === 1) {
        return "text-yellow-600 border-yellow-400 bg-yellow-100";
      } else if (takenValue >= 2) {
        return "text-red-600 border-red-300 bg-red-100";
      }
    },
    // Adds a new appointment, reloads all data and refreshes the rendering
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
    // Determines what action must be taken depending on the value of the button that was clicked
    // * Called trough an emit from the ActionsMenu component
    agendaAction(agendaAction) {
      // If the array exists (selectedHours will be a function before any value is emitted by AgendaMenu) and is not empty
      if (Array.isArray(this.selectedHours) && this.selectedHours.length > 0) {
        if (agendaAction === "add") {
          this.addAppointment();
        } else if (agendaAction === "delete") {
          this.deleteAppointment();
        }
      }
    },
    // TODO
    deleteAppointment() {},
    // Used to force the update of the hour selector div
    updateHourSelector() {
      this.key++;
    },
  },
  components: { ActionsMenu },
};
// TODO: user must come from elsewhere
// TODO: opening and closing hours may be defined on a daily basis (weekends and holydays)
// TODO: incorporate the css inside the style tag onto tailwind
// TODO: clear inputs after action and force the rerendering
// TODO: possibility to mark hours as disabled => special items must be on a secondary menu accessible trough a button
// TODO: change the date input format to dd/mm/yyyy
// TODO: popup with information about hour's current bookings
</script>

<style>
input[type="checkbox"]:checked ~ div {
  background-color: rgb(191, 217, 257);
  color: rgb(30, 64, 175);
}
</style>
