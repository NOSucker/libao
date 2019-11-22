<template>
  <div>
    <el-dialog
      v-loading="queryLoading1"
      custom-class="user-role"
      :title="editDialogTitle"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="80%"
      @open="dialogOpen"
    >
      <div style="background: #fff; padding-top: 10px">
        <div style="padding: 20px">
          <el-row style="margin-bottom: 15px;">
            <el-button type="primary" icon="el-icon-plus" @click="userButtonClick">
              新增
            </el-button>
            <el-button type="danger" :disabled="deleteDisabled" icon="el-icon-delete" @click="deleteUser">
              删除
            </el-button>
          </el-row>
          <el-table
            header-cell-class-name="user-table-header"
            :data="tableData"
            :default-sort="{ prop: 'priority', order: 'ascending' }"
            tooltip-effect="dark"
            stripe
            @selection-change="tableSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="roleCode" label="角色代码" />
            <el-table-column prop="roleName" label="角色名称" />
            <el-table-column prop="priority" label="优先级" sortable />
            <el-table-column prop="deadLine" label="过期时间">
              <template slot-scope="scope">
                {{ scope.row.deadLine | dataFilter("yyyy-MM-dd hh:mm:ss") }}
                <el-button v-if="!scope.row.deadLine" size="mini" icon="el-icon-date" @click="setDiologDate(scope.row)"></el-button>
              </template>
            </el-table-column>
            <el-table-column prop="priority" label="调整优先级">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.$index == 0 && pagerQuery.pageNum == 1 ? false : true"
                  size="mini"
                  icon="el-icon-arrow-up"
                  @click="upPriority(scope.row)"></el-button>
                <el-button
                  v-if="
                    scope.$index == 0 && pagerQuery.pageNum == 1
                      ? true
                      : false && pagerQuery.pageNum == (totalCount % 10 == 0 ? totalCount / 10 : Math.floor(totalCount / 10) + 1)
                      ? false
                      : true && totalCount % 10 == 0
                      ? scope.$index == 9
                        ? false
                        : true
                      : scope.$index == (totalCount % 10) - 1
                      ? false
                      : true
                  "
                  size="mini"
                  icon="el-icon-arrow-down"
                  @click="downPriority(scope.row)"
                ></el-button>
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
            @current-change="queryRoleData"
            @size-change="
              pagerQuery.pageNum = 1;
              queryRoleData();
            "/>
        </div>
      </div>
    </el-dialog>
    <insert-role
      v-model="editDialogVisiblel"
      :get-user-id="roleUserData"
      @role-user-close="
        pagerQuery.pageNum = 1;
        editDialogVisiblel = false;
        queryRoleData();
      "
    ></insert-role>
    <dialog-date
      v-model="dialogDate"
      :user-role-id="dateData"
      @role-date-close="
        pagerQuery.pageNum = 1;
        dialogDate = false;
        queryRoleData();
      "
    ></dialog-date>
  </div>
</template>

<script>
import insertRole from "./insert-role";
import dialogDate from "./dialog-date";
export default {
  components: {
    insertRole,
    dialogDate
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
  props: {
    clickParam: Boolean,
    value: Boolean,
    type: String,
    roleUserData: Object
  },
  data() {
    return {
      value1: null,
      dateData: null,
      tableData: [],
      tableSelection: [],
      totalCount: 0,
      queryLoading1: false,
      pagerQuery: {
        userId: null,
        pageNum: 1,
        pageSize: 10
      },
      editDialogTitle: "",
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
      userQueryRoleParams: {
        requestUrl: this.$axios.config.user.baseURL + this.$axios.config.user.userRoleQuery,
        requestType: "POST",
        requestBody: ""
      },

      editData: {},
      editDialogVisiblel: false,
      dialogDate: false,
      editStatus: ""
      //scope:null
    };
  },
  computed: {
    editDisabled() {
      return this.tableSelection.length != 1;
    },
    deleteDisabled() {
      return this.tableSelection.length < 1;
    },
    showDialog: {
      set(val) {
        this.$emit("input", val);
        this.$refs.editForm.clearValidate();
      },
      get() {
        return this.value;
      }
    }
  },
  mounted() {},
  methods: {
    setDiologDate(data) {
      console.log(8584455124, data);
      this.dialogDate = true;
      this.dateData = data.userRoleId;
    },

    upPriority(data) {
      console.log(7774474744, data);
      let upParams = {
        requestUrl: this.$axios.config.user.baseURL + this.$axios.config.user.upPriority,
        requestType: "POST",
        requestBody: JSON.stringify(data)
      };
      this.queryLoading1 = true;
      this.$axios
        .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, upParams)
        .then(response => {
          console.log(11111111, response);
          if (JSON.parse(response.data.responseStr).errorCode == 200) {
            this.$message.success("提升成功！");
            this.queryRoleData();
          } else {
            this.$message.error(JSON.parse(response.data.responseStr).msg);
          }
        })
        .finally(() => {
          this.queryLoading1 = false;
        });
    },
    downPriority(data) {
      console.log(7774474744, data);
      let upParams = {
        requestUrl: this.$axios.config.user.baseURL + this.$axios.config.user.lowPriority,
        requestType: "POST",
        requestBody: JSON.stringify(data)
      };
      this.queryLoading1 = true;
      this.$axios
        .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, upParams)
        .then(response => {
          console.log(11111111, response);
          if (JSON.parse(response.data.responseStr).errorCode == 200) {
            this.$message.success("降低成功！");
            this.queryRoleData();
          } else {
            this.$message.error(JSON.parse(response.data.responseStr).msg);
          }
        })
        .finally(() => {
          this.queryLoading1 = false;
        });
    },

    queryRoleData() {
      this.queryLoading1 = true;
      this.pagerQuery.userId = this.roleUserData.userId;
      this.userQueryRoleParams.requestBody = JSON.stringify(this.pagerQuery);
      this.$axios
        .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, this.userQueryRoleParams)
        .then(response => {
          this.tableData = JSON.parse(response.data.responseStr).result.dataList;
          this.totalCount = JSON.parse(response.data.responseStr).result.totalCount;
        })
        .finally(() => {
          this.queryLoading1 = false;
        });
    },
    tableSelectionChange(selection) {
      this.tableSelection = selection;
    },
    userButtonClick() {
      this.editDialogVisiblel = true;
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
            needDelUser.push(select.roleId);
          });
          let param = {
            userId: this.roleUserData.userId,
            roleIds: needDelUser
          };
          console.log(333212212, needDelUser);
          console.log(8811111111, param);
          let delParams = {
            requestUrl: this.$axios.config.user.baseURL + this.$axios.config.user.deleteSelectUserRole,
            requestType: "POST",
            requestBody: JSON.stringify(param)
          };
          this.queryLoading1 = true;
          this.$axios
            .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, delParams)
            .then(response => {
              console.log(11111111, response);
              if (JSON.parse(response.data.responseStr).success) {
                this.$message.success("数据删除成功！");
                this.queryRoleData();
              } else {
                this.$message.error(JSON.parse(response.data.responseStr).msg);
              }
            })
            .finally(() => {
              this.queryLoading1 = false;
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
    },
    dialogOpen() {
      this.postData = {};
      if (this.type === "role") {
        this.editDialogTitle = "角色";
      } else {
        this.editDialogTitle = "工号";
      }
      this.queryRoleData();
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
