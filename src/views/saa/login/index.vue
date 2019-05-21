<template>
  <el-dialog
    id="loginDialog"
    :visible.sync="loginVisible"
    fullscreen
    :show-close="false"
    :modal-append-to-body="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false">
    <el-container>
      <el-header style="height: 20vh"></el-header>
      <el-main style="height: 60vh">
        <el-row style="height: 100%">
          <el-col :xs="0" :md="9" :lg="9" :xl="9">&nbsp;</el-col>
          <el-col :xs="24" :md="6" :lg="6" :xl="6" style="height: 100%">
            <el-card class="box-card" style="height: 100%">
              <el-form ref="loginForm" label-position="top" :rules="rules" :model="formLogin" size="default">
                <el-form-item prop="username">
                  <el-input v-model="formLogin.username" type="text" placeholder="用户名">
                    <svg slot="prepend" class="svg-icon">
                      <use :xlink:href="'#icon-user'" />
                    </svg>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input v-model="formLogin.password" type="password" placeholder="密码">
                    <svg slot="prepend" class="svg-icon">
                      <use :xlink:href="'#icon-lock'" />
                    </svg>
                  </el-input>
                </el-form-item>
                <el-form-item prop="code">
                  <el-input v-model="formLogin.code" type="text" placeholder="- - - -">
                    <template slot="prepend">
                      验证码
                    </template>
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
import { mapActions } from "vuex";
export default {
  name: "Login",
  data() {
    return {
      loginVisible: false,
      formLogin: {
        username: "admin",
        password: "admin",
        code: "v9am"
      },
      rules: {
        username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }]
      }
    };
  },
  methods: {
    ...mapActions("app", ["login"]),
    submit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // 登录
          // 注意 这里的演示没有传验证码
          // 具体需要传递的数据请自行修改代码
          this.loginVisible = false;
          this.login({
            username: this.formLogin.username,
            password: this.formLogin.password
          }).then(() => {
            this.loginVisible = false;
          });
        }
      });
    }
  },
  mounted() {
    if (!this.$store.getters["app/loginData"]) {
      this.loginVisible = true;
    }
    this.$store.subscribe(mutation => {
      if (mutation.type == "app/SET_LOGIN_DATA" && !mutation.payload) {
        this.loginVisible = true;
      }
    });
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
