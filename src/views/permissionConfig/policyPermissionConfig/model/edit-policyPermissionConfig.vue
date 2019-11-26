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
          <el-col :span="8" :pull="1">
            <el-form-item label="省份" prop="provice">
              <el-select v-model="postData.provice" style="width: 100%" @change="selectProvice">
                <el-option v-for="para in customerAreas" :key="para.reserve2" :label="para.areaName" :value="para.reserve2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="1">
            <el-form-item label="客户等级" prop="viplevel">
              <el-select v-model="postData.viplevel" style="width: 100%">
                <el-option v-for="para in levelTypeLists" :key="para.key" :label="para.value" :value="para.key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="1">
            <el-form-item label="服务类型" prop="serviceType">
              <el-select v-model="postData.serviceType" style="width: 100%">
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
          <el-col :span="8" :pull="1">
            <el-form-item label="最大座位数" prop="seatCountNum">
              <el-input v-model="postData.seatCountNum" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="1">
            <el-form-item label="车辆使用性质" prop="carUseType">
              <el-select v-model="postData.carUseType" style="width: 100%">
                <el-option v-for="para in carUseTypes" :key="para.key" :label="para.value" :value="para.key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="1">
            <el-form-item label="车辆类型" prop="carType">
              <el-select v-model="postData.carType" style="width: 100%">
                <el-option label="客车" :value="'客车'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="1">
            <el-form-item label="除外车辆类型" prop="carTypeExcept">
              <el-input v-model="postData.carTypeExcept" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="1">
            <el-form-item label="免费拖车距离" prop="freeTrailerDistance">
              <el-input v-model="postData.freeTrailerDistance" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="1">
            <el-form-item label="商业险保费下限" prop="premiumLimit">
              <el-input v-model="postData.premiumLimit" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="1">
            <el-form-item label="商业险保费上限" prop="premiumUpper">
              <el-input v-model="postData.premiumUpper" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="1">
            <el-form-item label="是否新车" prop="isNewCar">
              <el-select v-model="postData.isNewCar" style="width: 100%">
                <el-option label="是" :value="'1'"></el-option>
                <el-option label="否" :value="'0'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="1">
            <el-form-item label="是否续约" prop="renewaOfContract">
              <el-select v-model="postData.renewaOfContract" style="width: 100%">
                <el-option label="是" :value="'1'"></el-option>
                <el-option label="否" :value="'0'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="1">
            <el-form-item label="是否投保车损险" prop="isDlw">
              <el-select v-model="postData.isDlw" style="width: 100%">
                <el-option label="是" :value="'1'"></el-option>
                <el-option label="否" :value="'0'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="1">
            <el-form-item label="是否转保" prop="isChangeInsurance">
              <el-select v-model="postData.isChangeInsurance" style="width: 100%">
                <el-option label="是" :value="'1'"></el-option>
                <el-option label="否" :value="'0'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="1">
            <el-form-item label="是否无赔" prop="isNoLoss">
              <el-select v-model="postData.isNoLoss" style="width: 100%">
                <el-option label="是" :value="'1'"></el-option>
                <el-option label="否" :value="'0'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="1">
            <el-form-item label="是否过户" prop="isTransfer">
              <el-select v-model="postData.isTransfer" style="width: 100%">
                <el-option label="是" :value="'1'"></el-option>
                <el-option label="否" :value="'0'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="1">
            <el-form-item label="是否脱保" prop="isInsuredOrNot">
              <el-select v-model="postData.isInsuredOrNot" style="width: 100%">
                <el-option label="是" :value="'1'"></el-option>
                <el-option label="否" :value="'0'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="1">
            <el-form-item label="投保日期为特定日期后取消服务" prop="">
              <el-date-picker v-model="postData.cancellationDate" value-format="yyyy-MM-dd" style="width: 100%"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="1">
            <el-form-item label="投保日期为特定日期后规则生效" prop="">
              <el-date-picker v-model="postData.effectiveDate" value-format="yyyy-MM-dd" style="width: 100%"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="1">
            <el-form-item label="险种" prop="insuranceType">
              <el-input v-model="postData.insuranceType" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="1">
            <el-form-item label="代理人" prop="agentName">
              <el-input v-model="postData.agentName" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="1">
            <el-form-item label="适用车型" prop="applicableVehicleType">
              <el-input v-model="postData.applicableVehicleType" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="1">
            <el-form-item label="除外车型" prop="exceptVehicleType">
              <el-input v-model="postData.exceptVehicleType" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="1">
            <el-form-item label="单次事故定损金额" prop="accidentDamageAmount">
              <el-input v-model="postData.accidentDamageAmount" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="1">
            <el-form-item label="出险次数下限" prop="riskFrequencyLimit">
              <el-input v-model="postData.riskFrequencyLimit" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="1">
            <el-form-item label="出险次数上限" prop="riskFrequencyUpper">
              <el-input v-model="postData.riskFrequencyUpper" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="submitForm" icon="el-icon-finished">提交</el-button>
        <el-button @click="clearEditData" :disabled="Object.keys(postData).length > 0 ? false : true" icon="el-icon-refresh">重置</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "EditUser",
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
        provice: [{ required: true, message: "请选择省份", trigger: "blur" }],
        viplevel: [{ required: true, message: "请选择客户等级", trigger: "blur" }],
        serviceType: [{ required: true, message: "请选择服务类型", trigger: "blur" }]
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
    let initParams = {
      "requestUrl": this.$axios.config.permissionConfig.baseURL + this.$axios.config.permissionConfig.findInitInfo,
      "requestType": "GET"
    };
    var urls = this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface;
    this.$axios.post(urls, initParams).then(response => {
      (this.customerAreas = response.data.result.result.customerAreas),
        (this.levelTypeLists = response.data.result.result.levelTypeList),
        (this.carUseTypes = response.data.result.result.carUseTypeList);
    });
  },
  methods: {
    selectProvice(val) {
      console.log(this.customerAreas, val)
      let obj = this.customerAreas.find(item => {
        return item.reserve2 === val;
      });
      this.postData.reverse1 = obj.areaName;
    },
    submitForm() {
      //获取操作人code
      if ("new" == this.type) {
        this.postData.createUser = this.$store.state.usercode;
      } else {
        this.postData.updateUser = this.$store.state.usercode;
      }
      let insertParams = {
        "requestUrl": this.$axios.config.permissionConfig.baseURL + this.$axios.config.permissionConfig.createpolicyPermissionConfig,
        "requestType": "POST",
        "requestBody": JSON.stringify(this.postData)
      };
      let updateParams = {
        "requestUrl": this.$axios.config.permissionConfig.baseURL + this.$axios.config.permissionConfig.copypolicyPermissionConfig,
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
                /*(this.type == "new"
                  ? this.$axios.config.permissionConfig.createpolicyPermissionConfig
                  : this.$axios.config.permissionConfig.copypolicyPermissionConfig),*/
              data: this.type == "new" ? insertParams : updateParams
            })
            .then(response => {
              if (response.data.result.success != true) {
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
        this.editDialogTitle = "新增尊客会校验规则";
      }
      if (this.type !== "new") {
        this.postData = JSON.parse(JSON.stringify(this.userData));
        if (this.type === "edit") {
          this.editDialogTitle = "修改尊客会校验规则";
        }
        if (this.type === "copy") {
          this.editDialogTitle = "复制添加尊客会校验规则";
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
