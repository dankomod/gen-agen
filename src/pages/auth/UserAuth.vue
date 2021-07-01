<template>
  <div>
    <form @submit.prevent="submitForm">
      <div class="wrapper">
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
          <label id="one-tab" class="tab" for="one">Entrar</label>
          <label id="two-tab" class="tab" for="two">Cadastrar</label>
        </div>
        <div class="panels">
          <div id="one-panel" class="panel">
            <p>Digite seu email e senha.</p>
          </div>
          <div id="two-panel" class="panel">
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
      // this.formIsValid = true;
      if (
        this.userInfo.email === "" ||
        !this.userInfo.email.includes("@") ||
        !this.userInfo.email.includes(".") ||
        this.userInfo.password.length < 6
      ) {
        // this.formIsValid = false;
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
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.tab {
  cursor: pointer;
  padding: 10px 20px;
  margin: 0px 2px;
  background: #000;
  display: inline-block;
  color: #fff;
  border-radius: 3px 3px 0px 0px;
}
.panels {
  width: 100%;
  max-width: 500px;
  border-radius: 3px;
  overflow: hidden;
  padding: 20px;
}
.panel {
  display: none;
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
