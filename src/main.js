import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import http from "./plugins/axios";

Vue.config.productionTip = false;

const axios = http()

Vue.prototype.$http = axios;

const app = new Vue({
  vuetify,
  render: (h) => h(App),
});

app.$mount("#app");
