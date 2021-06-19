<template>
  <h1>All the Things</h1>
  <div>
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
</template>

<style>
.route-enter-from {
  opacity: 0;
  /* transform: translateY(-30px); */
}
.route-leave-to {
  opacity: 0;
  /* transform: translateY(30px); */
}
.route-enter-active {
  transition: all 100ms ease-out;
}
.route-enter-to {
  transition: all 100ms ease-in;
}
.route-leave-from,
.route-leave-active {
  opacity: 1;
  /* transform: translateY(0); */
}
</style>
