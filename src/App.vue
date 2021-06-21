<template>
  <div class="flex flex-col items-center">
    <div class="container flex flex-col items-center max-w-screen-lg">
      <div class="py-10 space-x-2">
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
          <component :is="slotProps.Component"></component>
        </transition>
      </router-view>
    </div>
  </div>
</template>

<style>
.route-enter-active {
  transition: all 100ms ease-out;
}
.route-enter-to {
  transition: all 100ms ease-in;
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
