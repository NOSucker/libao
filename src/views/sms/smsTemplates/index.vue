<template>
  <div v-loading="queryLoading">
    <h2 style="background: #f8fbff;font-size: 14px;padding: 10px;margin-bottom: 0;">短信模板配置</h2>
    <div style="background: #fff; padding-top: 10px">
      <el-form ref="userForm" :model="pagerQuery" label-width="30%" style=" border-bottom: 1px solid #eee;">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="短信主题" prop="smsTheme">
              <el-input v-model="pagerQuery.smsTheme" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建人" prop="createPerson">
              <el-input v-model="pagerQuery.createPerson" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="部门" prop="field1">
              <el-select v-model="pagerQuery.field1" id="firstStatus" style="width: 100%" @change="setSecondStatus">
                <el-option v-for="para in smsTemplateConfigs" :key="para.id" :label="para.showName" :value="para.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="类型" prop="field2">
              <el-select v-model="pagerQuery.field2" id="secondStatus" style="width: 100%" @change="setThirdStatus">
                   <el-option v-for="para in smsTemplateConfigsTwo" :key="para.id" :label="para.showName" :value="para.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="小项" prop="field3">
              <el-select v-model="pagerQuery.field3" style="width: 100%">
                 <el-option v-for="para in smsTemplateConfigsThree" :key="para.id" :label="para.showName" :value="para.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6"></el-col>
        </el-row>
        <el-row :gutter="24">
           <el-col :span="18">
            <el-form-item label="短信内容" prop="smsContent" label-width="9.5%">
              <el-input type="textarea"  :rows="2" placeholder="请输入内容"  v-model="pagerQuery.smsContent"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button style="margin-left: 20px;margin-top:18px;" type="primary" @click="queryData">查询</el-button>
            <el-button @click="resetAndQueryData">重置</el-button>
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
          <el-table-column prop="smsTheme" label="短信主题" />
          <el-table-column prop="smsContent" label="短信内容" />
          <el-table-column prop="createPerson" label="创建人"></el-table-column>
          <el-table-column prop="createDete" label="创建时间"></el-table-column>
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
import editUser from "../smsTemplates/model/edit-smsTemplates.vue";
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
        areaCode: null,
        levelTypeCode: null,
        serverTypeCode: null,
        pageNum: 1,
        pageSize: 10
      },
      pageParams: {
        "requestUrl": this.$axios.config.smsTemplates.baseURL + this.$axios.config.smsTemplates.queryAll,
        "requestType": "POST",
        "requestBody": ""
      },
      initParams: {
        "requestUrl": this.$axios.config.smsTemplates.baseURL + this.$axios.config.smsTemplates.findInitInfo,
        "requestType": "GET"
      },
      oldurl:this.$axios.config.smsTemplates.baseURL + this.$axios.config.smsTemplates.findInitInfo,
      editData: {},
      editDialogVisible: false,
      editStatus: "",
      smsTemplateConfigs: [],
      smsTemplateConfigsTwo:[],
      smsTemplateConfigsThree:[]
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
  
    if (this.$store.state.usercode || this.$router.app.$router.currentRoute.query.usercode) {
      //将带过来的user参数写进vuex状态管理器
      if (this.$router.app.$router.currentRoute.query.usercode) {
        this.$store.state.usercode = this.$router.app.$router.currentRoute.query.usercode;
      }

      //查询数据
      this.pageParams.requestBody = JSON.stringify(this.pagerQuery);
      this.$axios
        .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, this.pageParams)
        .then(response => {
          this.tableData = JSON.parse(response.data.responseStr).result.dataList;
          this.totalCount = JSON.parse(response.data.responseStr).result.totalCount;
        });
      let urls = this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface;
      this.initParams.requestUrl = this.oldurl+"/root";
      this.$axios.post(urls, this.initParams).then(response => {
        (this.smsTemplateConfigs = JSON.parse(response.data.responseStr).result);
      });
    } else {
      this.$router.push({path: '/unlogun'})
    }
  },
  methods: {
    
    /*
    * 查询
    * */
    queryData() {
       if(this.pagerQuery!=null && this.pagerQuery.smsContent!=null){
        this.pagerQuery.smsContent = this.pagerQuery.smsContent.toString();
      }
      this.pageParams.requestBody = JSON.stringify(this.pagerQuery);
      this.queryLoading = true;
     
      this.$axios
        .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, this.pageParams)
        .then(response => {
          this.tableData = JSON.parse(response.data.responseStr).result.dataList;
          this.totalCount = JSON.parse(response.data.responseStr).result.totalCount;
        })
        .finally(() => {
          this.queryLoading = false;
        });
    },
    /*
    * 重置
    * */
    resetAndQueryData() {
      this.$refs.userForm.resetFields();
      this.queryData();
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
      this.$confirm('此操作将永久删除所选数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {

        if (this.tableSelection.length < 1) {
          this.$message.warning("请您选中需要删除的数据后再进行操作");
          return;
        }
        let needDelUser = [];
        this.tableSelection.forEach(select => {
          needDelUser.push(select.smsId);
        });
        let delParams = {
          "requestUrl": this.$axios.config.smsTemplates.baseURL + this.$axios.config.smsTemplates.deleteInBatch,
          "requestType": "DELETE",
          "requestBody": needDelUser
        }
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    setSecondStatus(val) {
      let urls = this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface;
      this.initParams.requestUrl = this.oldurl+"/"+val;
      this.$axios.post(urls, this.initParams).then(response => {
        (this.smsTemplateConfigsTwo = JSON.parse(response.data.responseStr).result);
       // this.setThirdStatus(document.getElementById("secondStatus").value);
      });
    },
    setThirdStatus(val){
      let urls = this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface;
      this.initParams.requestUrl = this.oldurl+"/"+val;
      this.$axios.post(urls, this.initParams).then(response => {
        (this.smsTemplateConfigsThree = JSON.parse(response.data.responseStr).result);
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
