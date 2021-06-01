<template>
  <div class="flex flex-col pb-5">
    <schedule-day
      @new-appointment="newAppointment"
      :taken-hours="takenHours"
      :date="date"
      :key="key"
    ></schedule-day>
  </div>
</template>

<script>
import { DateTime } from "luxon";
import ScheduleDay from "../../components/schedule/ScheduleDay.vue";
export default {
  data() {
    return {
      date: DateTime.local(2021, 5, 31),
      takenHours: [],
      key: 0,
    };
  },
  created() {
    this.loadAppointments(this.date);
  },
  watch: {
    takenHours(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.key = this.key + 1;
      }
    },
  },
  methods: {
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
      // error catching
      this.loadAppointments(date);
    },
    // Must be called a lot and lot of times
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
    updateKey() {
      this.key = this.key + 1;
    },
  },
  components: {
    ScheduleDay,
  },
};
</script>
