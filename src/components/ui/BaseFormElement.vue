<template>
  <div class="flex flex-row items-center">
    <!-- Default Label -->
    <label :for="elementLabel" class="w-36"> {{ elementLabel }} </label>
    <!-- Input type="text" -->
    <input
      v-if="elementType === 'inputText' && elementEnabled"
      type="text"
      :id="elementLabel"
      :value="elementValue"
      class="w-full py-2 pl-3 bg-indigo-100 border border-indigo-400"
    />
    <!-- Input type="number" -->
    <input
      v-if="elementType === 'inputNumber' && elementEnabled"
      type="number"
      :id="elementLabel"
      :value="elementValue"
      class="w-full py-2 pl-3 bg-indigo-100 border border-indigo-400"
    />
    <!-- Textarea -->
    <textarea
      v-if="elementType === 'textarea' && elementEnabled"
      :id="elementLabel"
      :value="elementValue"
      class="w-full px-3 py-2 bg-indigo-100 border border-indigo-400"
    ></textarea>
    <!-- Select that takes and options array as prop -->
    <select
      v-if="elementType === 'select' && elementEnabled"
      :id="elementLabel"
      :value="elementValue"
      class="w-full px-3 py-2 bg-indigo-100 border border-indigo-400"
    >
      <option v-for="option of optionValueArray" :key="option" :value="option">
        {{ option }}
      </option>
    </select>
    <p
      v-if="!elementEnabled"
      class="w-full py-2 pl-3 bg-indigo-100 border border-indigo-100"
      :class="elementValue ? '' : 'h-10'"
    >
      {{ elementValue }}
    </p>
  </div>
</template>

<script>
// * I can't figure out a way to us v-model here. The v-model directive is sent to the div parent AND conflicts with :value when it is needed to have a value on the input. A good workaround is to use @change to get the data input and :value to show data. The element events can be bound using @change and retrieving the value of the event, as follows: '@change="appointmentInfo.observations = $event.target.value"'
export default {
  props: [
    "elementEnabled",
    "elementLabel",
    "elementType",
    "elementValue",
    "optionValueArray",
  ],
};
</script>
