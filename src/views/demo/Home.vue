<template>
  <div class="home">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <img alt="Vue logo" src="../../assets/logo.png" />
    <el-table v-loading="tableLoading" :data="tableData" style="width: 100%">
      <el-table-column prop="comCode" label="组织机构代码"> </el-table-column>
      <el-table-column prop="comName" label="组织机构名"> </el-table-column>
      <el-table-column prop="personCode" label="操作员代码"> </el-table-column>
      <el-table-column prop="personName" label="操作员姓名"> </el-table-column>
    </el-table>
    <pager-select
      v-model="selectModel"
      :remoteMethod="pagerQuery"
    ></pager-select>
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
import PagerSelect from "../../components/pager-select";

export default {
  name: "home",
  components: {
    HelloWorld,
    PagerSelect
  },
  data() {
    return {
      tableData: [],
      selectModel: "1",
      tableLoading: false
    };
  },
  methods: {
    pagerQuery(pageNo, pageSize, filter) {
      let params = new URLSearchParams();
      params.append("pageNo", pageNo);
      params.append("pageSize", pageSize);
      params.append("filter", filter);
      return this.$axios.get(
        this.$axios.config.sdd.baseURL +
          this.$axios.config.sdd.baseCode.format({
            codeType: "123"
          }) +
          "?" +
          params.toString()
      );
    }
  },
  mounted() {
    this.tableLoading = true;
    this.$axios
      .post(this.$axios.config.businessDataQuery, {})
      .then(response => {
        this.$notify({
          title: "成功",
          message: "这是一条Element UI的成功提示消息",
          type: "success"
        });
        this.tableData = response.data.table;
      })
      .finally(() => {
        this.tableLoading = false;
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
