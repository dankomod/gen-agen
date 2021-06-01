<template>
  <div class="container flex flex-col items-center justify-center">
    <h1>Horários Disponíveis</h1>
    <nav class="flex items-center">
      <ul class="flex flex-wrap justify-center list-none">
        <li
          class="relative float-left w-24 h-10 m-1"
          v-for="time in result"
          :key="time.timeISO"
        >
          <input
            :disabled="takenHourCheck(time.timeString)"
            class="absolute top-0 bottom-0 left-0 right-0 z-50 block w-0 opacity-0  checked:bg-yellow-300"
            type="radio"
            :id="time.timeISO"
            name="thetime"
            :value="time.timeISO"
            v-model="timeSelected"
          />
          <label
            class="absolute top-0 bottom-0 left-0 right-0 z-40 block p-1 border cursor-pointer  checked:bg-yellow-300 hover:bg-yellow-300"
            :for="time.timeISO"
            >{{ time.timeString }}</label
          >
        </li>
      </ul>
    </nav>
    <label for="obs">Observações</label>
    <textarea
      class="mb-2 border border-gray-500"
      name="obs"
      id="obs"
      rows="3"
      cols="25"
      v-model="obs"
    ></textarea>
    <button
      type="submit"
      class="p-2 text-white bg-gray-700 w-min"
      @click="newAppointment(timeSelected)"
    >
      Submit
    </button>
  </div>
</template>

<script>
// TODO: special style must be incoporated in tailwind's custom rules
import { DateTime } from "luxon";
export default {
  // Props received from NewAppointment
  props: ["takenHours", "date"],
  // Emits the selected hour to NewAppointment
  emits: ["newAppointment"],
  data() {
    return {
      result: [],
      start: "",
      end: "",
      obs: "",
      minutes: "",
      timeSelected: "",
    };
  },
  computed: {},
  created() {
    this.getStart();
    this.getEnd();
    this.intervalCalc();
  },
  methods: {
    // Gets the start time from the store
    getStart() {
      this.start = this.$store.getters["schedule/start"];
    },
    // Gets the end time from the store
    getEnd() {
      this.end = this.$store.getters["schedule/end"];
    },
    // Calculates all the 30 minutes intervals in the working hour interval and send them to be pushed
    intervalCalc() {
      let startHour = DateTime.fromISO(this.start);
      const endHour = DateTime.fromISO(this.end).minus(1); // Minus 1ms to avoid rendering the endHour as a valid booking time
      this.pushDate(startHour);
      while (startHour < endHour) {
        // ? maybe change increment to 15 minutes or less
        startHour = startHour.plus({ minutes: 30 });
        // Avoids rendering the endHour as a valid booking time
        if (startHour < endHour) {
          this.pushDate(startHour);
        }
      }
    },
    // Receives the calculated intervals, changes 0 minutes into '00', and pushes hour:date strings
    pushDate(date) {
      date.minute === 0 ? (this.minutes = "00") : (this.minutes = date.minute);
      const timeString = `${date.hour}:${this.minutes}`;
      // ? only render non-taken time?
      this.result.push({ timeString: timeString, timeISO: date });
    },
    // Emits a call for a new appointment that will be treated by NewAppointment
    newAppointment(timeSelected) {
      if (timeSelected !== "") {
        const payloadAppointment = {
          timeSelected: timeSelected,
          obs: this.obs,
        };
        this.$emit("newAppointment", payloadAppointment);
        this.obs = "";
      }
    },
    // Checks if hour to be rendered is contained in the takenHours array
    takenHourCheck(timeString) {
      return this.takenHours.includes(timeString);
    },
  },
};
</script>

<style scoped>
input[type="radio"]:checked + label,
.Checked + label {
  background: rgb(252, 211, 77);
}

input[type="radio"]:disabled + label,
.Checked + label {
  color: gray;
  background: lightgray;
}
</style>
