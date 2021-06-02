<template>
  <div>
    <h1>TheSchedule</h1>
    <!-- new-appointment needs to be inside a pop-up -->
    <new-appointment></new-appointment>
  </div>
</template>

<script>
// import { DateTime } from "luxon";
import NewAppointment from "../../components/schedule/NewAppointment.vue";
export default {
  components: {
    NewAppointment,
  },
};
// ? Specific routes for each week/day?
// ? week view
</script>
