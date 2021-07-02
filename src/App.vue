<template>
  <div class="flex flex-col items-center justify-center py-10">
    <div class="flex flex-col items-center">
      <div class="pb-10 space-x-2">
        <span v-if="isLoggedIn" class="space-x-2">
          <router-link :to="{ name: 'Dashboard' }">
            <base-button>Início</base-button>
          </router-link>
          <router-link :to="{ name: 'Agenda' }">
            <base-button>Agenda</base-button>
          </router-link>
          <router-link :to="{ name: 'Clients' }">
            <base-button>Clientes</base-button>
          </router-link>
          <router-link :to="{ name: 'Configs' }">
            <base-button>Configurações</base-button>
          </router-link>
        </span>
        <router-link v-if="!isLoggedIn" :to="{ name: 'Auth' }">
          <base-button>Login</base-button>
        </router-link>
        <base-button v-else @click="logout">Logout</base-button>
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
      alertTimer: null,
      alertType: "",
      showAlert: false,
    };
  },
  // Computed can be used instead of the deep store watch if a return is needed
  computed: {
    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    },
  },
  watch: {
    $route() {
      this.update();
    },
  },
  created() {
    // If expiration is due the state won't get any Id data and the user will eventually be sent to auth
    if (
      localStorage &&
      localStorage.token &&
      localStorage.userId &&
      DateTime.fromISO(localStorage.expiration) > DateTime.now()
    ) {
      this.$store.dispatch("setUser", localStorage);
    } else if (DateTime.fromISO(localStorage.expiration) < DateTime.now()) {
      this.logout();
    }
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
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.replace("/auth");
    },
    update() {
      this.$store.dispatch("auth", { mode: "update" });
    },
  },
};
// eslint-disable-next-line no-unused-vars
import { DateTime } from "luxon";
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
