<template>
  <div
    @click="close"
    class="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-75"
  ></div>
  <dialog open class="fixed flex flex-col items-center justify-center top-1/4">
    <slot></slot>
    <button
      @click="close"
      class="px-4 py-1 mt-10 mb-3 text-lg text-indigo-200 bg-indigo-600 border border-indigo-300  w-min"
    >
      Fechar
    </button>
  </dialog>
</template>
<script>
export default {
  methods: {
    close() {
      if (this.fixed) {
        return;
      }
      this.$emit("close");
    },
  },
  props: ["show"],
  emits: ["close"],
};
// TODO: Fix the positioning of the dialog
</script>
