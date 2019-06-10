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
            <el-button style="margin-left: 20px" type="primary" @click="queryData">查询</el-button>
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
          <el-table-column label="操作" width="150px">
            <template slot-scope="scope">
              <span title="复制" style="padding: 10px; cursor: pointer; color: #5683bf;" @click="userButtonClick('copy', scope.row)">
                <i class="el-icon-tickets"></i>
              </span>
              <span title="编辑" style="padding: 10px; cursor: pointer; color: #5683bf;" @click="userButtonClick('edit', scope.row)">
                <i class="el-icon-edit"></i>
              </span>
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
      </div>
    </div>
    <edit-user
      v-model="editDialogVisible"
      :type="editStatus"
      :user-data="editData"
      @role-edit-close="
        pagerQuery._pageNo = 1;
        queryData();
      "
    ></edit-user>
  </div>
</template>

<script>
import editUser from "../user/model/edit-user";
export default {
  components: {
    editUser
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
      value1: null,
      tableData: [],
      tableSelection: [],
      totalCount: 0,
      queryLoading: false,
      pagerQuery: {
        userCode: null,
        userName: null,
        pageNo: 1,
        pageSize: 10
      },
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
  methods: {
    queryData() {
      this.queryLoading = true;
      this.$axios
        .post(this.$axios.config.saa.baseURL + this.$axios.config.saa.userQuery, this.pagerQuery, {
          params: {
            _pageNo: this.pagerQuery.pageNo,
            _pageSize: this.pagerQuery.pageSize
          }
        })
        .then(response => {
          this.tableData = response.data.data;
          this.totalCount = response.data.totalCount;
        })
        .finally(() => {
          this.queryLoading = false;
        });
    },
    tableSelectionChange(selection) {
      this.tableSelection = selection;
    },
    userButtonClick(type, data) {
      this.editData = data;
      this.editStatus = type;
      this.editDialogVisible = true;
    },
    deleteUser() {
      if (this.tableSelection.length < 1) {
        this.$message.warning("请您选中需要删除的用户后再进行操作");
        return;
      }
      let needDelUser = [];
      this.tableSelection.forEach(select => {
        needDelUser.push(select.userCode);
      });
      this.queryLoading = true;
      this.$axios
        .delete(this.$axios.config.saa.baseURL + this.$axios.config.saa.userDelete, {
          data: needDelUser
        })
        .then(response => {
          if (response.data.status === 0) {
            this.$message.success("角色删除成功！");
            this.queryData();
          } else {
            this.$message.error(response.data.statusText);
          }
        })
        .finally(() => {
          this.queryLoading = false;
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
