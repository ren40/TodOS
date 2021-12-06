const config = {
  service: {
    BASE_API: process.env.VUE_APP_BASE_API,
    LIMIT_ELEMENT: process.env.VUE_APP_LIMIT_ELEMENT,
  },
};

export { config };
export default {
  install(Vue) {
    Vue.appConfig = config;
    Vue.prototype.$appConfig = config;
  },
};
