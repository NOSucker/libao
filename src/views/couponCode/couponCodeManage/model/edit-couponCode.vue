<template>
  <div>
    <el-dialog
      v-loading="submitLoading"
      custom-class="user-edit"
      :title="editDialogTitle"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="80%"
      @open="dialogOpen"
    >
      <el-form ref="editForm" :model="postData" :rules="validateRules" label-width="50%">
        <el-row>
          <el-col :span="8" :pull="2">
            <el-form-item label="券码" prop="couponCode">
              <el-input v-model="postData.couponCode" :disabled="ortherOption"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-form-item label="代理商" prop="agentCode">
              <el-select v-model="postData.agentCode" :disabled="ortherOption" style="width: 100%">
              <el-option v-for="para in agent1" :key="para.key" :label="para.value" :value="para.key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-form-item label="适用分公司" prop="applicableBranch">
              <el-select v-model="postData.applicableBranch" :disabled="ortherOption" multiple style="width: 100%">
              <el-option v-for="para in branch1" :key="para.key" :label="para.value" :value="para.key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-form-item label="券码类型" prop="couponType">
              <el-select v-model="postData.couponType" :disabled="ortherOption" style="width: 100%">
              <el-option v-for="para in couponCodeType1" :key="para.key" :label="para.value" :value="para.key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-form-item label="领用人" prop="receiverName">
              <el-input v-model="postData.receiverName" :disabled="ortherOption" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-form-item label="领用人openId" prop="receiverOpenId">
              <el-input v-model="postData.receiverOpenId" :disabled="ortherOption" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-form-item label="领用人电话" prop="receiverMobile">
              <el-input v-model="postData.receiverMobile" :disabled="ortherOption" style="background: #FFFFFF !important;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-form-item label="是否领用" prop="isReceive">
              <el-select v-model="postData.isReceive" :disabled="ortherOption" style="width: 100%">
                <el-option label="未领用" value="0"></el-option>
                <el-option label="已领用" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-form-item label="是否使用" prop="isUse">
              <el-select v-model="postData.isUse" :disabled="ortherOption" style="width: 100%">
                <el-option label="未使用" value="0"></el-option>
                <el-option label="已使用" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-form-item label="是否有效" prop="validStatus">
              <el-select v-model="postData.validStatus" :disabled="ortherOption" style="width: 100%">
                <el-option label="有效" value="0"></el-option>
                <el-option label="无效" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-form-item label="导入人代码" prop="importCode">
              <el-input v-model="postData.importCode" :disabled="ortherOption" style="background: #FFFFFF !important;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-form-item label="领用人证件号" prop="receiverIdentifiedno">
              <el-input v-model="postData.receiverIdentifiedno" :disabled="ortherOption" style="background: #FFFFFF !important;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-form-item label="使用门店" prop="useStores">
              <el-input v-model="postData.useStores" :disabled="ortherOption" style="background: #FFFFFF !important;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-form-item label="批次号" prop="batchId">
              <el-input v-model="postData.batchId" :disabled="ortherOption" style="background: #FFFFFF !important;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-form-item label="导入时间" prop="importTime">
              <el-date-picker v-model="postData.importTime" :disabled="ortherOption" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-form-item label="有效期始" prop="startTime">
              <el-date-picker v-model="postData.startTime" :disabled="ortherOption" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-form-item label="有效期止" prop="endTime">
              <el-date-picker v-model="postData.endTime" :disabled="ortherOption" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-form-item label="领用时间" prop="receiveTime">
              <el-date-picker v-model="postData.receiveTime" :disabled="ortherOption" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8" :pull="2">
            <el-form-item label="使用时间" prop="useTime">
              <el-date-picker v-model="postData.useTime" :disabled="ortherOption" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <el-button v-if="type == 'query' ? false : true" type="primary" @click="submitForm">提交</el-button>
        <el-button v-if="type == 'query' ? false : true" @click="$refs.editForm.resetFields()">重置</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "EditUser",
    components: {
    },
    props: {
      value: Boolean,
      type: String,
      userData: Object
    },
    data() {
      return {
        submitLoading: false,
        postData: {
          applicableBranch:[]
        },
        ortherOption:false,
        editDialogTitle: "",
        validateRules: {
          agent: [{ required: true, message: "请选择代理商", trigger: "blur" }],
          couponCode: [{ required: true, message: "请输入券码", trigger: "blur" }],
          couponCodeType: [{ required: true, message: "请选择券码类型", trigger: "blur" }],
          branch: [{ required: true, message: "请选择适用分公司", trigger: "blur" }],
          startTime: [{ required: true, message: "请输入有效期始", trigger: "blur" }],
          endTime: [{ required: true, message: "请输入有效期止", trigger: "blur" }],
          isReceive: [{ required: true, message: "请选择是否领用", trigger: "blur" }],
          isUse: [{ required: true, message: "请输入是否使用", trigger: "blur" }],
          validStatus: [{ required: true, message: "请输入是否有效", trigger: "blur" }]
        },
        branch1:[],//分公司
        agent1:[],//代理商
        couponCodeType1:[],//券码类型
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
        this.couponCodeType1 = JSON.parse(response.data.responseStr).result;
      });
      //代理商
      this.$axios.post(urls, agentQuery).then(response => {
        this.agent1 = JSON.parse(response.data.responseStr).result;
      });
      //适用分公司
      this.$axios.post(urls, branchQuery).then(response => {
        this.branch1 = JSON.parse(response.data.responseStr).result;
      });
    },

    methods: {
      submitForm() {
       if(this.postData.agentCode==null){
          this.postData.agentCode=this.userData.agentCode;
        }
       if(this.postData.applicableBranch==null){
         this.postData.applicableBranch=this.userData.applicableBranch;
        }
        if(this.postData.couponType==null){
          this.postData.couponType=this.userData.couponType;
        }
        var str=this.postData.applicableBranch.join("|");
        this.postData.applicableBranch=str;
        console.log(6322112544,this.postData.applicableBranch);
        let updateParam = {
          requestUrl: this.$axios.config.couponCodeManage.baseURL + this.$axios.config.couponCodeManage.updateCouponCode,
          requestType: "POST",
          requestBody: JSON.stringify(this.postData)
        };
        console.log(6365515454,updateParam.requestBody);
        this.$refs.editForm.validate(valid => {
          if (valid) {
            this.submitLoading = true;
            this.$axios
              .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, updateParam)
              .then(response => {
                console.log(878449444,response);
                if (JSON.parse(response.data.responseStr).errorCode != 200) {
                  this.$message({
                    showClose: true,
                    duration: 10000,
                    message: JSON.parse(response.data.responseStr).errorMsg,
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
          this.editDialogTitle = "新增券码";
        }
        if (this.type !== "new") {
          this.postData = JSON.parse(JSON.stringify(this.userData));
          var arr=this.userData.applicableBranch.split("|");
          this.postData.applicableBranch=arr;
          if (this.type === "edit") {
            this.ortherOption = false ;
            this.editDialogTitle = "修改券码";
          }
          if (this.type === "copy") {
            this.editDialogTitle = "复制添加券码";
            this.$set(this.postData, "userCode", null);
            this.$set(this.postData, "userName", null);
            this.$set(this.postData, "password", null);
          }
          if (this.type === "query") {
            this.editDialogTitle = "券码详情";
            this.ortherOption = true ;
            if (this.userData.stafftype == 0) {
              this.$set(this.postData, "stafftype", "正式");
            } else {
              this.$set(this.postData, "stafftype", "试用");
            }
          }
        }
      }
    }
  };
</script>

<style>
  .user-edit .el-dialog__header {
    background: #f8fbff;
  }
  .user-edit .el-dialog__body {
    border-bottom: 1px solid #eee;
  }
</style>
