import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
const router = new VueRouter({
  routes: [
    {
      path: "/",
      name: "home",
      // meta: { requiresAuth: true },  // 路由元数据信息
      component: () => import("../views/demo/Home.vue")
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "../views/demo/About.vue")
    }
  ]
});

/**
 * 导航守卫
 */
router.beforeEach((to, from, next) => {
  // 显示加载动画，进度条等
  // 权限验证，页面有未保存数据跳转等情况的处理
  next(); // 确保要调用 next 方法，否则钩子就不会被 resolved。
});

router.afterEach(to => {
  // 完成加载动画，进度条等，成功跳转后的一些处理
});

export default router;
