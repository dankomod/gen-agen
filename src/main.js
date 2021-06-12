import { createApp } from "vue";

// Main app page
import App from "./App.vue";

// Router config file
import router from "./router.js";

// Store config file
import store from "./store/index.js";

// Tailwind's production css
import "./assets/css/style.css";

// Creation of the app
const app = createApp(App);

// Dialog popup
import BaseDialog from "./components/ui/BaseDialog.vue";
app.component("base-dialog", BaseDialog);

import BaseButton from "./components/ui/BaseButton.vue";
app.component("base-button", BaseButton);

import BaseFormElement from "./components/ui/BaseFormElement.vue";
app.component("base-form-element", BaseFormElement);

// Router addition
app.use(router);

// Store addition
app.use(store);

// App is mounted
app.mount("#app");
