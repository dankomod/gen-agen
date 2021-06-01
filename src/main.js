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

const { DateTime } = require("luxon");
app.config.globalProperties.$luxonDateTime = DateTime;

// Router addition
app.use(router);

// Store addition
app.use(store);

// App is mounted
app.mount("#app");
