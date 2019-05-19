<template>
  <div v-loading="loading">
    <div style="text-align: left">
      <el-button type="primary" icon="el-icon-plus">
        新增
      </el-button>
      <el-button type="primary" disabled icon="el-icon-edit">
        修改
      </el-button>
      <el-button type="danger" disabled icon="el-icon-delete">
        删除
      </el-button>
    </div>
    <el-table :data="tableData" tooltip-effect="dark" stripe style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="userCode" label="用户代码" width="120" />
      <el-table-column prop="userName" label="用户名称" width="120" />
      <el-table-column prop="comCode" label="组织机构代码" width="120" />
      <el-table-column prop="comCName" label="组织机构名称" width="120" />
      <el-table-column prop="regTime" label="注册时间" width="120">
        <template slot-scope="scope">
          {{ new Date(scope.row.regTime).format("yyyy年MM月dd日") }}
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" show-overflow-tooltip />
    </el-table>
    <el-pagination
      :current-page.sync="pagerQuery.pageNo"
      background
      :page-sizes="[10, 20, 30, 50]"
      :page-size="10"
      style="width: 100%; text-align: right; margin-top: 20px"
      layout="total,  prev, pager, next, sizes, jumper"
      :total="totalCount"
      @current-change="queryData"/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      totalCount: 0,
      loading: false,
      pagerQuery: {
        pageNo: 1,
        perPage: 10
      }
    };
  },
  mounted() {
    this.queryData();
  },
  methods: {
    queryData() {
      this.loading = true;
      this.$axios
        .post(this.$axios.config.saa.baseURL + this.$axios.config.saa.userQuery, this.pagerQuery)
        .then(response => {
          this.tableData = response.data.data.data;
          this.totalCount = response.data.data.totalCount;
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style>
.el-pagination__total {
  float: left;
}
</style>
