<template>
  <div id="app">
    <Layout />
    <Login />
  </div>
</template>

<script>
import Layout from "./layout";
import Login from "./views/saa/login";
export default {
  name: "App",
  components: {
    Layout,
    Login
  },
  data() {
    return {
      userData: {
        userCode: ''
      }
    }
  },
  mounted() {
    window.addEventListener('beforeunload', e => this.beforeunloadHandler(e));
  },
  destroyed() {
    window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
  },
  methods: {
    logout() {
      if (this.$store.state.usercode && this.$store.state.usercode !== '') {
        this.userData.userCode = this.$store.state.usercode;
        let params = {
          "requestUrl": this.$axios.config.user.baseURL + this.$axios.config.user.logout,
          "requestType": "POST",
          "requestBody": JSON.stringify(this.userData)
        }
        this.$axios
          .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, params)
          .then(response => {
            // console.log(333333333333,response)
          })
          .finally(() => {

          });
      }
    },
    beforeunloadHandler (e) {
      this.logout();
      if(event.clientX>document.body.clientWidth && event.clientY < 0 || event.altKey){
        alert("你关闭了浏览器");
      }else{
        alert("你正在刷新页面");
      }
      // console.log(122121,e)
      /*this.$confirm('是否退出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
        center: true
      }).then(() => {


      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        });
      });*/
    }
  }
};
</script>

<style>
#app {
  background: #f2f2f4;
}
</style>
