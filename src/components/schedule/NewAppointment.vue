<template>
  <form @submit.prevent="selectDate" class="flex flex-col items-center pb-10">
    <div class="flex flex-col pb-5">
      <h1>Horários</h1>
      <schedule-day @new-appointment="newAppointment"></schedule-day>
      <label for="obs">Observações</label>
      <textarea
        class="border border-gray-500"
        name="obs"
        id="obs"
        rows="3"
        cols="25"
        v-model="obs"
      ></textarea>
    </div>
    <div class="flex flex-col w-full">
      <button type="submit" class="p-2 text-white bg-gray-700">
        Selecionar
      </button>
    </div>
  </form>
</template>

<script>
import { DateTime } from "luxon";
import ScheduleDay from "../../components/schedule/ScheduleDay.vue";
export default {
  data() {
    return {
      obs: "",
    };
  },
  created() {
    // TODO: must receive start and end from config file
    this.setDate();
  },
  methods: {
    // TODO: must receive start and end from config file
    setDate() {
      const start = DateTime.local(2021, 5, 31, 8, 0).toISO();
      const end = DateTime.local(2021, 5, 31, 17, 0).toISO();
      // console.log("setDate Start");
      // console.log(start);
      // console.log("setDate End");
      // console.log(end);
      this.$store.dispatch("schedule/setStart", start);
      this.$store.dispatch("schedule/setEnd", end);
    },
    // TODO: must be made by NewAppointment
    // Prepares the payload and dispatches it
    async newAppointment(timeSelected) {
      const activeUser = this.$store.getters["auth/activeUser"];
      // TODO: timeSelected.timeSelected should be fixed
      const recomposedDate = timeSelected.timeSelected;
      const date = {
        year: recomposedDate.year,
        month: recomposedDate.month,
        day: recomposedDate.day,
        hour: recomposedDate.hour,
        minute: recomposedDate.minute === 0 ? "00" : recomposedDate.minute, // formats 0 into '00'
      };
      // console.log("date");
      // console.log(date);
      const payload = {
        user: activeUser,
        date: date,
      };
      // console.log("payload");
      // console.log(payload);
      this.$store.dispatch("schedule/newAppointment", payload);
      // error catching
      // TODO: Hi
      // await this.loadAppointments(date);
    },
  },
  components: {
    ScheduleDay,
  },
};
</script>
