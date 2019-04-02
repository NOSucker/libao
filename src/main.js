import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "./axios.js";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.config.productionTip = false;

Vue.use(ElementUI, { size: "small", zIndex: 3000 });
Vue.prototype.$axios = axios;

new Vue({
  router,
  store,
  render: h => h(App),
  data() {
    return {
      appVersion: process.env.VUE_APP_VERSION
    };
  }
}).$mount("#app");