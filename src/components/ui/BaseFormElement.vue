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
    <!-- Input type="email" -->
    <input
      v-if="elementType === 'inputEmail'"
      :id="uid(elementLabel)"
      :value="elementValue"
      class="w-full px-3 py-2 bg-white border border-indigo-400  disabled:border-0"
      :disabled="!elementEnabled"
      type="email"
    />
    <!-- Input type="password" -->
    <input
      v-if="elementType === 'inputPassword'"
      :id="uid(elementLabel)"
      :value="elementValue"
      class="w-full px-3 py-2 bg-white border border-indigo-400  disabled:border-0"
      :disabled="!elementEnabled"
      type="password"
    />
    <!-- Input type='checkbox' -->
    <!-- Requires a @change listener that gets the value from $event.target.checked, Has 'checked' attribute instead of 'value', Returns a truthy/falsey value -->
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
    <!-- Select that takes options as a prop array -->
    <!-- A null elementValue shows a default empty option, useful for a new data input -->
    <select
      v-if="elementType === 'select'"
      :id="uid(elementLabel)"
      class="w-full px-3 py-2 bg-white border border-indigo-400  disabled:border-0"
      :disabled="!elementEnabled"
    >
      <!-- Renders when a null value is given -->
      <option v-if="elementValue === null" disabled selected value>
        Selecione uma opção
      </option>
      <!-- Renders when a value is given -->
      <option v-if="elementValue" :value="elementValue">
        {{ elementValue }}
      </option>
      <!-- Renders options given by props -->
      <option v-for="option of filteredOptions" :key="option" :value="option">
        {{ option }}
      </option>
    </select>
  </div>
</template>

<script>
// * V-model can't be used here because it is sent to the div parent and conflicts with the :value prop. A good workaround is to use an event listener to get the data input and a prop to show the data which can accessed this way: '@event="appointmentInfo.observations = $event.target.value"'
export default {
  props: {
    elementEnabled: Boolean,
    elementLabel: { type: String, default: "" },
    // TODO: elementMask: { type: String, default: "" },
    elementType: { type: String, default: "" },
    elementValue: { type: String, default: "" },
    options: { type: Array, default: () => [] },
  },
  computed: {
    // Removes the elementValue from the options array
    filteredOptions() {
      if (this.elementType === "select") {
        const localOptions = this.options;
        if (this.elementValue !== null) {
          return localOptions
            .filter((item) => item !== this.elementValue)
            .sort();
        }
        return localOptions.sort();
      }
      return null;
    },
  },
  methods: {
    // Very simple Unique ID generator
    uid(elementLabel) {
      return `${elementLabel}${Math.random()}`;
    },
  },
};
</script>
