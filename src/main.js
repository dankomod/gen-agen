import { createApp, defineAsyncComponent } from "vue";
import App from "./App.vue";
import router from "./router.js";
import store from "./store/index.js";

// Tailwind's production css
import "./assets/css/style.css";

const app = createApp(App);

import BaseButton from "./components/ui/BaseButton.vue";
app.component("base-button", BaseButton);

import BaseBinaryButtons from "./components/ui/BaseBinaryButtons.vue";
app.component("BaseBinaryButtons", BaseBinaryButtons);

const BaseFormElement = defineAsyncComponent(() =>
  import("./components/ui/BaseFormElement.vue")
);
app.component("base-form-element", BaseFormElement);

const BaseDialog = defineAsyncComponent(() =>
  import("./components/ui/BaseDialog.vue")
);
app.component("base-dialog", BaseDialog);

// Router addition
app.use(router);
// Store addition
app.use(store);
// App is mounted
app.mount("#app");
