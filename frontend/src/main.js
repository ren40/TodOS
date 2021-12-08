import Vue from "vue";
import App from "./App.vue";
import Toast, { POSITION } from "vue-toastification";
import vuetify from "./plugins/vuetify";
import http from "./plugins/axios";
import configPlugin from "./plugins/config";
import "vue-toastification/dist/index.css";

Vue.config.productionTip = false;

const axios = http();

Vue.use(Toast, {
  transition: "Vue-Toastification__fade",
  maxToasts: 20,
  newestOnTop: true,
  position: POSITION.TOP_RIGHT,
});

Vue.use(configPlugin);

Vue.prototype.$http = axios;

const app = new Vue({
  vuetify,
  render: (h) => h(App),
});

app.$mount("#app");
