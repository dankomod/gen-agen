<template>
  <div class="flex flex-wrap justify-center text-lg text-white">
    <button
      class="w-32 py-3 m-1 font-medium tracking-wide bg-green-700"
      @click="agendaAction('add')"
    >
      Adicionar
    </button>
    <button
      class="w-32 py-3 m-1 font-medium tracking-wide bg-red-600"
      @click="agendaAction('delete')"
    >
      Remover
    </button>
  </div>
</template>

<script>
export default {
  emits: ["agendaAction"], // emitted values: 'add', 'remove'
  methods: {
    agendaAction(action) {
      this.$emit("agendaAction", action);
    },
  },
};
// TODO: Show add button if no selection of taken time, hide others
// TODO: Show edit and remove button if selection of taken time, hide add
// TODO: Block buttons if free and taken times are selected
</script>
