<template>
  <div class="flex flex-col items-center justify-center space-y-10">
    <!-- Date Input -->
    <date-selector
      v-if="!showSlotDetail"
      @dateSelected="toggleTimeSlots"
    ></date-selector>

    <!-- Time Slots Menu -->
    <time-slots
      v-if="showTimeSlots && !showSlotDetail"
      :key="componentsKey"
      @slotSelected="toggleInfoSection"
    ></time-slots>

    <!-- Slot Details Menu -->
    <slot-detail
      v-if="showSlotDetail"
      :key="componentsKey"
      @update="toggleSlotDetail(false), updateRendering"
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
      showInfoSection: false,
      showTimeSlots: false,
      componentsKey: 0,
      showSlotDetail: false,
    };
  },
  methods: {
    toggleSlotDetail(value) {
      this.showSlotDetail = value ? value : !this.showSlotDetail;
    },
    toggleInfoSection(value = true) {
      this.showInfoSection = value;
    },
    toggleTimeSlots(value = true) {
      // Forced re-rendering when a new date is selected
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
import SlotDetail from "./../../components/agenda/SlotDetail.vue";
// TODO: Incorporate the style tag's CSS onto Tailwind
// TODO: make a root page for root router
// ? Admin Dashboard
// ? disabled hours and days
// ? Specific opening and closing hours (weekends and holydays)
// ? custom closing and opening hours
</script>
