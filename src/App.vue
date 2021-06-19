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
  <router-view />
</template>

<style src="./assets/css/style.css"></style>
