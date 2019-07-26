<template>
  <div v-loading="queryLoading">
    <h2 style="background: #f8fbff;font-size: 14px;padding: 10px;margin-bottom: 0;">客户权益查询</h2>
    <div style="background: #fff; padding-top: 10px">
      <el-form ref="userForm" :model="pagerQuery" label-width="30%" style=" border-bottom: 1px solid #eee;">
        <el-row>
          <el-col :span="6">
            <el-form-item label="省份" prop="provice">
              <!--<tree-select
                v-model="pagerQuery.reserve1"
                node-key="areaId"
                :remote-method="comQuery"
                :props="{
                  children: 'subList',
                  value: 'areaId',
                  label: 'areaName'
                }"></tree-select>-->
              <el-select v-model="pagerQuery.provice" style="width: 100%">
                <el-option v-for="para in subList" :key="para.areaId" :label="para.areaName" :value="para.areaId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户等级" prop="viplevel">
              <el-select v-model="pagerQuery.viplevel" style="width: 100%">
                <el-option v-for="para in levelTypeLists" :key="para.key" :label="para.value" :value="para.key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="服务类型" prop="serviceType">
              <el-select v-model="pagerQuery.serviceType" style="width: 100%">
                <el-option label="税费代缴" :value="'1'"></el-option>
                <el-option label="待办年审" :value="'2'"></el-option>
                <el-option label="维修接送" :value="'3'"></el-option>
                <el-option label="非事故道路救援" :value="'4'"></el-option>
                <el-option label="拖车服务" :value="'5'"></el-option>
                <el-option label="机场接送" :value="'6'"></el-option>
                <el-option label="酒后代驾" :value="'7'"></el-option>
                <el-option label="理赔代步" :value="'8'"></el-option>
                <el-option label="停车秘书" :value="'9'"></el-option>
                <el-option label="安全检测" :value="'10'"></el-option>
              </el-select>
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
          <el-table-column prop="areaName" label="省份" />
          <el-table-column prop="levelTypeName" label="客户级别" />
          <el-table-column prop="serverTypeName" label="服务类型"></el-table-column>
          <el-table-column prop="supplierName" label="代理商"></el-table-column>
          <el-table-column prop="isDefault" label="是否默认"></el-table-column>
          <el-table-column prop="serverNumber" label="服务次数"></el-table-column>
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
        pagerQuery.pageNum = 1;
        queryData();
      "></edit-user>
  </div>
</template>

<script>
import editUser from "../rightsAndInterests/model/edit-rightsAndInterests.vue";
import TreeSelect from "../../../components/tree-select";
export default {
  components: {
    editUser,
    TreeSelect
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
        provice: null,
        viplevel: null,
        serviceType: null,
        pageNum: 1,
        pageSize: 10
      },
      editData: {},
      editDialogVisible: false,
      editStatus: "",
      levelTypeLists: [],
      subList: []
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
    /*var url = this.$axios.config.permissionConfig.baseURL + this.$axios.config.permissionConfig.getAllpolicyPermissionConfig;
      this.$axios.get(url)
      .then(response => {
        this.tableData = response.data.result;
      });*/
    this.$axios
      .post(this.$axios.config.rightsAndInterests.baseURL + this.$axios.config.rightsAndInterests.queryAllByParamsNew, this.pagerQuery)
      .then(response => {
        this.tableData = response.data.result.dataList;
        this.totalCount = response.data.result.totalCount;
      });
    var urls = this.$axios.config.permissionConfig.baseURL + this.$axios.config.permissionConfig.findInitInfo;
    this.$axios.get(urls).then(response => {
      (this.subList = response.data.result.customerAreas), (this.levelTypeLists = response.data.result.levelTypeList);
    });
  },
  methods: {
    queryData() {
      this.queryLoading = true;
      /*this.$axios
        .get(this.$axios.config.permissionConfig.baseURL + this.$axios.config.permissionConfig.getAllBypolicyPermissionConfig, {
          params: {
            _pageNum: this.pagerQuery.pageNum,
            _pageSize: this.pagerQuery.pageSize
          }
        })
        .then(response => {
          this.tableData = response.data.result;
          this.totalCount = response.data.totalCount;
        })
        .finally(() => {
          this.queryLoading = false;
        });*/
      this.$axios
        .post(this.$axios.config.rightsAndInterests.baseURL + this.$axios.config.rightsAndInterests.queryAllByParamsNew, this.pagerQuery)
        .then(response => {
          this.tableData = response.data.result.dataList;
          this.totalCount = response.data.result.totalCount;
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
        this.$message.warning("请您选中需要删除的数据后再进行操作");
        return;
      }
      let needDelUser = [];
      this.tableSelection.forEach(select => {
        // needDelUser.push(select.interestsId);
        needDelUser.push(select);
      });
      this.queryLoading = true;
      this.$axios
        .delete(this.$axios.config.rightsAndInterests.baseURL + this.$axios.config.rightsAndInterests.deleteInBatch, {
          data: { rightsAndInterests: JSON.stringify(needDelUser) }
        })
        .then(response => {
          if (response.data.success) {
            this.$message.success("数据删除成功！");
            this.queryData();
          } else {
            this.$message.error(response.data.statusText);
          }
        })
        .finally(() => {
          this.queryLoading = false;
        });
    }
    /*comQuery(node) {
      return new Promise(resolve => {
        this.$axios
          .get(this.$axios.config.permissionConfig.baseURL + this.$axios.config.permissionConfig.findInitInfo)
          .then(response => {
            resolve({ subList: response.data.result.customerAreas});
          });
      });
    }*/
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
