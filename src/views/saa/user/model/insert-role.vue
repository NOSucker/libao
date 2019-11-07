<template>
  <div>
    <el-dialog
      v-loading="queryLoading2"
      custom-class="role-insert"
      :visible.sync="showDialogRole"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      width="30%"
      @open="dialogOpenInsert"
    >
      <div style="background: #fff; padding-top: 10px">
        <div style="padding: 20px">
          <el-table header-cell-class-name="user-table-header" :data="tableData" tooltip-effect="dark" stripe @current-change="tableSelectionChange">
            <el-table-column prop="roleCode" label="角色代码" />
            <el-table-column prop="roleName" label="角色名称" />
          </el-table>
        </div>
      </div>
    </el-dialog>
    >
  </div>
</template>

<script>
export default {
  components: {},
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
    getUserId: Object
  },
  data() {
    return {
      // submitLoading: false,
      tableData: [],
      tableSelection: null,
      totalCount: 0,
      queryLoading2: false,
      pagerQuery: null,
      editDialogTitle: "",
      userQueryRoleParams: {
        requestUrl: this.$axios.config.user.baseURL + this.$axios.config.user.userRoleQuery,
        requestType: "POST",
        requestBody: ""
      },

      editData: {},
      editDialogVisiblel: false,
      editStatus: ""
    };
  },
  computed: {
    editDisabled() {
      return this.tableSelection.length != 1;
    },
    deleteDisabled() {
      return this.tableSelection.length < 1;
    },
    showDialogRole: {
      set(val) {
        this.$emit("input", val);
        // this.$refs.editForm.clearValidate();
      },
      get() {
        return this.value;
      }
    }
  },
  mounted() {},
  methods: {
    queryRoleData() {
      this.queryLoading2 = true;
      this.userQueryRoleParams.requestBody = JSON.stringify(this.pagerQuery);
      this.$axios
        .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, this.userQueryRoleParams)
        .then(response => {
          this.tableData = JSON.parse(response.data.responseStr).result.dataList;
          this.totalCount = JSON.parse(response.data.responseStr).result.totalCount;
        })
        .finally(() => {
          this.queryLoading2 = false;
        });
    },
    tableSelectionChange(selection) {
      if (selection) {
        this.tableSelection = selection;
        let PostUsers = null;
        PostUsers = this.tableSelection.roleId;

        let param = {
          userId: this.getUserId.userId,
          roleId: PostUsers
        };
        let addUserRole = {
          requestUrl: this.$axios.config.user.baseURL + this.$axios.config.user.insertUserRole,
          requestType: "POST",
          requestBody: JSON.stringify(param)
        };
        console.log(99995555, param);
        this.$axios
          .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, addUserRole)
          .then(response => {
            console.log(4444411111, response);
            if (JSON.parse(response.data.responseStr).errorCode != 200) {
              this.$message.error(JSON.parse(response.data.responseStr).msg);
            } else {
              this.$message.success("保存成功！");
            }
          })
          .finally(() => {
            //等返回成功后在执行下面判断下
            this.$emit("role-user-close");
            this.$emit("input", false);
          });
      }
    },
    dialogOpenInsert() {
      let userQueryParams = {
        requestUrl: this.$axios.config.user.baseURL + this.$axios.config.user.queryAllRole,
        requestType: "POST",
        requestBody: JSON.stringify(this.getUserId)
      };
      this.queryLoading2 = true;
      //this.userQueryParams.requestBody = JSON.stringify(this.getUserId.userId);
      console.log(9999455, this.getUserId.userId);
      this.$axios
        .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, userQueryParams)
        .then(response => {
          console.log(666363663, response.data.responseStr);
          this.tableData = JSON.parse(response.data.responseStr).result;
        })
        .finally(() => {
          this.queryLoading2 = false;
        });
    },
    submitForm() {
      let PostUsers = [];
      this.tableSelection.forEach(select => {
        PostUsers.push(select.roleId);
      });
      let param = {
        userId: this.getUserId.userId,
        roleIds: PostUsers
      };
      let addUserRole = {
        requestUrl: this.$axios.config.user.baseURL + this.$axios.config.user.insertUserRole,
        requestType: "POST",
        requestBody: JSON.stringify(param)
      };
      console.log(99995555, param);
      this.$axios
        .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, addUserRole)
        .then(response => {
          console.log(4444411111, response);
          if (JSON.parse(response.data.responseStr).errorCode != 200) {
            this.$message.error(JSON.parse(response.data.responseStr).msg);
          } else {
            this.$message.success("保存成功！");
          }
        })
        .finally(() => {
          this.queryLoading2 = false;
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
