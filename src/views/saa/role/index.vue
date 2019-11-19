<template>
  <div v-loading="queryLoading">
    <h2 style="background: #f8fbff;font-size: 14px;padding: 10px;margin-bottom: 0;">角色管理</h2>
    <div style="background: #fff; padding-top: 10px">
      <el-form ref="roleForm" :model="queryRole" :rules="rules" label-width="30%" style=" border-bottom: 1px solid #eee;">
        <el-row>
          <el-col :span="6">
            <el-form-item label="角色代码" prop="roleCode">
              <el-input v-model="queryRole.roleCode" clearable @input="queryRoleList"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="queryRole.roleName" clearable @input="queryRoleList"></el-input><!--@change事件失去焦点才触发，@input变化就触发-->
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button style="margin-left: 20px" type="primary" @click="queryRoleList">查询</el-button> <!--icon="el-icon-search"-->
            <el-button @click="resetRoleForm('roleForm')">重置</el-button>  <!--icon="el-icon-refresh"-->
          </el-col>
        </el-row>
      </el-form>
      <div style="padding: 20px">
        <el-row style="margin-bottom: 15px;">
          <el-button type="primary" icon="el-icon-circle-plus" @click="modifyRole('add')">新增角色</el-button>
        </el-row>
        <el-table header-cell-class-name="user-table-header" :data="roleTableData" tooltip-effect="dark" stripe>
          <el-table-column type="index" label="序号" width="55" />
          <el-table-column prop="roleName" label="角色名称" />
          <el-table-column prop="roleCode" label="角色代码" />
          <el-table-column prop="roleTypeName" label="类型" />
          <el-table-column prop="remark" label="备注" />
          <el-table-column prop="userCounts" width="100" label="用户数" align="center" />
          <!--<el-table-column prop="validInd" label="是否有效" width="160">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.validInd"
                active-value="1"
                inactive-value="0"
                disabled="disabled"
                active-color="#13ce66"
                inactive-color="#ff4949"></el-switch>
            </template>
          </el-table-column>-->
          <el-table-column label="操作" width="150px">
            el-icon-circle-plus-outline
            <template slot-scope="scope">
              <span
                title="人员管理"
                style="padding: 10px; cursor: pointer; color: #5683bf;"
                @click="
                  dialogRoleData = scope.row;
                  showUserDialog = true;
                ">
                <svg class="svg-icon">
                  <use xlink:href="#icon-user-config" />
                </svg>
              </span>
              <span title="复制添加" style="padding: 10px; cursor: pointer; color: #5683bf;" @click="modifyRole('copy', scope.row)">
                <i class="el-icon-tickets"></i>
              </span>
              <span title="编辑" style="padding: 10px; cursor: pointer; color: #5683bf;" @click="modifyRole('edit', scope.row)">
                <i class="el-icon-edit"></i>
              </span>
              <span title="删除" style="padding: 10px; cursor: pointer; color: red;" @click="deleteThisRole(scope.row)"><i class="el-icon-delete"></i></span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
        :current-page.sync="queryRole.pageNum"
        background
        :page-sizes="[10, 20, 30, 50]"
        :page-size.sync="queryRole.pageSize"
        style="width: 100%; text-align: right; margin-top: 20px"
        layout="total,  prev, pager, next, sizes, jumper"
        :total="totalCount"
        @current-change="queryRoleList"
        @size-change="
        queryRole.pageNum = 1;
        queryRoleList();
        "/>
      </div>
    </div>
    <edit-role
      v-model="showRoleDialog"
      :type="dialogModel"
      :role-data="dialogRoleData"
      :tree-data="userTaskTree"
      :organ-filter-data="organFilterList"
      @role-edit-close="
        queryRole.pageNum = 1;
        queryRoleList();
      "
    ></edit-role>
    <manage-user
      v-model="showUserDialog"
      :role-data="dialogRoleData"
      @add-user-close="
        queryRole.pageNum = 1;
        queryRoleList();
      "
    ></manage-user>
  </div>
</template>

