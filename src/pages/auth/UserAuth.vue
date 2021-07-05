<template>
  <div>
    <form @submit.prevent="submitForm">
      <div class="flex flex-col items-center">
        <input
          id="one"
          class="hidden"
          name="group"
          type="radio"
          checked
          @change="setMode('login')"
        />
        <input
          id="two"
          class="hidden"
          name="group"
          type="radio"
          @change="setMode('signup')"
        />
        <div class="tabs">
          <label
            id="one-tab"
            class="inline-block p-2 mx-1 text-white bg-black rounded-t-sm cursor-pointer "
            for="one"
            >Entrar</label
          >
          <label
            id="two-tab"
            class="inline-block p-2 mx-1 text-white bg-black rounded-t-sm cursor-pointer "
            for="two"
            >Cadastrar</label
          >
        </div>
        <div
          class="w-full p-5 overflow-hidden rounded-sm max-w-screen-xs panels"
        >
          <div id="one-panel" class="hidden panel">
            <p>Digite seu email e senha.</p>
          </div>
          <div id="two-panel" class="hidden panel">
            <p>
              Para cadastrar-se, informe um email válido e uma senha de mais de
              seis dígitos.
            </p>
          </div>
          <base-form-element
            :element-type="'inputEmail'"
            :element-enabled="true"
            :element-label="'Email'"
            @keyup="userInfo.email = $event.target.value"
          ></base-form-element>
          <base-form-element
            :element-type="'inputPassword'"
            :element-enabled="true"
            :element-label="'Senha'"
            @keyup="userInfo.password = $event.target.value"
          ></base-form-element>
          <base-button>{{ buttonText }}</base-button>
        </div>
      </div>
      <!-- <p v-if="!formIsValid">
        Please enter and a valid e-mail and password (must be at least 6
        characters long!)
      </p> -->
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // formIsValid: true,
      userInfo: { email: "", password: "" },
      mode: "login",
    };
  },
  computed: {
    buttonText() {
      if (this.mode === "login") {
        return "Entrar";
      } else if (this.mode === "signup") {
        return "Cadastrar";
      }
      return null;
    },
  },
  methods: {
    setMode(mode) {
      this.mode = mode;
    },
    async submitForm() {
      // eslint-disable-next-line no-unused-vars
      let message;
      if (this.userInfo.email === "") {
        message = "Informe um email";
      } else if (this.userInfo.password.length < 6) {
        message = "Informe uma senha de ao menos seis dígitos";
      } else if (!this.userInfo.email.includes("@")) {
        message = "Seu email deve conter uma arroba (@)";
      } else if (!this.userInfo.email.includes(".")) {
        message = "Seu email deve conter um ponto (.)";
      } else {
        message = "";
      }
      if (message !== "") {
        this.$store.dispatch("setAlertData", {
          alertMessage: message,
          alertType: "danger",
        });
        return;
      }
      const response = await this.$store.dispatch(this.mode, this.userInfo);
      this.$store.dispatch("setAlertData", response);
      if (response.alertType === "success") {
        this.$router.replace("/");
      }
    },
  },
};
</script>

<style>
.panel {
  animation: fadein 0.8s;
}
@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
#one:checked ~ .panels #one-panel,
#two:checked ~ .panels #two-panel {
  display: block;
}
#one:checked ~ .tabs #one-tab,
#two:checked ~ .tabs #two-tab {
  background: #fffffff6;
  color: #000;
  border-top: 3px solid #000;
}
</style>
