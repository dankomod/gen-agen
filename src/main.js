import { createApp, defineAsyncComponent } from "vue";
import App from "./App.vue";
import router from "./router.js";
import store from "./store/index.js";

// Tailwind's production css
import "./assets/css/style.css";

const app = createApp(App);

import BaseButton from "./components/ui/BaseButton.vue";
app.component("BaseButton", BaseButton);

import BaseBinaryButtons from "./components/ui/BaseBinaryButtons.vue";
app.component("BaseBinaryButtons", BaseBinaryButtons);

const BaseFormElement = defineAsyncComponent(() =>
  import("./components/ui/BaseFormElement.vue")
);
app.component("BaseFormElement", BaseFormElement);

const BaseDialog = defineAsyncComponent(() =>
  import("./components/ui/BaseDialog.vue")
);
app.component("BaseDialog", BaseDialog);

app.use(router);
app.use(store);
app.mount("#app");
