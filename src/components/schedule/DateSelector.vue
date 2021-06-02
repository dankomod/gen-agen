<template>
  <h1>DateSelector</h1>
  <input
    type="date"
    class="w-min"
    v-model="selectedDate"
    @change="updateDate"
  />
</template>

<script>
export default {
  props: ["dateISO"],
  emits: ["update-date"],
  data() {
    return {
      selectedDate: null,
    };
  },
  created() {
    this.selectedDate = this.dateISO;
  },
  methods: {
    updateDate() {
      this.$emit("update-date", this.selectedDate);
    },
  },
};
</script>
