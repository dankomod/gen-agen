<template>
  <div>
    <!-- new-appointment needs to be inside a pop-up -->
    <new-appointment></new-appointment>
  </div>
</template>

<script>
import NewAppointment from "../../components/schedule/NewAppointment.vue";
export default {
  components: {
    NewAppointment,
  },
};
</script>
