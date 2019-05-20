import Vue from "vue";
import ElementUI from "element-ui";
import App from "./App.vue";
import router from "./router/index";
import store from "./store/index";
import axios from "./axios.js";
import "./libs/util.js";
import "./icons"; // icon
import "element-ui/lib/theme-chalk/index.css";
import "@/styles/index.scss"; // global css
import "animate.css";

if (process.env.NODE_ENV === "development") {
  require("./mock/index");
}

Vue.config.productionTip = false;

Vue.use(ElementUI, { size: "mini", zIndex: 3000 });
Vue.prototype.$axios = axios;

new Vue({
  router,
  store,
  data() {
    return {
      appVersion: process.env.VUE_APP_VERSION
    };
  },
  render: h => h(App)
}).$mount("#app");
