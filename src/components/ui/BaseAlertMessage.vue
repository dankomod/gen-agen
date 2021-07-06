<template>
  <div
    class="fixed z-50 flex flex-row items-center justify-center p-4 font-medium border-l-8  w-60 right-3 bottom-3"
    :class="setAlertStyle"
  >
    <div class="flex flex-row items-center justify-between">
      <p><slot></slot></p>
      <button v-if="showCloseButton" class="ml-6" @click="closeAlert()">
        <svg
          class="w-6 h-6 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    alertTimer: { type: Number, default: null },
    alertType: { type: String, default: "" },
  },
  emits: ["closeAlert"],
  data() {
    return { localAlertTimer: null, showCloseButton: true };
  },
  computed: {
    // Returns specific styling acording to the alertType
    setAlertStyle() {
      switch (this.alertType) {
        case "success":
          return "bg-green-700 border-green-900 text-white ";
        case "warning":
          return "bg-yellow-600 border-yellow-900 text-black ";
        case "danger":
          return "bg-red-600 border-red-900 text-white";
        case "info":
          return "bg-blue-600 border-blue-900 text-white";
        default:
          return "bg-indigo-600 border-indigo-900 text-white";
      }
    },
  },
  created() {
    this.setTimer();
  },
  // Updates when a new alert is emmited while another one was being shown
  beforeUpdate() {
    this.setTimer();
  },
  methods: {
    closeAlert() {
      this.$emit("closeAlert");
    },
    setTimer() {
      if (this.alertType === "success" && !this.alertTimer) {
        this.localAlertTimer = 4;
      } else {
        this.localAlertTimer = this.alertTimer;
      }
      if (this.localAlertTimer) {
        this.showCloseButton = false;
        setTimeout(() => this.closeAlert(), this.localAlertTimer * 1000);
      }
    },
  },
};
</script>
