<template>
  <el-dialog
    id="loginDialog"
    :visible.sync="loginVisible"
    :fullscreen="true"
    :show-close="false"
    :modal-append-to-body="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-container>
      <el-header style="height: 20vh"></el-header>
      <el-main style="height: 60vh;min-height: 320px">
        <el-row style="height: 100%">
          <el-col :xs="0" :md="9" :lg="9" :xl="9">&nbsp;</el-col>
          <el-col :xs="24" :md="6" :lg="6" :xl="6" style="height: 100%">
            <el-card v-loading="loginLoading" class="box-card" style="height: 100%">
              <el-form ref="loginForm" label-position="top" :rules="rules" :model="formLogin" size="default">
                <el-form-item prop="userCode">
                  <el-input v-model="formLogin.userCode" type="text" placeholder="用户名">
                    <svg slot="prepend" class="svg-icon">
                      <use :xlink:href="'#icon-user'" />
                    </svg>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input v-model="formLogin.password" type="password" placeholder="密码" show-password>
                    <svg slot="prepend" class="svg-icon">
                      <use :xlink:href="'#icon-lock'" />
                    </svg>
                  </el-input>
                </el-form-item>
                <el-form-item prop="code">
                  <el-input v-model="formLogin.code" type="text" placeholder="- - - -">
                    <svg slot="prepend" class="svg-icon">
                      <use :xlink:href="'#icon-iconmonstr-shield-27'" />
                    </svg>
                    <template slot="append">
                      <img class="login-code" src="../../../assets/login-code.png" />
                    </template>
                  </el-input>
                </el-form-item>
                <el-button size="default" style="width: 100%" type="primary" class="button-login" @click="submit">登录</el-button>
              </el-form>
            </el-card>
          </el-col>
          <el-col :xs="0" :md="9" :lg="9" :xl="9">&nbsp;</el-col>
        </el-row>
      </el-main>
      <el-footer style="height: 20vh"></el-footer>
    </el-container>
  </el-dialog>
</template>

<script>
// import { mapActions } from "vuex";
import { mapState } from "vuex";
import lazyLoading from "../../../router/lazyLoading";
export default {
  name: "Login",
  data() {
    return {
      loginVisible: false,
      loginLoading: false,
      formLogin: {
        userCode: "admin",
        password: "adminadmin",
        code: "v9am"
      },
      rules: {
        userCode: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar
    })
  },
  mounted() {
    if (!this.$store.state.usercode) {
      this.loginVisible = true;
    }
    this.$store.subscribe(mutation => {
      if (mutation.type == "app/SET_LOGIN_DATA" && !mutation.payload) {
        this.loginVisible = true;
      }
    });
  },
  methods: {
    // ...mapActions("app", ["login"]),
    submit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          let param = {
            "requestUrl": this.$axios.config.user.baseURL + this.$axios.config.user.login,
            "requestType": "POST",
            "requestBody": JSON.stringify(this.formLogin)
          }
          this.loginLoading = true;
          this.$axios
            .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, param)
            .then(response => {
              if (JSON.parse(response.data.responseStr).success) {
                this.$store.state.usercode = JSON.parse(response.data.responseStr).result.userCode;
                this.$message.success("登录成功");
                if (this.$store.state.usercode && this.$store.state.usercode !== '') {
                  //自带静态的三个路由页面
                  if (this.$router.options.userRoutes.length <= 0) {
                    //加载权限菜单
                    const theUserCode = this.$store.state.usercode;
                    /*let parentId = '/menu5acfcbb1cfbc4c3e9247db3325210b06';
                    let param = {
                      "requestUrl": this.$axios.config.menu.baseUrl + this.$axios.config.menu.queryMenuByParentId + parentId,
                      "requestType": "GET"
                    }*/
                    let params = {
                      "requestUrl": this.$axios.config.menu.baseUrl + this.$axios.config.menu.selectAllMenuByUser + '/' + theUserCode,
                      "requestType": "GET"
                    }
                    this.$axios
                      .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, params)
                      .then(response => {
                        if (JSON.parse(response.data.responseStr).success) {
                          let permissionRouteList = this.routerCreater(JSON.parse(response.data.responseStr).result[0].children);
                          Object.assign(this.$router.options.userRoutes, permissionRouteList);
                          setTimeout(() => {
                            this.sidebar.opened = true;
                          }, 500);
                        } else {
                          this.$message.error(JSON.parse(response.data.responseStr).msg);
                        }
                      });
                     }
                  }
                this.loginVisible = false;
                if (this.$router.app.$router.currentRoute.params.oldPath) {
                  this.$router.push({path: this.$router.app.$router.currentRoute.params.oldPath});
                }
              } else {
                this.$message.error(JSON.parse(response.data.responseStr).msg);
              }
            })
            .catch(error => {
              console.log(error);
            })
            .finally(() => {
              this.loginLoading = false;
            });
        }
      });
    },

    routerCreater(arr) {
      let routeObj = {
        path: "",
        name: "",
        meta: { icon: "", title: "" },
        component: () => import("../../../views/saa/role/index"),
        children: []
      };
      let routeArr = [];
      arr.forEach(e => {
        let routeObjNew = JSON.parse(JSON.stringify(routeObj));
        routeObjNew.path = e.menuPath;
        routeObjNew.name = e.menuPath ? e.menuPath.replace(/^\/(.*)/, '$1') : '';
        routeObjNew.meta.title = e.menuName;
        routeObjNew.meta.icon = e.menuIcon;
        routeObjNew.component = lazyLoading(e.url);
        if (e.children.length > 0) {
          //将一个数组的元素放进两一个数组
          routeObjNew.children = routeObjNew.children.concat(this.routerCreater(e.children));
        }
        // console.log(33333,routeObjNew)
        routeArr.push(routeObjNew);
      });
      return routeArr;
    }
  }
};
</script>

<style>
#loginDialog .el-dialog__body {
  height: 100%;
  padding: 0px;
}
#loginDialog .el-dialog__header {
  padding: 0px;
}
.login-code {
  height: 38px;
  display: block;
  margin: 0px -20px;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
}
</style>
