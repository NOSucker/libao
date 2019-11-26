<template>
  <div class="navbar">
    <div class="nav-menu-container" style="padding: 0 15px;" @click="toggleSideBar">
      <svg :class="{ 'is-active': sidebar.opened }" class="nav-menu">
        <use xlink:href="#icon-nav-menu" />
      </svg>
    </div>
    <u class="nav-menu-logout" @click="logout">logout</u>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      size: state => state.app.size
    })
  },
  methods: {
    ...mapActions("app", ["logout"]),
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    handleSetSize(size) {
      this.$ELEMENT.size = size;
      this.$store.dispatch("app/setSize", size);
      this.refreshView();
    },
    refreshView() {
      this.$nextTick(() => {
        this.$router.replace({
          path: "/redirect" + this.$route.fullPath
        });
      });
    },
    logout() {
      this.$confirm('是否退出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
        center: true
      }).then(() => {
        let params = {
          "requestUrl": this.$axios.config.user.baseURL + this.$axios.config.user.logout,
          "requestType": "POST",
          "requestBody": JSON.stringify({userCode: this.$store.state.usercode})
        }
        this.$axios
          .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, params)
          .then(response => {
            if (response.data.result.success) {
              this.$router.push({path: '/login'});
              this.$store.state.usercode = '';
            } else {
              this.$message.error(response.data.result.msg);
            }
          })
          .finally(() => {

          });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.nav-menu {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
}

.nav-menu.is-active {
  transform: rotate(180deg);
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .nav-menu-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .nav-menu-logout {
    line-height: 46px;
    height: 100%;
    float: right;
    padding: 0 15px;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      /*background: rgba(0, 0, 0, 0.025);*/
      color: #5f5f5f;
    }
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
