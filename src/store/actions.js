export default {
  setAlertData(context, alertData) {
    context.commit("setAlertData", alertData);
  },
  async auth(context, payload) {
    let alertData = {};
    console.log("login");
    let url =
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyATdxowaNxlHg4AWAUCtLt5z9qnNJbL2P8";
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
      alertData["alertMessage"] = responseData.message;
      alertData["alertType"] = "danger";
    } else {
      localStorage.setItem("token", responseData.idToken);
      localStorage.setItem("userId", responseData.localId);
      context.dispatch("setUser", {
        token: responseData.idToken,
        userId: responseData.localId,
      });
      alertData["alertMessage"] = "Seja bem-vindo";
      alertData["alertType"] = "success";
    }
    return alertData;
  },
  logout(context) {
    console.log("logout");
    // deletes user info from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    context.commit("setUser", {
      token: null,
      tokenId: null,
    });
  },
  setUser(context, payload) {
    context.commit("setUser", payload);
  },
};
