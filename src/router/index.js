import Vue from "vue";
import VueRouter from "vue-router";
import saaRouter from "./saa";
import sampleRouter from "../../examples/router";
import store from "../store/index";
// import {Loading} from 'element-ui';

Vue.use(VueRouter);
const router = new VueRouter({
  routes: [
    /*{
      path: "/",
      name: "home",
      meta: { icon: "home", title: "主页" },
      // meta: { requiresAuth: true },  // 路由元数据信息
      component: () => import("../views/demo/Home.vue")
    },*/
    {
      path: "/unlogun",
      name: "unlogun",
      /*meta: { icon: "lock", title: "用户未登录警告" },*/
      // meta: { requiresAuth: true },  // 路由元数据信息
      component: () => import("../views/demo/Unlogun.vue")
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ "../views/demo/About.vue")
    },
    {
      path: "/redirect/:path*",
      hidden: true,
      component: {
        beforeCreate() {
          this.$router.replace({
            path: "/" + (this.$route.params.path ? this.$route.params.path : ""),
            query: this.$route.query
          });
        },
        render: function(h) {
          return h(); // avoid warning message
        }
      }
    },
    ...saaRouter,
    ...sampleRouter
  ],

  //也为tomcat下打包后存放的路径，跟路径为tomcat的webApps
  base:'/app/'
});

// var routerLoading = null;

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
  // next(); // 确保要调用 next 方法，否则钩子就不会被 resolved。
  // console.log(router)

  //判断访问用户是否登录
  if (store.state.user) {
    next();
  } else {
    if (to.path === '/unlogun') {
      next();
    } else {
      next({path: '/unlogun'});
    }
  }
});

router.afterEach(() => {
  // 跳转完成隐藏加载动画，进度条等，成功跳转后的一些处理
  // if(routerLoading){
  //   routerLoading.close()
  // }
});

export default router;
