<template>
  <div class="home">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <img alt="Vue logo" src="../../assets/logo.png" />
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="comCode" label="组织机构代码"> </el-table-column>
      <el-table-column prop="comName" label="组织机构名"> </el-table-column>
      <el-table-column prop="personCode" label="操作员代码"> </el-table-column>
      <el-table-column prop="personName" label="操作员姓名"> </el-table-column>
    </el-table>
    <el-select v-model="selectModel" placeholder="请选择">
      <el-option
        v-for="item in $store.getters.baseCodeData('abc')"
        :key="item.code"
        :label="item.value"
        :value="item.code"
      >
      </el-option>
    </el-select>
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "home",
  components: {
    HelloWorld
  },
  data() {
    return {
      tableData: [],
      selectModel: ""
    };
  },
  mounted() {
    this.$notify({
      title: "成功",
      message: "这是一条Element UI的成功提示消息",
      type: "success"
    });
    this.$axios
      .post(this.$axios.config.businessDataQuery, {})
      .then(response => {
        this.tableData = response.data.table;
      });
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
