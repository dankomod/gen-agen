<template>
  <h1>NewAppointment</h1>
  <div class="flex flex-col pb-5">
    <date-selector :dateISO="dateISO" @update-date="updateDate"></date-selector>
    <schedule-day
      @new-appointment="newAppointment"
      :taken-hours="takenHours"
      :key="key"
    ></schedule-day>
  </div>
</template>

<script>
import { DateTime } from "luxon";
import ScheduleDay from "../../components/schedule/ScheduleDay.vue";
import DateSelector from "../../components/schedule/DateSelector.vue";
export default {
  data() {
    return {
      // TODO: make names consistent
      date: "",
      dateISO: "",
      takenHours: [],
      key: 0,
      // TODO: put the opening and closing hours in the state()
      openingHour: 8,
      closingHour: 17,
    };
  },
  created() {
    this.setDate();
    this.getBaseDate();
    this.loadAppointments(this.date);
  },
  watch: {
    takenHours(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.updateKey();
      }
    },
  },
  methods: {
    // TODO: track date formats and check if all the conversions are needed
    // TODO: updateDate is too similar to created()
    updateDate(data) {
      const dataD = DateTime.fromISO(data);
      this.setDate(dataD);
      this.getBaseDate();
      this.loadAppointments(this.date);
    },
    setDate(dateToSet = null) {
      let baseDate = ""; // TODO: remove = and see what happens
      dateToSet
        ? (baseDate = dateToSet)
        : (baseDate = DateTime.local(2021, 6, 1)); // TODO: Use .now() and strip what's not needed
      this.dateISO = DateTime.fromISO(baseDate).toFormat("yyyy-MM-dd"); // Date format needed in the date input of date-selector
      this.$store.dispatch("schedule/setBaseDate", baseDate);
      const start = baseDate.plus({ hours: this.openingHour }).toISO();
      this.$store.dispatch("schedule/setStart", start);
      const end = baseDate.plus({ hours: this.closingHour }).toISO();
      this.$store.dispatch("schedule/setEnd", end);
    },
    // Updates the base date
    getBaseDate() {
      const baseD = this.$store.getters["schedule/baseDate"];
      this.date = baseD;
    },
    // Prepares the payload and dispatches it
    async newAppointment(payloadAppointment) {
      const activeUser = this.$store.getters["auth/activeUser"];
      // TODO: must check if user already has appointments for that day
      const recomposedDate = payloadAppointment.timeSelected;
      const obs = payloadAppointment.obs;
      const date = {
        year: recomposedDate.year,
        month: recomposedDate.month,
        day: recomposedDate.day,
        hour: recomposedDate.hour,
        minute: recomposedDate.minute === 0 ? "00" : recomposedDate.minute, // formats 0 into '00'
      };
      const payload = {
        user: activeUser,
        date: date,
        obs: obs || "",
      };
      await this.$store.dispatch("schedule/newAppointment", payload);
      console.log("Resposta dispatch");
      // TODO: error catching
      this.loadAppointments(date);
    },
    async loadAppointments(date) {
      const payload = {
        year: date.year,
        month: date.month,
        day: date.day,
      };
      this.takenHours = await this.$store.dispatch(
        "schedule/loadAppointments",
        payload
      );
    },
    // * Changing the key of the component forces its re-rendering
    updateKey() {
      this.key += 1;
    },
  },
  components: {
    ScheduleDay,
    DateSelector,
  },
};
</script>
