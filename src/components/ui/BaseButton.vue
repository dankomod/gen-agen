<template>
  <button
    :class="setButtonStyle"
    class="px-3 py-1 text-lg font-medium w-min whitespace-nowrap"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  computed: {
    // Returns specific styling acording to the buttonTrype or a default styling
    setButtonStyle() {
      switch (this.buttonType) {
        case "success":
          return "bg-green-600 text-white";
        case "warning":
          return "bg-yellow-400 text-black";
        case "danger":
          return "bg-red-600 text-white";
        default:
          return "bg-indigo-600 text-white";
      }
    },
  },
  props: ["buttonType"],
};
</script>
