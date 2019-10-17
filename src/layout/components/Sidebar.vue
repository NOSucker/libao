<template>
  <div class="has-logo">
    <div class="sidebar-logo-container">
      <div class="sidebar-logo-link">
        <img src="../../assets/logo.png" class="sidebar-logo" />
        <h1 class="sidebar-title">{{ title }}</h1>
      </div>
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="$route.path"
        :collapse="!sidebar.opened"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
        :background-color="variables.menuBg">
        <sidebar-item :menu="menuList" />
        <!--<div v-for="route in $router.options.routes" :key="route.path" class="menu-wrapper">
          <router-link :to="route.path">
            <el-menu-item v-if="route.meta && (!route.children || route.children.length == 0)" :index="route.path">
              <svg class="svg-icon">
                <use :xlink:href="'#icon-' + route.meta.icon" />
              </svg>
              <span slot="title">{{ route.meta.title }}</span>
            </el-menu-item>
            <el-submenu :index="item.path" :model="item" v-if="item.meta && (route.children || route.children.length !== 0)" v-for="(item,index) in route.children">
              <svg class="svg-icon">
                <use :xlink:href="'#icon-' + item.meta.icon" />
              </svg>
              <span slot="title">{{ item.meta.title }}</span>
            </el-submenu>
          </router-link>
        </div>-->
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapState } from "vuex";
import variables from "@/styles/variables.scss";
import SidebarItem from "../components/SidebarItem"

export default {
  // name: "SubItem", //至关重要的一步，一定要写name，递归的时候使用
  components: { SidebarItem },
  data() {
    return {
      title: process.env.VUE_APP_TITLE,
      variables: variables,
      menuList: this.$router.options.userRoutes,
      usercode: this.$store.state.usercode
    };
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar
    })
  },
  beforeMount() {
    if (this.$store.state.usercode && this.$store.state.usercode !== '') {
      setTimeout(() => {
        this.sidebar.opened = true;
      }, 1000);
    }
  }
};
</script>

<style lang="scss" scoped>
.el-menu,
.el-menu-item {
  background-color: transparent;
}
.el-menu-item .svg-icon {
  font-size: 16px;
}
.menu-wrapper {
  text-align: left;
}

.el-menu-item {
  height: 42px;
  line-height: 42px;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;
  /*background: url(../../assets/images/headbg.jpg) left top 100%;*/

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
