<template>
  <div class="menu-wrapper">
    <template v-for="item in menu">
      <!-- 最后一级菜单 -->
      <router-link :to="item.path ? item.path : ''">
        <el-menu-item
          v-if="item.children.length==0"
          :key="item.meta.title"
          :index="parent ? parent + '/' + item.meta.title ? item.meta.title : '' : item.meta.title ? item.meta.title : ''"
        >
          <svg class="svg-icon">
            <use :xlink:href="'#icon-' + (item ? item.meta ? item.meta.icon ? item.meta.icon : '' : '' : '')" />
          </svg>
          <span slot="title">{{ item ? item.meta ? item.meta.title ? item.meta.title : '' : '' : ''}}</span>
        </el-menu-item>
      </router-link>

      <!-- 此菜单下还有子菜单 -->
      <router-link :to="item.path ? item.path : ''">
        <el-submenu
          v-if="item.children.length > 0"
          :key="item.meta.title"
          :index="parent ? parent + '/' + item.meta.title ? item.meta.title : '' : item.meta.title ? item.meta.title : ''"
        >
          <template slot="title">
            <svg class="svg-icon">
              <use :xlink:href="'#icon-' + (item ? item.meta ? item.meta.icon ? item.meta.icon : '' : '' : '')" />
            </svg>
            <span> {{ item ? item.meta ? item.meta.title ? item.meta.title : '' : '' : ''}}</span>
          </template>
          <!-- 递归 -->
          <sidebar-item
            :menu="item.children"
            :parent="parent ? parent + '/' + item.meta.title : item.meta.title"
          />
        </el-submenu>
      </router-link>
    </template>
  </div>
</template>

<script>
  export default {
    name: "SidebarItem",
    props: ["menu", "parent"],
    data() {
      return {};
    },
    mounted() {
      // console.log(1234,this.menu)
    }
  };
</script>

<style scoped>

</style>
