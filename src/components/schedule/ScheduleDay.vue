<template>
  <div class="flex justify-center">
    <nav>
      <ul class="p-0 ml-24 list-none donate-now">
        <li
          class="relative float-left w-24 h-10 m-1"
          v-for="time in result"
          :key="time.timeISO"
        >
          <input
            :disabled="takenHourCheck(time.timeString)"
            class="absolute top-0 bottom-0 left-0 right-0 z-50 block  opacity-5 checked:bg-yellow-300"
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
      <button
        type="submit"
        class="p-2 text-white bg-gray-700"
        @click="newAppointment(timeSelected)"
      >
        Submit
      </button>
    </nav>
  </div>
</template>

<script>
// TODO: special style must be incoporated in tailwind's custom rules
// TODO: must receive: taken hours
// // TODO: must send: selected time, time in ISO
import { DateTime } from "luxon";
export default {
  // Emits the selected hour to NewAppointment
  emits: ["newAppointment"],
  data() {
    return {
      result: [],
      start: "",
      end: "",
      minutes: "",
      date: DateTime.local(2021, 5, 31),
      takenHours: [],
      timeSelected: "",
    };
  },
  computed: {},
  created() {
    this.getStart();
    this.getEnd();
    this.intervalCalc();
    this.loadAppointments(this.date);
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
      const endHour = DateTime.fromISO(this.end);
      this.pushDate(startHour);
      while (startHour < endHour) {
        // TODO: change increment to 15 minutes or less
        startHour = startHour.plus({ minutes: 30 });
        this.pushDate(startHour);
      }
    },
    // Receives the calculated intervals, changes 0 minutes into '00', and pushes hour:date strings
    // ? Where id date set?
    pushDate(date) {
      date.minute === 0 ? (this.minutes = "00") : (this.minutes = date.minute);
      const timeString = `${date.hour}:${this.minutes}`;
      this.result.push({ timeString: timeString, timeISO: date });
    },
    // Emits a call for a new appointment that will be treated by NewAppointment
    newAppointment(timeSelected) {
      // console.log(timeSelected);
      this.$emit("newAppointment", { timeSelected });
    },
    // TODO: must be made by NewAppointment
    // Must be called a lot and lot of times
    async loadAppointments(date) {
      const payload = {
        year: date.year,
        month: date.month,
        day: date.day,
      };
      // console.log(payload);
      this.takenHours = await this.$store.dispatch(
        "schedule/loadAppointments",
        payload
      );
      // return (this.takenHours = await response);
      // // console.log(this.takenHours);
    },
    // Checks if the string given is present in the list of another appointments
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
  background: gray;
}
</style>
