<template>
  <div>
    <!-- new-appointment needs to be inside a pop-up -->
    <new-appointment></new-appointment>
  </div>
</template>

<script>
import { DateTime } from "luxon";
import NewAppointment from "../../components/schedule/NewAppointment.vue";
export default {
  components: {
    NewAppointment,
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
      this.$store.dispatch("schedule/setStart", start);
      this.$store.dispatch("schedule/setEnd", end);
    },
  },
};

// ! Specific routes for each week/day?
// ! week view
</script>
