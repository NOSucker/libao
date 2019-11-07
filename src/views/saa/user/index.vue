<template>
  <div v-loading="queryLoading">
    <h2 style="background: #f8fbff;font-size: 14px;padding: 10px;margin-bottom: 0;">用户管理</h2>
    <div style="background: #fff; padding-top: 10px">
      <el-form ref="userForm" :model="pagerQuery" label-width="30%" style=" border-bottom: 1px solid #eee;">
        <el-row>
          <el-col :span="6">
            <el-form-item label="用户代码" prop="userCode">
              <el-input v-model="pagerQuery.userCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用户名称" prop="userName">
              <el-input v-model="pagerQuery.userName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="性别" prop="sex">
              <el-select v-model="pagerQuery.sex" style="width: 100%">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用户来源" prop="userSource">
              <el-select v-model="pagerQuery.userSource" style="width: 100%">
                <el-option label="CRM" value="CRM"></el-option>
                <el-option label="电销" value="电销"></el-option>
                <el-option label="四川分公司" value="四川分公司"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="注册日期" prop="registerDate">
              <el-date-picker v-model="pagerQuery.registerDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="到期日期" prop="expirationDate">
              <el-date-picker v-model="pagerQuery.expirationDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-button style="margin-left: 100px" type="primary" @click="queryData">查询</el-button>
            <el-button @click="$refs.userForm.resetFields()">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div style="padding: 20px">
        <el-row style="margin-bottom: 15px;">
          <el-button type="primary" icon="el-icon-plus" @click="userButtonClick('new')">
            新增
          </el-button>
          <el-button type="danger" :disabled="deleteDisabled" icon="el-icon-delete" @click="deleteUser">
            删除
          </el-button>
        </el-row>
        <el-table header-cell-class-name="user-table-header" :data="tableData" tooltip-effect="dark" stripe @selection-change="tableSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="userCode" label="用户代码" />
          <el-table-column prop="userName" label="用户名称" />
          <el-table-column prop="monitor" label="班长" />
          <el-table-column prop="init" label="初始化" />
          <el-table-column prop="userSource" label="用户来源" />
          <el-table-column prop="registerDate" label="注册时间">
            <template slot-scope="scope">
              {{ scope.row.registerDate | dataFilter("yyyy年MM月dd日") }}
            </template>
          </el-table-column>
          <el-table-column prop="organName" label="机构" />
          <!--原来的机构prop叫comName-->
          <el-table-column prop="vain" label="是否有效" />
          <el-table-column label="操作" width="150px">
            <template slot-scope="scope">
              <span title="详细信息" style="padding: 10px; cursor: pointer; color: #5683bf;" @click="userButtonClick('query', scope.row)">
                <i class="el-icon-info"></i>
              </span>
              <span title="角色" style="padding: 10px; cursor: pointer; color: #5683bf;" @click="userRoleButtonClick('role', scope.row)">
                <svg class="svg-icon">
                  <use xlink:href="#icon-user-config" />
                </svg>
              </span>
              <span title="复制" style="padding: 10px; cursor: pointer; color: #5683bf;" @click="userButtonClick('copy', scope.row)">
                <i class="el-icon-tickets"></i>
              </span>
              <span title="修改" style="padding: 10px; cursor: pointer; color: #5683bf;" @click="userButtonClick('edit', scope.row)">
                <i class="el-icon-edit"></i>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page.sync="pagerQuery.pageNum"
          background
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="pagerQuery.pageSize"
          style="width: 100%; text-align: right; margin-top: 20px"
          layout="total,  prev, pager, next, sizes, jumper"
          :total="totalCount"
          @current-change="queryData"
          @size-change="
            pagerQuery.pageNum = 1;
            queryData();
          "/>
      </div>
    </div>
    <edit-user
      v-model="editDialogVisible"
      :type="editStatus"
      :user-data="editData"
      @role-edit-close="
        pagerQuery._pageNo = 1;
        queryData();
      "></edit-user>
    <role-user v-model="roleDialogVisible" :type="roleUserStatus" :role-user-data="roleUserData" :click-param="clickParam"></role-user>
  </div>
