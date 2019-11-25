<template>
  <div v-loading="queryLoading">
    <h2 style="background: #f8fbff;font-size: 14px;padding: 10px;margin-bottom: 0;">清除用户</h2>
    <div style="background: #fff; padding-top: 10px">
      <div style="padding: 20px">
       <!-- <el-row style="margin-bottom: 15px;">
          <el-button type="danger" :disabled="deleteDisabled" icon="el-icon-delete" @click="deleteUser">
            剔除
          </el-button>
        </el-row>-->
        <el-table header-cell-class-name="user-table-header" :data="tableData" tooltip-effect="dark" stripe @selection-change="tableSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="theNumber" label="序号" />
          <el-table-column prop="userCode" label="用户代码" />
          <el-table-column prop="userName" label="用户名" />
          <el-table-column prop="lastLoginDate" label="最后一次登录时间">
            <template slot-scope="scope">
              {{ scope.row.lastLoginDate | dataFilter("yyyy年MM月dd日 hh时mm分ss秒") }}
            </template>
          </el-table-column>
      <el-table-column label="剔除" width="150px">
        <template >
          <el-button
            size="mini"
            icon="el-icon-remove"
            @click="deleteUser"></el-button>
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
  </div>
</template>

<script>
  export default {
    components: {
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
        allSelect: {
          value: []
        },
        clickParam: false, //用于点击角色查询当前用户的角色
        value1: null,
        tableData: [],
        tableSelection: [],
        totalCount: 0,
        queryLoading: false,
        pagerQuery: {
          pageNum: 1,
          pageSize: 10
        },
        queryAllUserIsOnline: {
          requestUrl: this.$axios.config.user.baseURL + this.$axios.config.user.queryAllUserIsOnline,
          requestType: "POST",
          requestBody: ""
        },

        userDeleteParams: {
          requestUrl: this.$axios.config.user.baseURL + this.$axios.config.user.userDelete,
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
        this.queryAllUserIsOnline.requestBody = JSON.stringify(this.pagerQuery);
        this.$axios
          .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, this.queryAllUserIsOnline)
          .then(response => {
            this.tableData = JSON.parse(response.data.responseStr).result.dataList;
            this.totalCount = JSON.parse(response.data.responseStr).result.totalCount;
          })
          .finally(() => {
            this.queryLoading = false;
          });
      },
      tableSelectionChange(selection) {
        this.tableSelection = selection;
      },
      deleteUser() {
        this.$confirm("此操作将使所选用户强制下线, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
          .then(() => {
            if (this.tableSelection.length < 1) {
              this.$message.warning("请您选中需要下线的用户后再进行操作");
              return;
            }
            let needDelUser = [];
            this.tableSelection.forEach(select => {
              needDelUser.push(select.userLoginStatusId);
            });
            this.allSelect.value=needDelUser;
            let delParams = {
              requestUrl: this.$axios.config.user.baseURL + this.$axios.config.user.setUserLoginStatus,
              requestType: "POST",
              requestBody: JSON.stringify(this.allSelect)
            };
            console.log(5252555514,delParams.requestBody);
            this.queryLoading = true;
            this.$axios
              .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, delParams)
              .then(response => {
                if (JSON.parse(response.data.responseStr).success) {
                  this.$message.success("用户下线成功！");
                  this.queryData();
                } else {
                  this.$message.error(JSON.parse(response.data.responseStr).msg);
                }
              })
              .finally(() => {
                this.queryLoading = false;
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消清除"
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