<script>
import editRole from "../role/model/edit-role";
import manageUser from "../role/model/manage-user";
export default {
  name: "RoleQuery",
  components: {
    editRole,
    manageUser
  },
  data() {
    return {
      userTaskTree: [],
      organFilterList: [],
      userComTree: [],
      showUserDialog: false,
      showRoleDialog: false,
      dialogRoleData: {},
      dialogModel: null,
      queryLoading: false,
      roleTableData: [],
      totalCount: null,
      queryRole: {
        pageNum: 1,
        pageSize: 10,
        roleCode: null,
        roleName: null
      },
      pageParams: {
        "requestUrl": this.$axios.config.role.baseURL + this.$axios.config.role.queryByPage,
        "requestType": "POST",
        "requestBody": ""
      },
      rules: {}
    };
  },
  mounted() {
    this.queryRoleList();
    this.queryOrganFilterList();
    this.getTaskTree();
  },
  methods: {
    queryRoleList() {
      this.pageParams.requestBody = JSON.stringify(this.queryRole)
      this.queryLoading = true;
      this.$axios
        .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, this.pageParams)
        .then(response => {
          if (JSON.parse(response.data.responseStr).success) {
            this.roleTableData = JSON.parse(response.data.responseStr).result.dataList;
            this.totalCount = JSON.parse(response.data.responseStr).result.totalCount;
          } else {
            this.$message.error(JSON.parse(response.data.responseStr).msg);
          }
        })
        .finally(() => {
          this.queryLoading = false;
        });
    },
    //获取默认权限配置
    queryOrganFilterList() {
      let param = {
        "requestUrl": this.$axios.config.role.baseURL + this.$axios.config.role.queryOrganFilterList,
        "requestType": "GET",
      }
      this.$axios
        .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, param)
        .then(response => {
          if (JSON.parse(response.data.responseStr).success) {
            this.organFilterList = JSON.parse(response.data.responseStr).result;
          } else {
            this.$message.error(JSON.parse(response.data.responseStr).msg);
          }
        });
    },
    // 增 修改  复制角色调用dialog的方法
    modifyRole(model, data) {
      if (!model) return;
      this.dialogModel = model;
      this.dialogRoleData = data ? data : {};
      this.showRoleDialog = true;
    },
    // 获取用户的taskTree
    getTaskTree() {
      // const theUserCode = JSON.parse(localStorage.getItem("userInfo")).userCode;
      /*let parentId = '/menu5acfcbb1cfbc4c3e9247db3325210b06';
      let param = {
        "requestUrl": this.$axios.config.menu.baseUrl + this.$axios.config.menu.queryMenuByParentId + parentId,
        "requestType": "GET"
      }*/
      let params = {
        "requestUrl": this.$axios.config.menu.baseUrl + this.$axios.config.menu.queryAll,
        "requestType": "GET"
      }
      this.$axios
        .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, params)
        .then(response => {
        if (JSON.parse(response.data.responseStr).success) {
          this.userTaskTree = JSON.parse(response.data.responseStr).result;
        } else {
          this.$message.error(JSON.parse(response.data.responseStr).msg);
        }
      });
    },
    // 删除role信息
    deleteThisRole(data) {
      if (data.userCounts > 0) {
        this.$message.error("请先解除该角色所有用户");
        return;
      }
      this.$confirm('此操作将永久删除该行数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let param = {
          "requestUrl": this.$axios.config.role.baseURL + this.$axios.config.role.deletById,
          "requestType": "POST",
          "requestBody": JSON.stringify({roleId: data.roleId})
        }
        this.queryLoading = true;
        this.$axios
          .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, param)
          .then(response => {
            if (JSON.parse(response.data.responseStr).success) {
              this.$message.success("角色删除成功！");
              this.queryRoleList();
            } else {
              this.$message.error(JSON.parse(response.data.responseStr).msg);
            }
          })
          .finally(() => {
            // this.queryLoading = false;
          });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    resetRoleForm(formName) {
      this.$refs[formName].resetFields();
      this.queryRoleList();
    }
  }
};
</script>

<style>
.user-table-header {
  border-top: 2px solid #ebeef5;
  border-bottom: 2px solid #ebeef5 !important;
}
</style>
