<template>
  <div>
    <h1>Configs</h1>
    <base-form-element
      :element-enabled="true"
      :element-label="'Opening'"
      :element-type="'inputNumber'"
      @change="newConfig.openingHour = $event.target.value"
    ></base-form-element>
    <base-form-element
      :element-enabled="true"
      :element-label="'Closing'"
      :element-type="'inputNumber'"
      @change="newConfig.closingHour = $event.target.value"
    ></base-form-element>
    <base-button @click="setHour">HAHAHA</base-button>
  </div>
</template>

<script>
export default {
  data() {
    return { newConfig: { closingHour: null, openingHour: null } };
  },
  methods: {
    async setHour() {
      const payload = {};
      if (this.newConfig.closingHour) {
        payload["closingHour"] = this.newConfig.closingHour;
      }
      if (this.newConfig.openingHour) {
        payload["openingHour"] = this.newConfig.openingHour;
      }
      for (let entry of Object.entries(payload)) {
        const response = await this.$store.dispatch("configs/setHour", entry);
        this.$store.dispatch("setAlertData", response);
      }
    },
  },
};
</script>
