<template>
  <date-selector @dateSelected="toggleTimeSlots"></date-selector>
  <time-slots
    v-if="showTimeSlots"
    @slotSelected="toggleInfoSection"
  ></time-slots>
  <info-section v-if="showInfoSection"></info-section>
</template>

<script>
export default {
  methods: {
    toggleInfoSection(value = true) {
      this.showInfoSection = value;
    },
    toggleTimeSlots(value = true) {
      this.showTimeSlots = value;
    },
  },
  data() {
    return { showInfoSection: false, showTimeSlots: false };
  },
  components: { DateSelector, InfoSection, TimeSlots },
};
// import { DateTime } from "luxon";
import DateSelector from "./../../components/agenda/DateSelector.vue";
import InfoSection from "./../../components/agenda/InfoSection.vue";
import TimeSlots from "./../../components/agenda/TimeSlots.vue";

// TODO: Incorporate the style tag's CSS onto Tailwind
// TODO: change the HTML date input format to dd/mm/yyyy
// TODO: make a root page for root router

// ? Admin Dashboard
// ? disabled hours and days
// ? Specific opening and closing hours (weekends and holydays)
// ? custom closing and opening hours
</script>
