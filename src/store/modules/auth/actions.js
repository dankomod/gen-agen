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
    let url;
    if (mode === "login") {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyATdxowaNxlHg4AWAUCtLt5z9qnNJbL2P8";
    } else if (mode === "signup") {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyATdxowaNxlHg4AWAUCtLt5z9qnNJbL2P8";
    } else if (mode === "update") {
      url =
        "https://securetoken.googleapis.com/v1/token?key=AIzaSyATdxowaNxlHg4AWAUCtLt5z9qnNJbL2P8";
    }
    let fetchPayload = {
      method: "POST",
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        returnSecureToken: true,
      }),
    };
    if (mode === "update") {
      fetchPayload = {
        method: "POST",
        body: JSON.stringify({
          grant_type: "refresh_token",
          refresh_token: this.getters.refreshToken,
        }),
      };
    }
    const response = await fetch(url, fetchPayload);
    const responseData = await response.json();
    if (!response.ok) {
      console.log("ERRO", response);
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
      return alertData;
    }
    // Firebase API returns diferent keys on login/signup and update

    const token = responseData.idToken || responseData.id_token;
    const userId = responseData.localId || responseData.user_id;
    const refreshToken =
      responseData.refreshToken || responseData.refresh_token;
    const expiresIn = responseData.expiresIn || responseData.expires_in;
    const expiration = DateTime.now().plus({ seconds: expiresIn });
    localStorage.setItem("expiration", expiration);
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("refreshToken", refreshToken);
    context.dispatch("setUser", {
      token,
      userId,
      expiration,
      refreshToken,
    });
    if (mode !== "update") {
      alertData["alertMessage"] = "Seja bem-vindo";
      alertData["alertType"] = "success";
      return alertData;
    }
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
  async updateToken() {
    const response = await fetch(
      `https://securetoken.googleapis.com/v1/token?key=AIzaSyATdxowaNxlHg4AWAUCtLt5z9qnNJbL2P8`,
      {
        method: "POST",
        body: JSON.stringify({
          grant_type: "refresh_token",
          refresh_token: this.getters.refreshToken,
        }),
      }
    );
    // this.getters.token
    const responseData = await response.json();
    console.log(responseData);
  },
  setUser(context, payload) {
    context.commit("setUser", payload);
  },
};
