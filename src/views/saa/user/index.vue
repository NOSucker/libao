<template>
  <div v-loading="queryLoading">
    <div>
      <el-button type="primary" icon="el-icon-plus" @click="newButtonClick">
        新增
      </el-button>
      <el-button type="primary" :disabled="editDisabled" icon="el-icon-edit" @click="editButtonClick">
        修改
      </el-button>
      <el-button type="danger" :disabled="deleteDisabled" icon="el-icon-delete">
        删除
      </el-button>
    </div>
    <el-table :data="tableData" tooltip-effect="dark" stripe @selection-change="tableSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="userCode" label="用户代码" width="120" />
      <el-table-column prop="userName" label="用户名称" width="120" />
      <el-table-column prop="comCode" label="组织机构代码" width="180" />
      <el-table-column prop="comCName" label="组织机构名称" />
      <el-table-column prop="regTime" label="注册时间" width="160">
        <template slot-scope="scope">
          {{ new Date(scope.row.regTime).format("yyyy年MM月dd日") }}
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" show-overflow-tooltip />
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
    <el-dialog
      v-loading="submitLoading"
      :title="editDialogTitle"
      :visible.sync="editDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="80%">
      <el-form ref="editForm" :model="editData" :rules="validateRules" label-width="80px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="用户代码" prop="userCode">
              <el-input v-model="editData.userCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="用户姓名" prop="userName">
              <el-input v-model="editData.userName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号码" prop="mobile">
              <el-input v-model="editData.mobile"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电子邮箱" prop="mobile">
              <el-input v-model="editData.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证件号码" prop="">
              <el-input v-model="editData.identityNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别" prop="sex">
              <el-select v-model="editData.sex" style="width: 100%">
                <el-option label="男" :value="'1'"></el-option>
                <el-option label="女" :value="'2'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出生日期" prop="">
              <el-date-picker v-model="editData.birthdate" style="width: 100%"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="组织机构" prop="comCode">
              <tree-select
                v-model="editData.comCode"
                node-key="comCode"
                :remote-method="comQuery"
                :props="{
                  children: 'subList',
                  value: 'comCode',
                  label: 'comName'
                }"></tree-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="editData.remark" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="text-align: right">
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="$refs.editForm.resetFields()">重置</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import TreeSelect from "../../../components/tree-select";

export default {
  components: {
    TreeSelect
  },
  data() {
    return {
      tableData: [],
      tableSelection: [],
      totalCount: 0,
      queryLoading: false,
      pagerQuery: {
        pageNo: 1,
        pageSize: 10
      },
      editDialogVisible: false,
      editDialogTitle: "",
      editData: {},
      editStatus: "",
      submitLoading: false,
      validateRules: {
        userCode: [{ required: true, message: "请输入用户代码", trigger: "blur" }, { min: 8, max: 10, message: "长度在 8 到 10 个字符", trigger: "blur" }],
        userName: [{ required: true, message: "请输入用户姓名", trigger: "blur" }, { min: 2, max: 4, message: "长度在 2 到 4 个字符", trigger: "blur" }],
        comCode: [{ required: true, message: "请选择组织机构" }],
        sex: [{ required: true, message: "请选择组织机构" }]
      }
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
      let params = new URLSearchParams();
      params.append("_pageNo", this.pagerQuery.pageNo);
      params.append("_pageSize", this.pagerQuery.pageSize);
      this.$axios
        .post(this.$axios.config.saa.baseURL + this.$axios.config.saa.userQuery + "?" + params.toString(), {})
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
    newButtonClick() {
      this.editData = {};
      this.editStatus = "new";
      this.editDialogTitle = "新增用户";
      this.editDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.editForm.clearValidate();
      });
    },
    editButtonClick() {
      this.editData = JSON.parse(JSON.stringify(this.tableSelection[0]));
      this.editStatus = "edit";
      this.editDialogTitle = "修改用户";
      this.editDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.editForm.clearValidate();
      });
    },
    submitForm() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          this.$axios
            .request({
              method: this.editStatus == "new" ? "post" : "put",
              url: this.$axios.config.saa.baseURL + (this.editStatus == "new" ? this.$axios.config.saa.userCreate : this.$axios.config.saa.userEdit),
              data: this.editData
            })
            .then(response => {
              if (response.data.status != 0) {
                this.$message({
                  showClose: true,
                  duration: 10000,
                  message: response.data.statusText,
                  type: "error"
                });
              } else {
                this.$message.success("保存成功！");
                this.editDialogVisible = false;
                this.queryData();
              }
            })
            .finally(() => {
              this.submitLoading = false;
            });
        } else {
          this.$message.error("校验失败，请修复所有错误后再提交！");
          return false;
        }
      });
    },
    comQuery(node) {
      return new Promise(resolve => {
        this.$axios.get(this.$axios.config.saa.baseURL + this.$axios.config.saa.sysCompanyNext.format({ comCode: node ? node.comCode : this.$store.state.app.userInfo.comCode })).then(response => {
          resolve(response.data.data[0]);
        });
      });
    }
  }
};
</script>

<style>
.el-pagination__total {
  float: left;
}
</style>
