<template>
  <div class="flex flex-row items-center justify-center">
    <label for="date-selector" class="mr-3">Escolha uma data</label>
    <input
      id="date-selector"
      v-model="selectedDate"
      type="date"
      name="date-selector"
      class="p-2 bg-indigo-100 w-min"
      @change="selection"
    />
  </div>
</template>
<script>
export default {
  emits: ["dateSelected"],
  data() {
    return { selectedDate: "" };
  },
  methods: {
    selection() {
      // Dispatches this.selectedDate as a DateTime object to the State
      this.$store.dispatch(
        "agenda/setSelectedDate",
        DateTime.fromISO(this.selectedDate)
      );
      this.$emit("dateSelected");
    },
  },
};
import { DateTime } from "luxon";
</script>
