import Vue from "vue";
import VueRouter from "vue-router";
import saaRouter from "./saa";
import sampleRouter from "../../examples/router";
import store from "../store/index";
import axios from "../axios";
import lazyLoading from "../router/lazyLoading";
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
      path: "/login",
      name: "login",
      component: () => import("../views/saa/login/index.vue")
    },
    {
      path: "/unlogun",
      name: "unlogun",
      /*meta: { icon: "lock", title: "用户未登录警告" },*/
      // meta: { requiresAuth: true },  // 路由元数据信息
      component: () => import("../views/demo/Unlogun.vue")
    },
    {
      path: "/outLogin",
      name:"outLogin",
      component: () => import("../views/saa/outLogin/index.vue")
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
      path: "/couponCodeManage",
      name: "couponCodeManage",
      component: () => import(/* webpackChunkName: "about" */ "../views/couponCode/couponCodeManage/index.vue")
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
  userRoutes: [],

  //也为tomcat下打包后存放的路径，跟路径为tomcat的webApps
  base: "/app/"
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

  //判断访问用户是否登录(判断是否传id过来)   （跳转过来必须登录的话就注释掉此操作）
  if (to.query.usercode) {
    store.state.usercode = to.query.usercode;
  }
  // console.log(store.state.usercode, router.currentRoute.query.usercode)
  if (store.state.usercode && store.state.usercode !== "") {
    //自带静态的三个路由页面
    if (router.options.userRoutes.length <= 0) {
      //加载权限菜单
      const theUserCode = store.state.usercode;
      /*let parentId = '/menu5acfcbb1cfbc4c3e9247db3325210b06';
      let param = {
        "requestUrl": this.$axios.config.menu.baseUrl + this.$axios.config.menu.queryMenuByParentId + parentId,
        "requestType": "GET"
      }*/
      let params = {
        requestUrl: axios.config.menu.baseUrl + axios.config.menu.selectAllMenuByUser + "/" + theUserCode,
        requestType: "GET"
      };
      axios.post(axios.config.service.baseURL + axios.config.service.transitInterface, params).then(response => {
        if (response.data.result.success) {
          let permissionRouteList = routerCreater(response.data.result.result[0].children);
          //放进去没得用
          /*permissionRouteList.forEach(e => {
              router.options.routes.push(e);
            });*/
          Object.assign(router.options.userRoutes, permissionRouteList);
          // router.options.userRoutes = permissionRouteList;
          // console.log('前置钩子执行了');
        } else {
          console.log("查询菜单权限失败");
        }
      });
    }
    next();
  } else if (to.path !== "/login") {
    next();
  } else {
    next({ path: "/login", params: { oldPath: to.path } }); //
  }
});

router.afterEach((to, from) => {
  /*// 跳转完成隐藏加载动画，进度条等，成功跳转后的一些处理
  // if(routerLoading){
  //   routerLoading.close()
  // }
  //判断访问用户是否登录(判断是否传id过来)
  if (to.query.usercode) {
    store.state.usercode = to.query.usercode;
  }
  console.log("后置钩子执行了")

  // console.log(store.state.usercode, router.currentRoute.query.usercode)
  if (store.state.usercode && store.state.usercode !== '') {
    //自带静态的三个路由页面
    if (router.options.userRoutes.length <= 0) {
      //加载权限菜单
      const theUserCode = store.state.usercode;
      /!*let parentId = '/menu5acfcbb1cfbc4c3e9247db3325210b06';
      let param = {
        "requestUrl": this.$axios.config.menu.baseUrl + this.$axios.config.menu.queryMenuByParentId + parentId,
        "requestType": "GET"
      }*!/
      let params = {
        "requestUrl": axios.config.menu.baseUrl + axios.config.menu.selectAllMenuByUser + '/' + theUserCode,
        "requestType": "GET"
      }
      axios
        .post(axios.config.service.baseURL + axios.config.service.transitInterface, params)
        .then(response => {
          if (JSON.parse(response.data.responseStr).success) {
            /!*let routeObj = {
              path: "",
              name: "",
              meta: { icon: "", title: "" },
              component: () => import("../views/saa/role/index"),
              children: []
            };
            let routeArr = [];
            JSON.parse(response.data.responseStr).result[0].children.forEach(e => {
              let routeObjNew = routeObj;
              routeObjNew.path = e.menuPath;
              routeObjNew.name = e.menuPath ? e.menuPath.replace(/^\/(.*)/, '$1') : '';
              routeObjNew.meta.title = e.menuName;
              routeObjNew.meta.icon = e.menuIcon;
              routeObjNew.component().path = e.url ? e.url : '../views/demo/About.vue';
              console.log(33333,routeObjNew)
              if (e.children.length > 0) {
                routeObjNew.children.push(routerCreater(e.children));
              }
              routeArr.push(routeObjNew);
            });*!/
            let permissionRouteList = routerCreater(JSON.parse(response.data.responseStr).result[0].children);
            //放进去没得用
            /!*permissionRouteList.forEach(e => {
              router.options.routes.push(e);
            });*!/
            router.options.userRoutes = permissionRouteList;
          } else {
            this.$message.error(JSON.parse(response.data.responseStr).msg);
          }
        });
    }
  }*/
});

export function routerCreater(arr) {
  let routeObj = {
    path: "",
    name: "",
    meta: { icon: "", title: "" },
    component: () => import("../views/saa/role/index"),
    children: []
  };
  let routeArr = [];
  arr.forEach(e => {
    let routeObjNew = JSON.parse(JSON.stringify(routeObj));
    routeObjNew.path = e.menuPath;
    routeObjNew.name = e.menuPath ? e.menuPath.replace(/^\/(.*)/, "$1") : "";
    routeObjNew.meta.title = e.menuName;
    routeObjNew.meta.icon = e.menuIcon;
    routeObjNew.component = lazyLoading(e.url);
    if (e.children.length > 0) {
      //将一个数组的元素放进两一个数组
      routeObjNew.children = routeObjNew.children.concat(routerCreater(e.children));
    }
    // console.log(33333,routeObjNew)
    routeArr.push(routeObjNew);
  });
  return routeArr;
}

export default router;
