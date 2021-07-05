<template>
  <div :key="key">
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
    <base-form-element
      :element-enabled="true"
      :element-label="'Novo Método de Pagamento'"
      :element-type="'inputText'"
      @change="newConfig.newPaymentMethod = $event.target.value"
    ></base-form-element>
    <base-form-element
      :element-type="'select'"
      :element-enabled="true"
      :element-label="'Remover Método de Pagamento'"
      :options="$store.getters['configs/paymentMethods']"
      @change="newConfig.removePaymentMethod = $event.target.value"
    ></base-form-element>
    <base-button v-if="!showConfirmation" @click="showConfirmation = true"
      >Atualizar configurações</base-button
    >
    <base-dialog v-if="showConfirmation" :dialog-type="'danger'">
      Tem certeza de que deseja alterar as configuraçẽos do sistema?
    </base-dialog>
    <base-binary-buttons
      v-if="showConfirmation"
      @yes="setConfigs(), (showConfirmation = false)"
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
      newConfig: {
        closingHour: null,
        openingHour: null,
        newPaymentMethod: null,
        removePaymentMethod: null,
      },
      showConfirmation: false,
      key: 0,
    };
  },
  methods: {
    async setConfigs() {
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
      const response = await this.$store.dispatch("configs/getHours");
      if (response) {
        this.$store.dispatch("setAlertData", response);
      }
      if (this.newConfig.newPaymentMethod) {
        const paymentMethods = this.$store.getters["configs/paymentMethods"];
        const payload = [];
        if (paymentMethods !== null) {
          for (let method of paymentMethods) {
            payload.push(method);
          }
        }
        payload.push(this.newConfig.newPaymentMethod);
        const responseSet = await this.$store.dispatch(
          "configs/newPaymentMethod",
          payload
        );
        this.$store.dispatch("setAlertData", responseSet);
      }
      if (this.newConfig.removePaymentMethod) {
        const filterItem = this.newConfig.removePaymentMethod;
        const paymentMethods = this.$store.getters["configs/paymentMethods"];
        const payload = paymentMethods.filter((item) => item !== filterItem);
        const responseSet = await this.$store.dispatch(
          "configs/newPaymentMethod",
          payload
        );
        this.$store.dispatch("setAlertData", responseSet);
      }
      await this.$store.dispatch("configs/getHours");
      // TODO: Error catching
      await this.$store.dispatch("configs/getPaymentMethods");
      this.key++;
    },
  },
};
</script>
