<template>
  <div>
    <base-form-element
      :element-enabled="true"
      :element-label="'Opening'"
      :element-type="'inputNumber'"
      :element-value="$store.getters['configs/openingHour']"
      @change="newConfig.openingHour = $event.target.value"
    ></base-form-element>
    <base-form-element
      :element-enabled="true"
      :element-label="'Closing'"
      :element-type="'inputNumber'"
      :element-value="$store.getters['configs/closingHour']"
      @change="newConfig.closingHour = $event.target.value"
    ></base-form-element>
    <!-- // TODO: Payment methods -->
    <!-- // TODO: Confirmation -->
    <base-button v-if="!showConfirmation" @click="showConfirmation = true"
      >Atualizar configurações</base-button
    >
    <p v-if="showConfirmation" class="text-red">
      Tem certeza de que deseja alterar as configuraçẽos do sistema?
    </p>
    <base-binary-buttons
      v-if="showConfirmation"
      @yes="setHour(), (showConfirmation = false)"
      @no="showConfirmation = false"
    ></base-binary-buttons>
  </div>
</template>

<script>
import BaseBinaryButtons from "../../components/ui/BaseBinaryButtons.vue";
export default {
  components: { BaseBinaryButtons },
  data() {
    return {
      newConfig: { closingHour: null, openingHour: null },
      showConfirmation: false,
    };
  },
  methods: {
    async setHour() {
      const payload = {};
      // Evaluate if this can be turned into an iteration over non-null newConfig values when more varibles get added
      if (this.newConfig.closingHour) {
        payload["closingHour"] = this.newConfig.closingHour;
        // TODO: Error catching
        await this.$store.dispatch("configs/getHours");
      }
      if (this.newConfig.openingHour) {
        payload["openingHour"] = this.newConfig.openingHour;
        // TODO: Error catching
        await this.$store.dispatch("configs/getHours");
      }
      for (let entry of Object.entries(payload)) {
        // TODO: Error catching
        const response = await this.$store.dispatch("configs/setHour", entry);
        this.$store.dispatch("setAlertData", response);
      }
    },
  },
};
</script>
