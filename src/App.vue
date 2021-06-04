<template>
  <section class="flex flex-col px-5">
    <!-- <router-view></router-view> -->
    <the-admin-agenda></the-admin-agenda>
  </section>
</template>

<script>
import TheAdminAgenda from "./pages/adminagenda/TheAdminAgenda.vue";
export default {
  components: {
    TheAdminAgenda,
  },
};
</script>
