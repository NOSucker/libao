<template>
  <div>
    <el-dialog
      ref="roleDialog"
      v-loading="submitLoading"
      top="5vh"
      custom-class="user-add"
      title="用户管理"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="80%"
      @closed="dialogCloused"
      @open="dialogOpen">
      <el-collapse-transition></el-collapse-transition>
      <el-row v-if="modelType === 'manage'">
        <div style="width: 100%; height: 20px; line-height: 20px; font-size: 18px; margin: 15px 0;text-align: left;">
          管理已添加用户
          <span style="float: right; margin-bottom: 10px;">
            <el-button type="primary" icon="el-icon-circle-plus" @click="changeToAdd">新增角色</el-button>
          </span>
        </div>
        <el-col :span="24">
          <el-table header-cell-class-name="user-table-header" :data="existingUsersData" tooltip-effect="dark" stripe @selection-change="tableSelectionChange">
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
            :current-page.sync="queryUserData.pageNo"
            background
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="queryUserData.pageSize"
            style="width: 100%; text-align: right; margin-top: 20px"
            layout="total,  prev, pager, next, sizes, jumper"
            :total="totalCount"
            @current-change="queryExistingUsers"
            @size-change="
              queryUserData.pageNo = 1;
              queryExistingUsers();
            "/>
        </el-col>
      </el-row>
      <el-row v-if="modelType === 'add'">
        <div style="width: 100%; height: 20px; line-height: 20px; font-size: 18px; margin: 15px 0;text-align: left;">
          添加新用户
          <span style="float: right; margin-bottom: 10px;">
            <el-button icon="el-icon-back" @click="backToManage">返回管理</el-button>
          </span>
        </div>
        <el-col :span="24">
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
            :current-page.sync="queryUserData.pageNo"
            background
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="queryUserData.pageSize"
            style="width: 100%; text-align: right; margin-top: 20px"
            layout="total,  prev, pager, next, sizes, jumper"
            :total="totalCount"
            @current-change="queryData"
            @size-change="
              queryUserData.pageNo = 1;
              queryData();
            "/>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="modelType === 'add'" type="primary" @click="submitForm">提交</el-button>
        <el-button v-if="modelType === 'manage'" type="danger" @click="deleteUser">删除</el-button>
        <el-button @click="$emit('input', false)">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "AddUser",
  filters: {
    dataFilter(val, format) {
      if (!val) {
        return "";
      }
      const TempDate = new Date(val);
      if (TempDate instanceof Date && !isNaN(TempDate.getTime())) {
        return format ? TempDate.format(format) : TempDate.format("yyyy-MM-dd hh:mm:ss");
      }
      return "";
    }
  },
  props: {
    value: Boolean,
    type: String,
    roleData: Object
  },
  data() {
    return {
      submitLoading: false,
      totalCount: null,
      modelType: "manage",
      usersData: [], // 可添加用户
      existingUsersData: [], // 已有用户
      queryUserData: {
        pageNo: 1,
        pageSize: 10
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
  methods: {
    submitForm() {
      if (this.tableSelection.length === 0) {
        this.$message.warning("请您选择要添加的用户后再提交！");
        return;
      }
      let PostUsersCode = [];
      this.tableSelection.forEach(select => {
        PostUsersCode.push(select.userCode);
      });
      this.submitLoading = true;
      this.$axios
        .post(this.$axios.config.saa.baseURL + this.$axios.config.saa.addUserToRole.format({ roleCode: this.roleData.roleCode }), PostUsersCode)
        .then(response => {
          if (response.data.status === 0) {
            this.$message.success("成员添加成功!");
            this.$emit("add-user-close");
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
      this.queryExistingUsers();
    },
    // 查询可添加用户列表
    queryData() {
      this.submitLoading = true;
      this.$axios
        .get(this.$axios.config.saa.baseURL + this.$axios.config.saa.outsideRoleCode.format({ roleCode: this.roleData.roleCode }), {
          params: {
            _pageNo: this.queryUserData.pageNo,
            _pageSize: this.queryUserData.pageSize
          }
        })
        .then(response => {
          if (response.data.status === 0) {
            this.totalCount = response.data.data.totalCount;
            this.usersData = response.data.data.data;
          } else {
            this.$message.error(response.data.statusText);
          }
        })
        .finally(() => {
          this.submitLoading = false;
        });
    },
    // 查询已有用户列表
    queryExistingUsers() {
      this.submitLoading = true;
      this.$axios
        .get(this.$axios.config.saa.baseURL + this.$axios.config.saa.existingUserQuery.format({ roleCode: this.roleData.roleCode }), {
          params: {
            _pageNo: this.queryUserData.pageNo,
            _pageSize: this.queryUserData.pageSize
          }
        })
        .then(response => {
          if (response.data.status === 0) {
            this.totalCount = response.data.data.totalCount;
            this.existingUsersData = response.data.data.data;
          } else {
            this.$message.error(response.data.statusText);
          }
        })
        .finally(() => {
          this.submitLoading = false;
        });
    },
    tableSelectionChange(selection) {
      this.tableSelection = selection;
    },
    initPublicData() {
      this.rolePageData = {
        pageNo: 1,
        pageSize: 10
      };
      this.totalCount = 0;
      this.existingUsersData = [];
      this.usersData = [];
      this.tableSelection = [];
    },
    changeToAdd() {
      this.modelType = "add";
      this.initPublicData();
      this.queryData();
    },
    backToManage() {
      this.modelType = "manage";
      this.initPublicData();
      this.queryExistingUsers();
    },
    deleteUser() {
      const theSelectLength = this.tableSelection.length;
      if (theSelectLength === 0) {
        this.$message.warning("请您选择要添加的用户后再提交！");
        return;
      }
      this.$confirm(`是否确认删除已选的${theSelectLength}名用户?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.submitLoading = true;
          let PostUsersCode = [];
          this.tableSelection.forEach(select => {
            PostUsersCode.push(select.userCode);
          });
          console.log(this.roleData.roleCode);
          this.$axios
            .post(this.$axios.config.saa.baseURL + this.$axios.config.saa.deleteUsersFromRole.format({ roleCode: this.roleData.roleCode }), PostUsersCode)
            .then(response => {
              if (response.data.status === 0) {
                this.$message.success("删除成功!");
                this.$emit("add-user-close");
                this.$emit("input", false);
              } else {
                this.$message.error(response.data.statusText);
              }
            })
            .finally(() => {
              this.submitLoading = false;
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    dialogCloused() {
      this.modelType = "manage";
      this.initPublicData();
    }
  }
};
</script>

<style>
.user-add .el-dialog__header {
  background: #f8fbff;
}
.user-add .el-dialog__body {
  border-bottom: 1px solid #eee;
  padding: 10px 20px 30px;
}
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
