<template>
  <div :class="setAlertStyle">
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: { dialogType: { type: String, default: "" } },
  data() {
    return { alertClass: "" };
  },
  computed: {
    setAlertStyle() {
      if (this.dialogType === "danger") {
        return "px-2 py-1 border bg-red-50 text-red-700-accent";
      }
      return null;
    },
  },
};
</script>
