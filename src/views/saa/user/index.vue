<template>
  <el-row>
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
    <el-table :data="tableData" tooltip-effect="dark" style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column label="日期" width="120">
        <template slot-scope="scope">
          {{ scope.row.date }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="address" label="地址" show-overflow-tooltip />
    </el-table>
    <el-pagination
      :current-page="currentPage4"
      background
      :page-sizes="[10, 20, 30, 50]"
      :page-size="100"
      style="width: 100%; text-align: right; margin-top: 20px"
      layout="total,  prev, pager, next, sizes, jumper"
      :total="36"/>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ]
    };
  }
};
</script>

<style>
.el-pagination__total {
  float: left;
}
</style>
