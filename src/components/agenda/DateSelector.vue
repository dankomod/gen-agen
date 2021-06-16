<template>
  <div>
    <label for="date-selector">Escolha uma data</label>
    <input
      type="date"
      name="date-selector"
      id="date-selector"
      class="bg-gray-300 w-min"
      v-model="selectedDate"
      @change="selection"
    />
  </div>
</template>
<script>
export default {
  methods: {
    selection() {
      // Dispatches this.selectedDate as a DateTime object
      this.$store.dispatch(
        "agenda/setSelectedDate",
        DateTime.fromISO(this.selectedDate)
      );
      this.$emit("dateSelected");
    },
  },
  data() {
    return { selectedDate: "" };
  },
  emits: ["dateSelected"],
};
import { DateTime } from "luxon";
</script>
