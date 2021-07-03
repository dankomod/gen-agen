<template>
  <div class="flex flex-wrap items-center justify-center">
    <!-- Turns checkboxes into selectable boxes: <article> contains the base style, <input> makes the box selectable and stylable as such, <div> is shown whether the input is selected or not, and <span> contains the text -->
    <article
      v-for="timeSlot in timeSlots"
      :key="timeSlot.dateTime"
      class="relative float-left w-24 h-24 m-1 overflow-hidden text-2xl font-medium tracking-wide text-white border "
      :class="takenFormat(timeSlot.appointments)"
    >
      <input
        v-model="selectedSlots"
        :value="timeSlot.dateTime"
        type="checkbox"
        class="absolute top-0 left-0 w-24 h-24 bg-indigo-900 opacity-0 cursor-pointer "
      />
      <div
        class="flex items-center justify-center w-full h-full transition duration-100 ease-linear "
      >
        <span>{{ timeSlot.dateTime.toFormat("HH:mm") }}</span>
      </div>
    </article>
  </div>
</template>

<script>
export default {
  emits: ["slotSelected"],
  data() {
    return {
      closingHour: "",
      openingHour: "",
      selectedSlots: [],
      timeSlots: [],
    };
  },
  watch: {
    // If the ammount of selected slots change
    selectedSlots(newValue) {
      // Updates the API with the currently selected slots
      this.$store.dispatch("agenda/setSelectedSlots", newValue);
      // emits slotSelected with a value that will be used by Clients components to determine the visibility of InfoSection
      let value = newValue.length > 0 ? true : false;
      this.$emit("slotSelected", value);
    },
  },
  async created() {
    const response = await this.$store.dispatch("agenda/loadAppointments");
    if (response && "alertMessage" in response) {
      this.$store.dispatch("setAlertData", response);
    } else {
      this.intervalCalculator();
    }
  },
  methods: {
    async intervalCalculator() {
      const takenHours = this.$store.getters["agenda/takenHours"];
      // Retrieves the selected date by the user and the opening and closing hours from the State
      const selectedDate = this.$store.getters["agenda/selectedDate"];
      let opening = selectedDate.plus({
        hours: this.$store.getters["configs/openingHour"],
      });
      const closing = selectedDate.plus({
        hours: this.$store.getters["configs/closingHour"],
      });
      // Pushes the opening hour into this.timeSlots, the array that contains all the slots to be rendered
      // TODO: Put this inside the loop
      this.timeSlots.push({
        dateTime: opening,
        // calculates how many times a slot has been taken
        appointments: takenHours.filter((v) => v == opening.toString()).length,
      });
      while (opening < closing) {
        opening = opening.plus({ minutes: 30 }); // Time increment
        // Won't push the closing time
        if (opening < closing) {
          this.timeSlots.push({
            dateTime: opening,
            appointments: takenHours.filter((v) => v == opening.toString())
              .length,
          });
        }
      }
    },
    // Conditional format based on the ammount of appointments on the slot
    takenFormat(appointments) {
      if (appointments === 0 || appointments === undefined) {
        return "bg-green-900";
      } else if (appointments === 1) {
        return "bg-orange-900";
      } else if (appointments >= 2) {
        return "bg-red-900";
      }
    },
  },
};
// eslint-disable-next-line
import { DateTime } from "luxon";
</script>

<style scoped>
input[type="checkbox"]:checked ~ div {
  background-color: rgb(26, 35, 126);
}
</style>
