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
            <el-button type="primary" icon="el-icon-circle-plus" @click="changeToAdd">添加该角色用户</el-button>
          </span>
        </div>
        <el-col :span="24">
          <el-table header-cell-class-name="user-table-header" :data="existingUsersData" tooltip-effect="dark" stripe @selection-change="tableSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="userCode" label="用户代码" />
            <el-table-column prop="userName" label="用户名称" />
            <el-table-column prop="registerDate" label="注册时间">
              <template slot-scope="scope">
                {{ scope.row.registerDate | dataFilter("yyyy年MM月dd日") }}
              </template>
            </el-table-column>
            <el-table-column prop="organName" label="机构" />
            <!--<el-table-column prop="userStatus" label="是否有效">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.userStatus"
                  active-value="1"
                  inactive-value="0"
                  disabled="disabled"
                  active-color="#13ce66"
                  inactive-color="#ff4949"></el-switch>
              </template>
            </el-table-column>-->
          </el-table>
          <el-pagination
            :current-page.sync="queryUserData.pageNum"
            background
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="queryUserData.pageSize"
            style="width: 100%; text-align: right; margin-top: 20px"
            layout="total,  prev, pager, next, sizes, jumper"
            :total="totalCount"
            @current-change="queryExistingUsers"
            @size-change="
              queryUserData.pageNum = 1;
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
            <el-table-column prop="registerDate" label="注册时间">
              <template slot-scope="scope">
                {{ scope.row.registerDate | dataFilter("yyyy年MM月dd日") }}
              </template>
            </el-table-column>
            <el-table-column prop="organName" label="机构" />
            <!--<el-table-column prop="userStatus" label="是否有效">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.userStatus"
                  active-value="1"
                  inactive-value="0"
                  disabled="disabled"
                  active-color="#13ce66"
                  inactive-color="#ff4949"></el-switch>
              </template>
            </el-table-column>-->
          </el-table>
          <el-pagination
            :current-page.sync="queryUserData.pageNum"
            background
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="queryUserData.pageSize"
            style="width: 100%; text-align: right; margin-top: 20px"
            layout="total,  prev, pager, next, sizes, jumper"
            :total="totalCount"
            @current-change="queryData"
            @size-change="
              queryUserData.pageNum = 1;
              queryData();
            "/>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="modelType === 'add'" type="primary" @click="submitForm" icon="el-icon-finished">提交</el-button>
        <el-button v-if="modelType === 'manage'" type="danger" @click="deleteUser" icon="el-icon-remove">移除</el-button>
        <el-button @click="$emit('input', false)" icon="el-icon-circle-close">关闭</el-button>
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
        roleId: String,
        pageNum: 1,
        pageSize: 10
      },
      pageUserRoleParams: {
        "requestUrl": this.$axios.config.role.baseURL + this.$axios.config.role.queryUserRoleByPage,
        "requestType": "POST",
        "requestBody": ""
      },
      pageUserParams: {
        "requestUrl": this.$axios.config.user.baseURL + this.$axios.config.user.userQuery,
        "requestType": "POST",
        "requestBody": ""
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
        PostUsersCode.push(select.userId);
      });
      let param = {
        roleId: this.roleData.roleId,
        userIds: PostUsersCode
      }
      let postParam = {
        "requestUrl": this.$axios.config.role.baseURL + this.$axios.config.role.saveUserRole,
        "requestType": "POST",
        "requestBody": JSON.stringify(param)
      }
      this.submitLoading = true;
      this.$axios
        .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, postParam)
        .then(response => {
          if (JSON.parse(response.data.responseStr).success) {
            this.$message.success("成员添加成功!");
            this.$emit("add-user-close");
            this.$emit("input", false);
          } else {
            this.$message.error(JSON.parse(response.data.responseStr).msg);
          }
        })
        .finally(() => {
          this.submitLoading = false;
        });
    },
    dialogOpen() {
      this.queryUserData.roleId = this.roleData.roleId;
      this.queryExistingUsers();
    },
    // 查询可添加用户列表
    queryData() {
      this.pageUserParams.requestBody = JSON.stringify(this.queryUserData);
      this.submitLoading = true;
      this.$axios
        .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, this.pageUserParams)
        .then(response => {
          if (JSON.parse(response.data.responseStr).repCode === 'success') {
            this.usersData = JSON.parse(response.data.responseStr).result.dataList;
            this.totalCount = JSON.parse(response.data.responseStr).result.totalCount;
          } else {
            this.$message.error('系统异常，分页查询失败');
          }
        })
        .finally(() => {
          this.submitLoading = false;
        });
    },
    // 查询已有用户列表
    queryExistingUsers() {
      this.pageUserRoleParams.requestBody = JSON.stringify(this.queryUserData);
      this.submitLoading = true;
      this.$axios
        .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, this.pageUserRoleParams)
        .then(response => {
          if (JSON.parse(response.data.responseStr).success) {
            this.existingUsersData = JSON.parse(response.data.responseStr).result.dataList;
            this.totalCount = JSON.parse(response.data.responseStr).result.totalCount;
          } else {
            this.$message.error(JSON.parse(response.data.responseStr).msg);
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
        roleId: this.roleData.roleId,
        pageNum: 1,
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
          let PostUsersCode = [];
          this.tableSelection.forEach(select => {
            PostUsersCode.push(select.userId);
          });
          let param = {
            roleId: this.roleData.roleId,
            userIds: PostUsersCode
          }
          let delParams = {
            "requestUrl": this.$axios.config.role.baseURL + this.$axios.config.role.deleteUserRole,
            "requestType": "DELETE",
            "requestBody": JSON.stringify(param)
          }
          this.submitLoading = true;
          this.$axios
            .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, delParams)
            .then(response => {
              if (JSON.parse(response.data.responseStr).success) {
                this.$message.success("删除成功!");
                this.$emit("add-user-close");
                this.$emit("input", false);
              } else {
                this.$message.error(JSON.parse(response.data.responseStr).msg);
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
