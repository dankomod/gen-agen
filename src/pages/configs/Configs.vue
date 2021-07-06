<template>
  <div :key="key" class="w-full space-y-2 max-w-screen-xs">
    <div class="p-4 border border-indigo-200">
      <div
        class="flex flex-row items-center justify-between my-1"
        @click="showHours = !showHours"
      >
        <div class="flex flex-row items-center">
          <div class="pr-2">
            <div class="p-1 text-indigo-600 fill-current">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-10 h-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div class="text-grey-900">
            <h2 class="text-lg">Horários de funcionamento</h2>
            <p v-if="!showHours" class="text-grey-600">Abertura e fechamento</p>
          </div>
        </div>
        <div class="text-indigo-600 fill-current">
          <svg
            v-if="!showHours"
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 15l7-7 7 7"
            />
          </svg>
        </div>
      </div>
      <div v-if="showHours" class="pt-4 space-y-1">
        <base-form-element
          :element-enabled="true"
          :element-label="'Abertura'"
          :element-type="'inputNumber'"
          :element-value="$store.getters['configs/openingHour']"
          @change="newConfig.openingHour = $event.target.value"
        ></base-form-element>
        <base-form-element
          :element-enabled="true"
          :element-label="'Fechamento'"
          :element-type="'inputNumber'"
          :element-value="$store.getters['configs/closingHour']"
          @change="newConfig.closingHour = $event.target.value"
        ></base-form-element>
      </div>
    </div>
    <div class="p-4 border border-indigo-200">
      <div
        class="flex flex-row items-center justify-between my-1"
        @click="showPayments = !showPayments"
      >
        <div class="flex flex-row items-center">
          <div class="pr-2">
            <div class="p-1 text-indigo-600 fill-current">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-10 h-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div class="text-grey-900">
            <h2 class="text-lg">Formas de pagamento</h2>
          </div>
        </div>
        <div class="text-indigo-600 fill-current">
          <svg
            v-if="!showPayments"
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 15l7-7 7 7"
            />
          </svg>
        </div>
      </div>
      <div v-if="showPayments" class="pt-4 space-y-1">
        <base-form-element
          :element-enabled="true"
          :element-label="'Novo'"
          :element-type="'inputText'"
          @change="newConfig.newPaymentMethod = $event.target.value"
        ></base-form-element>
        <base-form-element
          :element-type="'select'"
          :element-enabled="true"
          :element-label="'Remover'"
          :options="$store.getters['configs/paymentMethods'].sort()"
          @change="newConfig.removePaymentMethod = $event.target.value"
        ></base-form-element>
      </div>
    </div>

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
      key: 0,
      newConfig: {
        closingHour: null,
        openingHour: null,
        newPaymentMethod: null,
        removePaymentMethod: null,
      },
      showConfirmation: false,
      showHours: false,
      showPayments: false,
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
      const responseHours = await this.$store.dispatch("configs/getHours");
      this.$store.dispatch("setAlertData", responseHours);
      const responsePayment = await this.$store.dispatch(
        "configs/getPaymentMethods"
      );
      this.$store.dispatch("setAlertData", responsePayment);
      this.key++;
    },
  },
};
</script>
