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
  // require("./mock/index");
}

Vue.config.productionTip = false;

Vue.use(ElementUI, { size: "small", zIndex: 3000 });
Vue.prototype.$axios = axios;

/**
 * 导航守卫
 */
router.beforeEach((to, from, next) => {
  // 跳转时显示加载动画，进度条等
  // routerLoading = Loading.service({
  //   lock: true,
  //   text: '跳转中...',
  // })
  // 权限验证，页面有未保存数据跳转等情况的处理
  next(); // 确保要调用 next 方法，否则钩子就不会被 resolved。

  //判断访问用户是否登录，控制写在router/index.js里面控制就行，这里无须再进行控制
  /*if (store.state.user) {
    next();
  } else {
    if (to.path === '/unlogun') {
      next();
    } else {
      next({path: '/unlogun'});
    }
  }*/
});

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
