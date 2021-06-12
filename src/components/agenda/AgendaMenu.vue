<template>
  <div class="container flex flex-col items-center py-10">
    <h1 class="pb-10 text-2xl">Agenda</h1>
    <!-- DATE SELECTOR -->
    <div class="flex items-center pb-5">
      <label for="dateselector" class="pr-2 text-lg">Data (mês/dia/ano):</label>
      <input
        class="p-1 text-xl bg-blue-100 border border-blue-400"
        type="date"
        name="dateselector"
        id="dateselector"
        v-model="selectedDate"
        @change="dateSelected"
      />
    </div>
    <div :key="id">
      <!-- APPOINTMENT SLOTS MENU -->
      <slots-menu v-if="showSlotsMenu"></slots-menu>
      <!-- INFO MENU -->
      <info-menu v-if="showInfoMenu"></info-menu>
      <!-- ACTIONS MENU -->
      <actions-menu
        @updateRendering="updateRendering"
        v-if="showActionsMenu"
      ></actions-menu>
    </div>
  </div>
</template>

<script>
import { DateTime } from "luxon";
import InfoMenu from "./InfoMenu.vue";
import SlotsMenu from "./SlotsMenu.vue";
import ActionsMenu from "./ActionsMenu.vue";
export default {
  data() {
    return {
      // Show slots menu
      showSlotsMenu: false,
      // Show info menu
      showInfoMenu: false,
      // Show actions menu
      showActionsMenu: false,
      // Opening hour retrieved from the State
      openingHour: "",
      // Closing hour retrieved from the State
      closingHour: "",
      // The selected date
      selectedDate: false,
      // A DateTime object of selected date
      baseDate: null,
      id: 0,
      takenSlots: [],
    };
  },
  created() {
    // Retriever the opening and closing hours from the state
    this.openingHour = this.$store.getters["agenda/openingHour"];
    this.closingHour = this.$store.getters["agenda/closingHour"];
    // Watches the getter and shows the infoMenu if the selectedHours array has any length
    this.$store.watch(
      () => {
        return this.$store.getters["agenda/selectedHours"]; // Will call the handler everytime this getter returns a *different* result
      },
      (newValue) => {
        this.showInfoMenu = newValue.length ? true : false;
        this.showActionsMenu = true;
      }
    );
    // Checks the appointmentInfo deeply and show the actions and enables the actions menu
    this.$store.watch(
      () => {
        return this.$store.getters["agenda/appointmentInfo"]; // Will call the handler everytime this getter returns a *different* result
      },
      () => {
        this.showActionsMenu = true;
      },
      { deep: true } // Deep is used to watch the values inside the object
    );
  },
  methods: {
    updateRendering() {
      this.$store.dispatch("agenda/setSelectedHours", []);
      this.intervalCalculator();
      this.id++;
    },
    // Turns the date input value into a DateTime object and calls the intervalCalculator and the loadAppointments functions
    dateSelected() {
      this.baseDate = DateTime.fromISO(this.selectedDate);
      this.$store.dispatch("agenda/setBaseDate", this.baseDate);
      this.intervalCalculator();
    },
    // Defines what inputs must be rendered based on the opening and closing hours and on a minutes increment
    async intervalCalculator() {
      let opening = this.baseDate.plus({ hours: this.openingHour });
      const closing = this.baseDate.plus({ hours: this.closingHour });
      // TODO: Send DateTime and decompose it in the action
      // The payload that contains the data that will be used from the API
      const payload = {
        year: this.baseDate.year,
        month: this.baseDate.month,
        day: this.baseDate.day,
      };
      // Creates an array and receives the appointments from the API
      try {
        this.takenSlots = await this.$store.dispatch(
          "agenda/loadAppointments",
          payload
        );
      } catch (error) {
        // TODO: Popup error? => this.error + computed
        console.log(error || "Algo deu errado.");
      }
      const agendaHours = [];
      // TODO: Include the push of the first slot in the loop
      // Push of the starting hour
      agendaHours.push({
        dateTime: opening,
        displayTime: opening.toFormat("HH:mm"),
        takenCount: this.takenSlots.filter((v) => v === opening).length,
      });
      // Push of hours until closing time
      while (opening < closing) {
        opening = opening.plus({ minutes: 30 }); // This increment defines the amount of appointment slots
        // Won't push the closing time
        if (opening < closing) {
          const displayTime = opening.toFormat("HH:mm").toString(); // Time string for each appointment slot
          agendaHours.push({
            dateTime: opening, // DateTime object of each appointment slot
            displayTime: displayTime,
            takenCount: this.takenSlots.filter((v) => v === displayTime).length, // Checks if and calculates how many times displayTime is in the takenSlots array
          });
        }
      }
      this.$store.dispatch("agenda/setAgendaHours", agendaHours);
      this.baseDateChild = this.baseDate;
      this.showSlotsMenu = true;
    },
  },
  components: { InfoMenu, SlotsMenu, ActionsMenu },
};
// TODO: Users
// TODO: Incorporate the style tag's CSS onto Tailwind
// TODO: change the HTML date input format to dd/mm/yyyy
// TODO: make a root page for root router

// ? Admin Dashboard
// ? disabled hours and days
// ? Specific opening and closing hours (weekends and holydays)
// ? custom closing and opening hours
</script>
