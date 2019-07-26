<template>
  <div>
    <el-dialog
      v-loading="submitLoading"
      custom-class="vipValidateRole-edit"
      :title="editDialogTitle"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="80%"
      @open="dialogOpen">
      <el-form ref="editForm" :model="postData" :rules="validateRules" label-width="50%">
        <el-row>
          <el-col :span="8">
            <el-form-item label="省份" prop="areaCode">
              <el-select v-model="postData.areaCode" style="width: 100%" @change="selectArea">
                <el-option v-for="para in customerAreas" :key="para.areaId" :label="para.areaName" :value="para.areaId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户等级" prop="levelTypeCode">
              <el-select v-model="postData.levelTypeCode" style="width: 100%" @change="selectLevel">
                <el-option v-for="para in levelTypeLists" :key="para.key" :label="para.value" :value="para.key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="服务类型" prop="serverTypeName">
              <el-select v-model="postData.serverTypeName" style="width: 100%">
                <el-option label="税费代缴" :value="'税费代缴'"></el-option>
                <el-option label="待办年审" :value="'待办年审'"></el-option>
                <el-option label="维修接送" :value="'维修接送'"></el-option>
                <el-option label="非事故道路救援" :value="'非事故道路救援'"></el-option>
                <el-option label="拖车服务" :value="'拖车服务'"></el-option>
                <el-option label="机场接送" :value="'机场接送'"></el-option>
                <el-option label="酒后代驾" :value="'酒后代驾'"></el-option>
                <el-option label="理赔代步" :value="'理赔代步'"></el-option>
                <el-option label="停车秘书" :value="'停车秘书'"></el-option>
                <el-option label="安全检测" :value="'安全检测'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="服务次数" prop="serverNumber">
              <el-input v-model="postData.serverNumber"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商名称" prop="supplierName">
              <el-input v-model="postData.supplierName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商次数" prop="supplierCount">
              <el-input v-model="postData.supplierCount"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否默认" prop="isDefault">
              <el-select v-model="postData.isDefault" style="width: 100%">
                <el-option label="是" :value="'Y'"></el-option>
                <el-option label="否" :value="'N'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="$refs.editForm.resetFields()">重置</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "EditRightsAndInterests",
  components: {},
  props: {
    value: Boolean,
    type: String,
    userData: Object
  },
  data() {
    return {
      submitLoading: false,
      postData: {},
      editDialogTitle: "",
      validateRules: {
        areaCode: [{ required: true, message: "请选择省份", trigger: "blur" }],
        levelTypeCode: [{ required: true, message: "请选择客户等级", trigger: "blur" }],
        serverTypeName: [{ required: true, message: "请选择服务类型", trigger: "blur" }]
      },
      levelTypeLists: [],
      customerAreas: [],
      carUseTypes: []
    };
  },
  computed: {
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
  mounted() {
    var urls = this.$axios.config.permissionConfig.baseURL + this.$axios.config.permissionConfig.findInitInfo;
    this.$axios.get(urls).then(response => {
      (this.customerAreas = response.data.result.customerAreas),
        (this.levelTypeLists = response.data.result.levelTypeList),
        (this.carUseTypes = response.data.result.carUseTypeList);
    });
  },
  methods: {
    selectArea(val) {
      let obj = this.customerAreas.find(item => {
        return item.areaId === val;
      });
      this.postData.areaName = obj.areaName;
    },
    selectLevel(val) {
      let obj = this.levelTypeLists.find(item => {
        return item.key === val;
      });
      this.postData.levelTypeName = obj.value;
    },
    submitForm() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          this.$axios
            .request({
              method: "post",
              url:
                this.$axios.config.rightsAndInterests.baseURL +
                (this.type == "edit"
                  ? this.$axios.config.rightsAndInterests.modifyRightsAndInterests
                  : this.$axios.config.rightsAndInterests.saveRightsAndInterests),
              data: this.postData
            })
            .then(response => {
              if (!response.data.success) {
                this.$message({
                  showClose: true,
                  duration: 10000,
                  message: "操作失败",
                  type: "error"
                });
              } else {
                this.$message.success("保存成功！");
                this.$refs.editForm.clearValidate();
                this.$emit("input", false);
                this.$emit("role-edit-close");
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
    dialogOpen() {
      this.postData = {};
      if (this.type === "new") {
        this.editDialogTitle = "新增客户权益校验规则";
      }
      if (this.type !== "new") {
        this.postData = JSON.parse(JSON.stringify(this.userData));
        if (this.type === "edit") {
          this.editDialogTitle = "修改客户权益校验规则";
        }
        if (this.type === "copy") {
          this.editDialogTitle = "复制添加客户权益校验规则";
        }
      }
    }
  }
};
</script>

<style>
.vipValidateRole-edit .el-dialog__header {
  background: #f8fbff;
}
.vipValidateRole-edit .el-dialog__body {
  border-bottom: 1px solid #eee;
}
</style>
