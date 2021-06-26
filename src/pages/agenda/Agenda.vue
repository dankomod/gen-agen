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
      @update="toggleSlotDetail(), toggleInfoSection(false)"
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
    toggleInfoSection(value = true) {
      this.showInfoSection = value;
    },
    updateRendering() {
      // Hides the info section so it will have fresh values when rendered again
      this.toggleInfoSection(false);
      this.componentsKey++;
    },
    toggleSlotDetail() {
      this.showSlotDetail = !this.showSlotDetail;
      this.showTimeSlots = !this.showTimeSlots;
    },
    toggleTimeSlots(value = true) {
      this.showTimeSlots = value;
      this.showSlotDetail = false;
      // Makes sure that the InfoSection is hidden after a re-rendering
      this.toggleInfoSection(false);
      // Forced re-rendering when a new date is selected
      this.updateRendering();
    },
  },
};
import DateSelector from "./../../components/agenda/DateSelector.vue";
import InfoSection from "./../../components/agenda/InfoSection.vue";
import SlotDetail from "./../../components/agenda/SlotDetail.vue";
import TimeSlots from "./../../components/agenda/TimeSlots.vue";
// TODO: Incorporate the style tag's CSS onto Tailwind
// ? Specific opening and closing hours (weekends and holydays)
</script>
