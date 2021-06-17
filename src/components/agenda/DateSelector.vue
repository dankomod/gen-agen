<template>
  <div>
    <label for="date-selector">Escolha uma data</label>
    <input
      id="date-selector"
      v-model="selectedDate"
      type="date"
      name="date-selector"
      class="bg-gray-300 w-min"
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
      // Dispatches this.selectedDate as a DateTime object
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
