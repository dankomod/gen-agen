<template>
  <!-- Background -->
  <div
    class="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-75"
    @click="close"
  ></div>
  <!-- Dialog dox -->
  <dialog
    open
    class="fixed w-5/6 max-w-screen-sm max-h-screen overflow-auto transform -translate-y-1/2  top-1/2"
  >
    <slot></slot>
    <base-button class="mt-10" @click="close">Fechar</base-button>
    <div
      class="absolute top-0 right-0 flex items-center justify-center w-10 h-10 text-white bg-red-500  hover:bg-red-700"
      @click="close"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-8 h-8"
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
    </div>
  </dialog>
</template>
<script>
export default {
  emits: ["close"],
  methods: {
    // Emits a close event if the closing button or the background is clicked
    close() {
      this.$emit("close");
    },
  },
};
</script>
