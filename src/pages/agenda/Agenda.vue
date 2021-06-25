<template>
  <div class="flex flex-col items-center justify-center space-y-10">
    <!-- Date Input -->
    <date-selector @dateSelected="toggleTimeSlots"></date-selector>
    <!-- Time Slots Menu -->
    <time-slots
      v-if="showTimeSlots"
      :key="componentsKey"
      @slotSelected="toggleInfoSection"
    ></time-slots>
    <!-- Slot Details Menu -->
    <slot-detail
      v-if="showSlotDetail"
      :key="componentsKey"
      @update="toggleSlotDetail"
    ></slot-detail>
    <info-section
      v-if="showInfoSection"
      :key="componentsKey"
      @newAppointment="updateRendering"
      @toggleSlotDetail="toggleSlotDetail"
    ></info-section>
  </div>
</template>

<script>
export default {
  components: { DateSelector, InfoSection, SlotDetail, TimeSlots },
  data() {
    return {
      componentsKey: 0,
      showTimeSlots: false,
      showSlotDetail: false,
      showInfoSection: false,
    };
  },
  methods: {
    toggleTimeSlots(value = true) {
      // Forced re-rendering when a new date is selected
      this.updateRendering();
      this.showTimeSlots = value;
      this.showSlotDetail = false;
      // Makes sure that the InfoSection is hidden after a re-rendering
      this.toggleInfoSection(false);
    },

    toggleSlotDetail() {
      this.showSlotDetail = !this.showSlotDetail;
      this.showTimeSlots = !this.showTimeSlots;
    },

    toggleInfoSection(value = true) {
      this.showInfoSection = value;
    },

    updateRendering() {
      this.componentsKey++;
    },
  },
};
import DateSelector from "./../../components/agenda/DateSelector.vue";
import InfoSection from "./../../components/agenda/InfoSection.vue";
import TimeSlots from "./../../components/agenda/TimeSlots.vue";
import SlotDetail from "./../../components/agenda/SlotDetail.vue";
// TODO: Incorporate the style tag's CSS onto Tailwind
// TODO: make a root page for root router
// ? Admin Dashboard
// ? disabled hours and days
// ? Specific opening and closing hours (weekends and holydays)
// ? custom closing and opening hours
</script>
