<template>
  <div v-loading="queryLoading">
    <h2 style="background: #f8fbff;font-size: 14px;padding: 10px;margin-bottom: 0;">角色管理</h2>
    <div style="background: #fff; padding-top: 10px">
      <el-form ref="roleForm" :model="queryRole" :rules="rules" label-width="30%" style=" border-bottom: 1px solid #eee;">
        <el-row>
          <el-col :span="8">
            <el-form-item label="角色代码" prop="roleCode">
              <el-input v-model="queryRole.roleCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="queryRole.roleName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button style="margin-left: 20px" type="primary" @click="queryRoleList">查询</el-button>
            <el-button @click="resetRoleForm('roleForm')">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div style="padding: 20px">
        <el-row>
          <el-button type="primary" icon="el-icon-circle-plus" @click="modifyRole('add')">新增</el-button>
        </el-row>
        <el-table :data="roleTableData" tooltip-effect="dark" stripe>
          <el-table-column type="index" label="序号" width="55" />
          <el-table-column prop="roleCode" label="角色代码" />
          <el-table-column prop="roleName" label="角色名称" />
          <el-table-column prop="remark" label="备注" />
          <el-table-column prop="validInd" label="是否有效" width="160">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.validInd"
                active-value="1"
                inactive-value="0"
                disabled="disabled"
                active-color="#13ce66"
                inactive-color="#ff4949"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px">
            <template slot-scope="scope">
              <span title="复制" style="padding: 10px; cursor: pointer; color: #5683bf;" @click="modifyRole('copy', scope.row)">
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
          :current-page.sync="queryRole._pageNo"
          background
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="queryRole._pageSize"
          style="width: 100%; text-align: right; margin-top: 20px"
          layout="total,  prev, pager, next, sizes, jumper"
          :total="totalCount"
          @current-change="queryRoleList"
          @size-change="
            queryRole._pageNo = 1;
            queryRoleList();
          "/>
      </div>
    </div>
    <edit-role
      v-model="showRoleDialog"
      :model="dialogModel"
      :role-data="dialogRoleData"
      :tree-data="userTaskTree"
      @role-edit-close="
        queryRole._pageNo = 1;
        queryRoleList();
      "
    ></edit-role>
  </div>
</template>

<script>
import editRole from "../role/model/edit-role";
export default {
  name: "RoleQuery",
  components: {
    editRole
  },
  data() {
    return {
      userTaskTree: null,
      showRoleDialog: false,
      dialogRoleData: {},
      dialogModel: null,
      queryLoading: false,
      roleTableData: [],
      totalCount: null,
      queryRole: {
        _pageNo: 1,
        _pageSize: 10,
        roleCode: null,
        roleName: null
      },
      rules: {}
    };
  },
  mounted() {
    this.getTaskTree();
  },
  methods: {
    queryRoleList() {
      this.queryLoading = true;
      this.$axios
        .post(
          this.$axios.config.saa.baseURL + this.$axios.config.saa.roleListAll.format({ _pageNo: this.queryRole._pageNo, _pageSize: this.queryRole._pageSize }),
          this.queryRole
        )
        .then(response => {
          this.roleTableData = response.data.data.data;
          this.totalCount = response.data.data.totalCount;
        })
        .finally(() => {
          this.queryLoading = false;
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
      const theUserCode = JSON.parse(localStorage.getItem("userInfo")).userCode;
      this.$axios.get(this.$axios.config.saa.baseURL + this.$axios.config.saa.taskTreeWithUser.format({ userCode: theUserCode })).then(response => {
        this.userTaskTree = response.data.data;
      });
    },
    // 删除role信息
    deleteThisRole(data) {
      this.queryLoading = true;
      this.$axios
        .delete(this.$axios.config.saa.baseURL + this.$axios.config.saa.deleteRole, {
          data: [data.roleCode]
        })
        .then(response => {
          if (response.data.status === 0) {
            this.$message.success("角色删除成功！");
            this.queryRoleList();
          }
        })
        .finally(() => {
          this.queryLoading = false;
        });
    },
    resetRoleForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped></style>
