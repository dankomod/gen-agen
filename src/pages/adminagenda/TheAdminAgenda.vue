<template>
  <agenda-menu @selectedHours="selectedHours"></agenda-menu>
  <actions-menu @agendaAction="agendaAction"></actions-menu>
</template>

<script>
import ActionsMenu from "../../components/agenda/ActionsMenu.vue";
import AgendaMenu from "../../components/agenda/AgendaMenu.vue";
export default {
  data() {
    return {};
  },
  components: { AgendaMenu, ActionsMenu },
  methods: {
    selectedHours(selectedHours) {
      this.selectedHours = selectedHours;
    },
    agendaAction(agendaAction) {
      // If the array exists (selectedHours will be a function before any value is emitted by AgendaMenu) and is not empty
      if (Array.isArray(this.selectedHours) && this.selectedHours.length > 0) {
        if (agendaAction === "add") {
          this.addAppointment();
        } else if (agendaAction === "delete") {
          this.deleteAppointment();
        }
      }
    },
    async addAppointment() {
      let payload = {
        user: "h1", //TODO: must come from elsewhere
        date: "", //TODO: must come from elsewhere
      };
      for (const selectedHour of this.selectedHours) {
        payload.date = selectedHour;
        await this.$store.dispatch("agenda/newAppointment", payload);
      }
    },
    // TODO
    deleteAppointment() {
      console.log("delete");
      console.log(this.selectedHours);
    },
  },
};
</script>
