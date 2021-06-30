<template>
  <div class="flex flex-col items-center justify-center py-10">
    <div class="flex flex-col items-center">
      <div class="pb-10 space-x-2">
        <router-link :to="{ name: 'Dashboard' }">
          <base-button>Início</base-button>
        </router-link>
        <router-link :to="{ name: 'Agenda' }">
          <base-button>Agenda</base-button>
        </router-link>
        <router-link :to="{ name: 'Clients' }">
          <base-button>Clientes</base-button>
        </router-link>
      </div>
      <router-view v-slot="slotProps">
        <transition name="route" mode="out-in">
          <component
            :is="slotProps.Component"
            class="max-w-screen-lg"
          ></component>
        </transition>
      </router-view>
    </div>
    <teleport to="body">
      <base-alert-message
        v-if="showAlert"
        :alert-type="alertType"
        :alert-timer="alertTimer"
        @closeAlert="showAlert = false"
      >
        {{ alertMessage }}
      </base-alert-message>
    </teleport>
  </div>
</template>

<script>
export default {
  data() {
    return {
      alertMessage: "",
      alertType: "",
      alertTimer: null,
      showAlert: false,
    };
  },
  async created() {
    // Watches the store for changes in the alertselected slots
    this.$store.watch(
      () => {
        return this.$store.state.alertData;
      },
      (newValue) => {
        this.alertMessage = newValue.alertMessage;
        this.alertType = newValue.alertType;
        this.alertTimer = newValue.alertTimer;
        this.showAlert = true;
      },
      { deep: true }
    );
  },
};
</script>

<style>
.route-enter-active {
  transition: all 250ms ease-out;
}
.route-enter-to {
  transition: all 250ms ease-in;
}
.route-enter-from,
.route-leave-to {
  opacity: 0;
}
.route-leave-from,
.route-leave-active {
  opacity: 1;
}
</style>
