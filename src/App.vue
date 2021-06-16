<template>
  <section class="flex flex-col px-5">
    <!-- <router-view></router-view> -->
    <agenda></agenda>
    <!-- <clients></clients> -->
  </section>
</template>

<script>
import Agenda from "./pages/agenda/Agenda.vue";
// import Clients from "./pages/clients/Clients.vue";
export default {
  components: {
    Agenda,
    // Clients,
  },
};
</script>

<style src="./assets/css/style.css"></style>
