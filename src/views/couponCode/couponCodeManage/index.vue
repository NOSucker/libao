<template>
  <div v-loading="queryLoading">
    <h2 style="background: #f8fbff;font-size: 14px;padding: 10px;margin-bottom: 0;">券码管理</h2>
    <div style="background: #fff; padding-top: 10px">
      <el-form ref="userForm" :model="pagerQuery" label-width="30%" style=" border-bottom: 1px solid #eee;">
        <el-row>
          <el-col :span="6">
            <el-form-item label="券码" prop="couponCode">
              <el-input v-model="pagerQuery.couponCode" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="适用分公司" prop="branch">
              <el-select v-model="pagerQuery.branch" clearable style="width: 100%">
                <el-option v-for="para in branch" :key="para.key" :label="para.value" :value="para.key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="代理商" prop="agent">
              <el-select v-model="pagerQuery.agent" clearable style="width: 100%">
                <el-option v-for="para in agent" :key="para.key" :label="para.value" :value="para.key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="券码类型" prop="couponCodeType">
              <el-select v-model="pagerQuery.couponCodeType" clearable style="width: 100%">
                <el-option v-for="para in couponCodeType" :key="para.key" :label="para.value" :value="para.key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!--    <el-col :span="6">
            <el-form-item label="有效日期始" prop="registerDate">
              <el-date-picker v-model="pagerQuery.registerDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="有效日期止" prop="expirationDate">
              <el-date-picker v-model="pagerQuery.expirationDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%"></el-date-picker>
            </el-form-item>
          </el-col>-->
          <el-col :span="6">
            <el-form-item label="领用人" prop="receiverName">
              <el-input v-model="pagerQuery.receiverName" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="批次号" prop="batchId">
              <el-input v-model="pagerQuery.batchId" clearable></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-button style="margin-left: 100px" type="primary" @click="queryData">查询</el-button>
            <el-button @click="$refs.userForm.resetFields()">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div style="padding: 20px">
        <el-table header-cell-class-name="user-table-header" :data="tableData" tooltip-effect="dark" stripe @selection-change="tableSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="couponCode" label="券码" />
          <el-table-column prop="applicableBranch" label="适用分公司" />
          <el-table-column prop="agentCode" label="代理商" />
          <el-table-column prop="couponType" label="券码类型" />
          <el-table-column prop="receiverName" label="领用人" />
          <el-table-column prop="batchId" label="批次号" width="120" />
          <el-table-column prop="startTime" label="有效日期始" width="120">
            <template slot-scope="scope">
              {{ scope.row.startTime | dataFilter("yyyy年MM月dd日") }}
            </template>
          </el-table-column>
          <el-table-column prop="endTime" label="有效日期止" width="120">
            <template slot-scope="scope">
              {{ scope.row.endTime | dataFilter("yyyy年MM月dd日") }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px">
            <template slot-scope="scope">
              <span title="详细信息" style="padding: 10px; cursor: pointer; color: #5683bf;" @click="userButtonClick('query', scope.row)">
                <i class="el-icon-info"></i>
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
    <edit-coupon-code
      v-model="editDialogVisible"
      :type="editStatus"
      :user-data="editData"
      @role-edit-close="
        pagerQuery._pageNo = 1;
        queryData();
      "
    ></edit-coupon-code>
  </div>
</template>

<script>
import editCouponCode from "../couponCodeManage/model/edit-couponCode";

export default {
  components: {
    editCouponCode
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
        couponCode: null,
        agent: null,
        branch: null,
        receiverName: null,
        registerDate: null,
        expirationDate: null,
        couponCodeType: null,
        batchId: null,
        pageNum: 1,
        pageSize: 10
      },
      userAddParams: {
        requestUrl: this.$axios.config.user.baseURL + this.$axios.config.user.userAdd,
        requestType: "POST",
        requestBody: ""
      },
      couponCodeQueryParams: {
        requestUrl: this.$axios.config.couponCodeManage.baseURL + this.$axios.config.couponCodeManage.queryAllCouponCode,
        requestType: "POST",
        requestBody: ""
      },

      userDeleteParams: {
        requestUrl: this.$axios.config.user.baseURL + this.$axios.config.user.userDelete,
        requestType: "POST",
        requestBody: ""
      },

      branch: [], //分公司
      agent: [], //代理商
      couponCodeType: [], //券码类型

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
    //券码类型
    let couponCodeTypeQuery = {
      requestUrl: this.$axios.config.couponCodeManage.baseURL + this.$axios.config.couponCodeManage.queryCouponCodeType,
      requestType: "GET"
    };
    //代理商
    let agentQuery = {
      requestUrl: this.$axios.config.couponCodeManage.baseURL + this.$axios.config.couponCodeManage.queryAgent,
      requestType: "GET"
    };
    //适用分公司
    let branchQuery = {
      requestUrl: this.$axios.config.couponCodeManage.baseURL + this.$axios.config.couponCodeManage.queryBranch,
      requestType: "GET"
    };
    let urls = this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface;

    //券码类型
    this.$axios.post(urls, couponCodeTypeQuery).then(response => {
      this.couponCodeType = JSON.parse(response.data.responseStr).result;
    });
    //代理商
    this.$axios.post(urls, agentQuery).then(response => {
      this.agent = JSON.parse(response.data.responseStr).result;
    });
    //适用分公司
    this.$axios.post(urls, branchQuery).then(response => {
      this.branch = JSON.parse(response.data.responseStr).result;
    });

    this.queryData(); //一进来就查询所有数据
  },
  methods: {
    queryData() {
      this.queryLoading = true;
      this.couponCodeQueryParams.requestBody = JSON.stringify(this.pagerQuery);
      console.log(624548877, this.couponCodeQueryParams.requestBody);
      this.$axios
        .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, this.couponCodeQueryParams)
        .then(response => {
          console.log(6521554585555, response);
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
