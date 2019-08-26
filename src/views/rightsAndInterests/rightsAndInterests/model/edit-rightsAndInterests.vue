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
                <el-option v-for="para in customerAreas" :key="para.reserve2" :label="para.areaName" :value="para.reserve2"></el-option>
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
            <el-form-item label="服务类型" prop="serverTypeCode">
              <el-select v-model="postData.serverTypeCode" style="width: 100%" @change="selectServerName">
                <el-option label="税费代缴" :value="'taxpay'"></el-option>
                <el-option label="待办年审" :value="'vehicle'"></el-option>
                <el-option label="维修接送" :value="'accidentcar'"></el-option>
                <el-option label="非事故道路救援" :value="'pannenhilfe'"></el-option>
                <el-option label="拖车服务" :value="'trailer'"></el-option>
                <el-option label="机场接送" :value="'airport'"></el-option>
                <el-option label="酒后代驾" :value="'drink'"></el-option>
                <el-option label="理赔代步" :value="'claim'"></el-option>
                <el-option label="停车秘书" :value="'secretary'"></el-option>
                <el-option label="安全检测" :value="'securityDetection'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="服务次数" prop="serverNumber">
              <el-input v-model="postData.serverNumber" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商名称" prop="supplierId">
              <el-select v-model="postData.supplierId" filterable placeholder="输入搜索并选择" @change="selectSupplier" style="width: 100%">
                <el-option
                  v-for="item in suppliers"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商次数" prop="supplierCount">
              <el-input v-model="postData.supplierCount" clearable></el-input>
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
          <el-col :span="8">
            <el-form-item label="是否线上" prop="isOnline">
              <el-select v-model="postData.isOnline" style="width: 100%">
                <el-option label="是" :value="'online'"></el-option>
                <el-option label="否" :value="'underline'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="clearEditData" :disabled="Object.keys(postData).length > 0 ? false : true">重置</el-button>
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
      carUseTypes: [],
      suppliers: {}
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
    let initParams = {
      "requestUrl": this.$axios.config.permissionConfig.baseURL + this.$axios.config.permissionConfig.findInitInfo,
        "requestType": "GET"
    };
    let supplierParams = {
      "requestUrl": this.$axios.config.supplier.baseURL + this.$axios.config.supplier.queryAllSupplier,
      "requestType": "GET"
    }
    let urls = this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface;
    this.$axios.post(urls, initParams).then(response => {
      (this.customerAreas = JSON.parse(response.data.responseStr).result.customerAreas),
        (this.levelTypeLists = JSON.parse(response.data.responseStr).result.levelTypeList),
        (this.carUseTypes = JSON.parse(response.data.responseStr).result.carUseTypeList);
    });
    this.$axios.post(urls, supplierParams).then(response => {
      this.suppliers = JSON.parse(response.data.responseStr).result;
    })
  },
  methods: {
    selectArea(val) {
      let obj = this.customerAreas.find(item => {
        return item.reserve2 === val;
      });
      this.postData.areaName = obj.areaName;
    },
    selectLevel(val) {
      let obj = this.levelTypeLists.find(item => {
        return item.key === val;
      });
      this.postData.levelTypeName = obj.value;
    },
    selectServerName(val) {
      if ('taxpay' === val) {
        this.postData.serverTypeName = '税费代缴';
      } else if ('vehicle' === val) {
        this.postData.serverTypeName = '待办年审';
      } else if ('accidentcar' === val) {
        this.postData.serverTypeName = '维修接送';
      } else if ('pannenhilfe' === val) {
        this.postData.serverTypeName = '非事故道路救援';
      } else if ('trailer' === val) {
        this.postData.serverTypeName = '拖车服务';
      } else if ('airport' === val) {
        this.postData.serverTypeName = '机场接送';
      } else if ('drink' === val) {
        this.postData.serverTypeName = '酒后代驾';
      } else if ('claim' === val) {
        this.postData.serverTypeName = '理赔代步';
      } else if ('secretary' === val) {
        this.postData.serverTypeName = '停车秘书';
      } else if ('securityDetection' === val) {
        this.postData.serverTypeName = '安全检测';
      }
    },
    selectSupplier(val) {
      let obj = this.suppliers.find(item => {
        return item.value === val;
      });
      this.postData.supplierName = obj.label;
    },
    submitForm() {
      //获取操作人code
      if ("edit" == this.type) {
        this.postData.updateUser = this.$store.state.usercode;
      } else {
        this.postData.createUser = this.$store.state.usercode;
      }
      let insertParams = {
        "requestUrl": this.$axios.config.rightsAndInterests.baseURL + this.$axios.config.rightsAndInterests.saveRightsAndInterests,
        "requestType": "POST",
        "requestBody": JSON.stringify(this.postData)
      };
      let updateParams = {
        "requestUrl": this.$axios.config.rightsAndInterests.baseURL + this.$axios.config.rightsAndInterests.modifyRightsAndInterests,
        "requestType": "POST",
        "requestBody": JSON.stringify(this.postData)
      }
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          this.$axios
            .request({
              method: "post",
              url: this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface,
              data: this.type == "edit" ? updateParams : insertParams
            })
            .then(response => {
              if (JSON.parse(response.data.responseStr).success != true) {
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
    /*
    * 重置编辑表单
    * */
    clearEditData() {
      this.postData = {};
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
