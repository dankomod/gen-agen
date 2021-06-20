<template>
  <div class="flex flex-col items-center justify-center space-y-10">
    <date-selector @dateSelected="toggleTimeSlots"></date-selector>
    <time-slots
      v-if="showTimeSlots"
      :key="componentsKey"
      @slotSelected="toggleInfoSection"
    ></time-slots>
    <info-section
      v-if="showInfoSection"
      :key="componentsKey"
      @newAppointment="updateRendering"
    ></info-section>
  </div>
</template>

<script>
export default {
  components: { DateSelector, InfoSection, TimeSlots },
  data() {
    return { showInfoSection: false, showTimeSlots: false, componentsKey: 0 };
  },
  methods: {
    toggleInfoSection(value = true) {
      this.showInfoSection = value;
    },
    toggleTimeSlots(value = true) {
      // Forced re-rendering of the components when a new date is selected
      this.updateRendering();
      this.showTimeSlots = value;
      // Makes sure that the InfoSection is hidden after a re-rendering
      this.toggleInfoSection(false);
    },
    updateRendering() {
      this.componentsKey++;
    },
  },
};
import DateSelector from "./../../components/agenda/DateSelector.vue";
import InfoSection from "./../../components/agenda/InfoSection.vue";
import TimeSlots from "./../../components/agenda/TimeSlots.vue";
// TODO: Incorporate the style tag's CSS onto Tailwind
// TODO: make a root page for root router
// ? Admin Dashboard
// ? disabled hours and days
// ? Specific opening and closing hours (weekends and holydays)
// ? custom closing and opening hours
</script>
