<template>
  <span class="space-x-2">
    <base-button :button-type="'success'" @click="$emit('yes')">
      Confirmar
    </base-button>
    <base-button :button-type="'danger'" @click="$emit('no')">
      Cancelar
    </base-button>
  </span>
</template>

<script>
// * Having two props facilitates calling multiple functions with arguments
export default {
  emits: ["yes", "no"],
};
</script>