</template>

<script>
import editUser from "../user/model/edit-user";
import roleUser from "../user/model/role-user";
export default {
  components: {
    editUser,
    roleUser
  },
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
  data() {
    return {
      clickParam: false, //用于点击角色查询当前用户的角色
      value1: null,
      tableData: [],
      tableSelection: [],
      totalCount: 0,
      queryLoading: false,
      pagerQuery: {
        userCode: null,
        userName: null,
        sex: null,
        registerDate: null,
        expirationDate: null,
        userSource: null,
        pageNum: 1,
        pageSize: 10
      },
      userAddParams: {
        requestUrl: this.$axios.config.user.baseURL + this.$axios.config.user.userAdd,
        requestType: "POST",
        requestBody: ""
      },
      userQueryParams: {
        requestUrl: this.$axios.config.user.baseURL + this.$axios.config.user.userQuery,
        requestType: "POST",
        requestBody: ""
      },

      userDeleteParams: {
        requestUrl: this.$axios.config.user.baseURL + this.$axios.config.user.userDelete,
        requestType: "POST",
        requestBody: ""
      },
      userQueryAllParams: {
        requestUrl: this.$axios.config.user.baseURL + this.$axios.config.user.userQueryAll,
        requestType: "POST",
        requestBody: ""
      },
      roleUserData: {},
      roleDialogVisible: false,
      roleUserStatus: "",

      editData: {},
      editDialogVisible: false,
      editStatus: ""
    };
  },
  computed: {
    editDisabled() {
      return this.tableSelection.length != 1;
    },
    deleteDisabled() {
      return this.tableSelection.length < 1;
    }
  },
  mounted() {
    this.queryData();
  },
  methods: {
    queryData() {
      this.queryLoading = true;
      this.userQueryParams.requestBody = JSON.stringify(this.pagerQuery);
      this.$axios
        .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, this.userQueryParams)
        .then(response => {
          this.tableData = JSON.parse(response.data.responseStr).result.dataList;
          this.totalCount = JSON.parse(response.data.responseStr).result.totalCount;
          //this.totalCount = response.data.totalCount;
        })
        .finally(() => {
          this.queryLoading = false;
        });
    },
    tableSelectionChange(selection) {
      this.tableSelection = selection;
    },
    userRoleButtonClick(type, data) {
      this.roleUserData = data;
      this.roleUserStatus = type;
      this.roleDialogVisible = true;
      this.clickParam = true;
    },
    userButtonClick(type, data) {
      this.editData = data;
      this.editStatus = type;
      this.editDialogVisible = true;
    },
    deleteUser() {
      this.$confirm("此操作将永久删除所选数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          if (this.tableSelection.length < 1) {
            this.$message.warning("请您选中需要删除的数据后再进行操作");
            return;
          }
          let needDelUser = [];
          this.tableSelection.forEach(select => {
            needDelUser.push(select.userCode);
          });
          let delParams = {
            requestUrl: this.$axios.config.user.baseURL + this.$axios.config.user.userDelete,
            requestType: "DELETE",
            requestBody: needDelUser
          };
          this.queryLoading = true;
          this.$axios
            .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, delParams)
            .then(response => {
              if (JSON.parse(response.data.responseStr).success) {
                this.$message.success("数据删除成功！");
                this.queryData();
              } else {
                this.$message.error(JSON.parse(response.data.responseStr).msg);
              }
            })
            .finally(() => {
              this.queryLoading = false;
            });

          /*this.$message({
            type: 'success',
            message: '删除成功!'
          });*/
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style>
.user-table-header {
  border-top: 2px solid #ebeef5;
  border-bottom: 2px solid #ebeef5 !important;
}

.el-pagination__total {
  float: left;
}
.user-datapick {
  width: 100% !important;
}
.user-datapick .el-range-separator {
  width: 10%;
}
</style>
