<template>
  <div>
    <form @submit.prevent="submitForm">
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
      <p v-if="!formIsValid">
        Please enter and a valid e-mail and password (must be at least 6
        characters long!)
      </p>
      <base-button>Login</base-button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formIsValid: true,
      userInfo: { email: "", password: "" },
    };
  },
  methods: {
    async submitForm() {
      this.formIsValid = true;
      if (
        this.userInfo.email === "" ||
        !this.userInfo.email.includes("@") ||
        !this.userInfo.email.includes(".") ||
        this.userInfo.password.length < 6
      ) {
        this.formIsValid = false;
        return;
      }
      const response = await this.$store.dispatch("auth", this.userInfo);
      this.$store.dispatch("setAlertData", response);
      if (response.alertType === "success") {
        this.$router.replace("/");
      }
    },
  },
};
</script>
