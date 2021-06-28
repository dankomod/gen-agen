<template>
  <div class="flex flex-row items-center">
    <!-- Default Label -->
    <label :for="elementLabel" class="w-36"> {{ elementLabel }} </label>
    <!-- Input type="text" -->
    <input
      v-if="elementType === 'inputText'"
      :id="uid(elementLabel)"
      :value="elementValue"
      class="w-full px-3 py-2 bg-white border border-indigo-400  disabled:border-0"
      :disabled="!elementEnabled"
      type="text"
    />
    <!-- Input type="number" -->
    <input
      v-if="elementType === 'inputNumber'"
      :id="uid(elementLabel)"
      :value="elementValue"
      class="w-full px-3 py-2 bg-white border border-indigo-400  disabled:border-0"
      :disabled="!elementEnabled"
      type="number"
    />
    <!-- Input type='checkbox' -->
    <!-- //! requires a @change listener that gets the value from $event.target.checked -->
    <!-- //! has a checked attribute instead of value -->
    <!-- //! !! returns a truthy/falsey value -->
    <input
      v-if="elementType === 'checkbox'"
      :id="uid(elementLabel)"
      :checked="elementValue"
      class="w-6 h-6 px-3 py-2 bg-white border border-indigo-400  disabled:border-0"
      :disabled="!elementEnabled"
      type="checkbox"
    />
    <!-- Textarea -->
    <textarea
      v-if="elementType === 'textarea'"
      :id="uid(elementLabel)"
      :value="elementValue"
      class="w-full px-3 py-2 bg-white border border-indigo-400  disabled:border-0"
      :disabled="!elementEnabled"
    ></textarea>
    <!-- Select that takes and options array as prop -->
    <select
      v-if="elementType === 'select'"
      :id="uid(elementLabel)"
      :value="elementValue"
      class="w-full px-3 py-2 bg-white border border-indigo-400  disabled:border-0"
      :disabled="!elementEnabled"
    >
      <option v-for="option of optionValueArray" :key="option" :value="option">
        {{ option }}
      </option>
    </select>
  </div>
</template>

<script>
// * I can't use v-model here because it is sent to the div parent and conflicts with the :value prop. A good workaround is to use an event listener to get the data input and a prop to show the data which can accessed this way: '@event="appointmentInfo.observations = $event.target.value"'
export default {
  props: {
    elementEnabled: Boolean,
    elementLabel: { type: String, default: "" },
    elementType: { type: String, default: "" },
    elementValue: { type: String, default: "" },
    optionValueArray: { type: Array, default: () => [] },
  },
  methods: {
    uid(elementLabel) {
      return `${elementLabel}${Math.random()}`;
    },
  },
};
</script>
