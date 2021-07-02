// eslint-disable-next-line no-unused-vars
import { DateTime } from "luxon";
export default {
  async login(context, payload) {
    return context.dispatch("auth", { ...payload, mode: "login" });
  },
  async signup(context, payload) {
    return context.dispatch("auth", { ...payload, mode: "signup" });
  },
  async auth(context, payload) {
    const mode = payload.mode;
    let alertData = {};
    let url =
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyATdxowaNxlHg4AWAUCtLt5z9qnNJbL2P8";
    if (mode === "signup") {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyATdxowaNxlHg4AWAUCtLt5z9qnNJbL2P8";
    }
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        returnSecureToken: true,
      }),
    });
    const responseData = await response.json();
    if (!response.ok) {
      // General error
      let alert = "Erro na autenticação.";
      // Specific errors
      if (responseData.error.message) {
        if (responseData.error.message === "EMAIL_EXISTS") {
          alert = "Este email já foi cadastrado.";
        } else if (responseData.error.message === "INVALID_PASSWORD") {
          alert = "Senha inválida.";
        } else if (responseData.error.message === "EMAIL_NOT_FOUND") {
          alert = "Email não encontrado.";
        }
      }
      alertData["alertMessage"] = alert;
      alertData["alertType"] = "danger";
    } else {
      const expiration = DateTime.now().plus({
        minutes: responseData.expiresIn,
      });
      localStorage.setItem("expiration", expiration);
      localStorage.setItem("token", responseData.idToken);
      localStorage.setItem("userId", responseData.localId);
      context.dispatch("setUser", {
        token: responseData.idToken,
        userId: responseData.localId,
        expiration: expiration,
      });
      alertData["alertMessage"] = "Seja bem-vindo";
      alertData["alertType"] = "success";
    }
    return alertData;
  },
  logout(context) {
    // Deletes user info from localStorage and sets the state to null
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("expiration");
    context.commit("setUser", {
      token: null,
      tokenId: null,
      expiration: null,
    });
  },
  setUser(context, payload) {
    context.commit("setUser", payload);
  },
};
