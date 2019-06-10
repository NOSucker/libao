<template>
  <div>
    <el-dialog
      ref="roleDialog"
      v-loading="submitLoading"
      top="5vh"
      title="角色添加用户"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="80%"
      @open="dialogOpen">
      <el-row :gutter="40">
        <el-col :span="8">
          <div style="padding:  0 10px 10px">
            <el-card style="height: 500px;  overflow-x: auto; overflow-y: auto;position: relative ">
              <div class="my-tree-header">
                <span style="margin-left: 10px;">角色归属机构</span>
              </div>
              <el-tree ref="taskTree" style="margin-top: 20px" node-key="taskCode" :data="showTreeData" :props="props" show-checkbox></el-tree>
            </el-card>
          </div>
        </el-col>
        <el-col :span="16">
          <el-table header-cell-class-name="user-table-header" :data="usersData" tooltip-effect="dark" stripe @selection-change="tableSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="userCode" label="用户代码" />
            <el-table-column prop="userName" label="用户名称" />
            <el-table-column prop="regTime" label="注册时间">
              <template slot-scope="scope">
                {{ scope.row.regTime | dataFilter("yyyy年MM月dd日") }}
              </template>
            </el-table-column>
            <el-table-column prop="comName" label="机构" />
            <el-table-column prop="validStatus" label="是否有效">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.validStatus"
                  active-value="1"
                  inactive-value="0"
                  disabled="disabled"
                  active-color="#13ce66"
                  inactive-color="#ff4949"></el-switch>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :current-page.sync="pagerQuery.pageNo"
            background
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="pagerQuery.pageSize"
            style="width: 100%; text-align: right; margin-top: 20px"
            layout="total,  prev, pager, next, sizes, jumper"
            :total="totalCount"
            @current-change="queryData"
            @size-change="
              pagerQuery.pageNo = 1;
              queryData();
            "/>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "AddUser",
  props: {
    value: Boolean,
    type: String,
    comTreeData: Array,
    roleData: Object
  },
  data() {
    return {
      usersData: [],
      props: {
        label: "taskName",
        children: "subLists"
      },
      tableSelection: []
    };
  },
  computed: {
    showDialog: {
      set(val) {
        this.$emit("input", val);
      },
      get() {
        return this.value;
      }
    }
  },
  watch: {
    comTreeData(newV) {
      this.showTreeData = JSON.parse(JSON.stringify(newV));
    }
  },
  mounted() {},
  methods: {
    submitForm() {
      let checkedTree = this.$refs.taskTree.getCheckedKeys();
      let theUrl = this.$axios.config.saa.createRole;
      let PostData = [this.rolePageData];
      this.rolePageData.taskCodeList = checkedTree;
      if (this.type === "edit") {
        theUrl = this.$axios.config.saa.updateRole;
        PostData = this.rolePageData;
      }
      this.submitLoading = true;
      this.$axios
        .post(this.$axios.config.saa.baseURL + theUrl, PostData)
        .then(response => {
          if (response.data.status === 0) {
            this.$message.success(this.type === "edit" ? "角色更新" : "角色添加" + "成功!");
            this.$emit("role-edit-close");
            this.$emit("input", false);
          } else {
            this.$message.error(response.data.statusText);
          }
        })
        .finally(() => {
          this.submitLoading = false;
        });
    },
    dialogOpen() {
      this.checkedList = [];
      this.expandedList = [];
      this.showTreeData = [];
      this.rolePageData = {};
      if (this.type === "copy") {
        if (this.roleData) {
          this.rolePageData = JSON.parse(JSON.stringify(this.roleData));
          this.$set(this.rolePageData, "roleCode", null);
          this.$set(this.rolePageData, "roleName", null);
        }
      }
      if (this.type === "edit") {
        if (this.roleData) {
          this.rolePageData = JSON.parse(JSON.stringify(this.roleData));
        }
      }
      if (this.type !== "add") {
        this.checkedList = this.rolePageData.taskCodeList;
      }
      this.showTreeData = JSON.parse(JSON.stringify(this.treeData));
      this.setExpandedList();
    },
    tableSelectionChange(selection) {
      this.tableSelection = selection;
    }
  }
};
</script>

<style scoped>
.my-tree-header {
  background: rgb(248, 251, 255);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 15px;
  color: #c1c1c4;
}
</style>
