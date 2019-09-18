<template>
  <div v-loading="submitLoading">
    <h2 style="background: #f8fbff;font-size: 14px;padding: 10px;margin-bottom: 0;">短信群发</h2>
    <div style="background: #fff; padding-top: 10px">
      <el-form ref="smsForm" :model="formData" :rules="validateRules" label-width="30%" style=" border-bottom: 1px solid #eee;">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="险种" prop="insuranceType">
              <el-select v-model="formData.insuranceType" style="width: 100%">
                <el-option v-for="para in insuranceList" :key="para.key" :label="para.value" :value="para.key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="客户等级" prop="customerLevel">
              <el-select v-model="formData.customerLevel" style="width: 100%">
                <el-option v-for="para in customerLevelList" :key="para.key" :label="para.value" :value="para.key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="分公司" prop="branch">
              <el-select v-model="formData.branch" style="width: 100%" @change="selectBranch">
                <el-option v-for="para in branchList" :key="para.key" :label="para.value" :value="para.key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="三级机构" prop="subList">
              <el-select v-model="formData.subList" multiple collapse-tags clearable placeholder="请优先选择分公司项" :disabled="!isSelectedBranch" style="width: 100%">
                <el-option v-for="para in thirdLevelOrgList" :key="para.key" :label="para.value" :value="para.key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="padding: 10px 0;">
          <el-col :span="5">
            <el-form-item label="短信类型" prop="smsType">
              <el-select v-model="formData.smsType" style="width: 100%" @change="querySmsTemplateList">
                <el-option v-for="para in smsTypeList" :key="para.id" :label="para.showName" :value="para.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="padding: 10px 0;">
          <el-col :span="20">
            <el-form-item label-width="7%" label="短信模板" prop="smsTemplate">
              <!--<el-select v-model="formData.smsTemplate" style="width: 100%">
                <el-option v-for="para in smsTemplateList" :key="para.reserve2" :label="para.areaName" :value="para.reserve2"></el-option>
              </el-select>-->
              <el-radio-group v-model="formData.smsTemplate" size="mini" fill="#f6d680" text-color="#000000" @change="radioSelected">
                <el-radio-button v-for="para in smsTemplateList" :key="para.smsId" :label="para.smsTheme" :value="para.smsId"></el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="padding: 10px 0 0 0;">
          <el-col :span="20">
            <el-form-item label-width="7%" label="发送内容" prop="content">
              <el-input type="textarea" v-model="formData.content" :autosize="{ minRows: 2, maxRows: 10}" style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="padding: 0 0 10px 0;">
          <el-col :offset="2" :span="7">
            <span>共计 <i>{{charCounts}}</i> 个字符，按 <i>{{smsCounts}}</i> 条短信计费</span>
          </el-col>
          <el-col :span="10">
            <el-button-group>
              <el-button type="primary" @click="submitForm">发送</el-button>
              <el-button type="primary">保存</el-button>
              <el-button type="primary">新增</el-button>
            </el-button-group>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
    export default {
        name: "index",

      data() {
          return {
            submitLoading: false,
            formData: {
              //险种
              insuranceType: '',
              //客户等级
              customerLevel: '',
              //分公司
              branch: '',
              //三级机构
              subList: [],
              //短信类型
              smsType: '',
              //短信模板
              smsTemplate: '',
              smsTemplateCode: '',
              //发送内容
              content: '',
              //操作人
              createUser: ''
            },
            validateRules: {
              insuranceType: [{ required: true, message: "请选择险种", trigger: "change" }],
              customerLevel: [{ required: true, message: "请选择客户等级", trigger: "change" }],
              branch: [{ required: true, message: "请选择分公司", trigger: "change" }],
              subList: [{ required: true, message: "请选择三级机构", trigger: "change" }],
              smsType: [{ required: true, message: "请选择短信类型", trigger: "blur" }],
              smsTemplate: [{ required: true, message: "请选择短信模板", trigger: "blur" }],
              content: [{ required: true, message: "请填写短信内容", trigger: "blur" }],
            },
            //险种
            insuranceList: [],
            //客户等级
            customerLevelList: [],
            //分公司
            branchList: [],
            //三级机构
            thirdLevelOrgList: [],
            //短信类型
            smsTypeList: [],
            //短信模板
            smsTemplateList: [],
            //是否选择分公司
            isSelectedBranch: false,
          }
      },
      computed: {
        charCounts() {
          return this.formData.content.replace(/[^\x00-\xff]/g,'**').length;
        },
        smsCounts() {
          let count = (this.formData.content.replace(/[^\x00-\xff]/g,'**').length);
          return Math.floor(count / 140) + (count % 140 == 0 ? 0 : 1);
        }
      },
      mounted() {
        this.queryCarInsuranceList();
        this.querySmsLevelList();
        this.querySmsBranchList();
        this.querySmsTypeList();
      },
      methods: {
        queryCarInsuranceList() {
          let param = {
            "requestUrl": this.$axios.config.sms.baseUrl + this.$axios.config.sms.queryCarInsuranceList,
            "requestType": "GET"
          }
          this.$axios.post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, param)
            .then(response => {
              if (JSON.parse(response.data.responseStr).success) {
                this.insuranceList = JSON.parse(response.data.responseStr).result;
              } else {
                this.$message.error(JSON.parse(response.data.responseStr).msg);
              }
          });
        },
        querySmsLevelList() {
          let param = {
            "requestUrl": this.$axios.config.sms.baseUrl + this.$axios.config.sms.querySmsLevelList,
            "requestType": "GET"
          }
          this.$axios.post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, param)
            .then(response => {
              if (JSON.parse(response.data.responseStr).success) {
                this.customerLevelList = JSON.parse(response.data.responseStr).result;
              } else {
                this.$message.error(JSON.parse(response.data.responseStr).msg);
              }
            });
        },
        querySmsBranchList() {
          let param = {
            "requestUrl": this.$axios.config.sms.baseUrl + this.$axios.config.sms.querySmsBranchList,
            "requestType": "GET"
          }
          this.$axios.post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, param)
            .then(response => {
              if (JSON.parse(response.data.responseStr).success) {
                this.branchList = JSON.parse(response.data.responseStr).result;
              } else {
                this.$message.error(JSON.parse(response.data.responseStr).msg);
              }
            });
        },
        selectBranch(val) {
          this.isSelectedBranch = true;
          this.formData.subList = [];
          let param = {
            "requestUrl": this.$axios.config.sms.baseUrl + this.$axios.config.sms.querySmsSubList + '/' + val.substring(0, 4),
            "requestType": "GET"
          }
          this.$axios.post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, param)
            .then(response => {
              if (JSON.parse(response.data.responseStr).success) {
                this.thirdLevelOrgList = JSON.parse(response.data.responseStr).result;
              } else {
                this.$message.error(JSON.parse(response.data.responseStr).msg);
              }
            });

        },
        radioSelected(val) {
          if (!val) {
            val = this.formData.smsTemplate;
          }
          this.smsTemplateList.forEach(e => {
            if (e.smsTheme === val) {
              this.formData.smsTemplateCode = e.smsId;
              this.formData.content = e.smsContent;
            }
          });
        },
        querySmsTypeList() {
          let param = {
            "requestUrl": this.$axios.config.sms.baseUrl + this.$axios.config.sms.querySmsTypeList,
            "requestType": "GET"
          }
          this.$axios.post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, param)
            .then(response => {
              if (JSON.parse(response.data.responseStr).success) {
                this.smsTypeList = JSON.parse(response.data.responseStr).result;
                //默认加载第一个短信类型
                this.formData.smsType = this.smsTypeList[0].id;
                this.querySmsTemplateList();
              } else {
                this.$message.error(JSON.parse(response.data.responseStr).msg);
              }
            });
        },
        querySmsTemplateList(val) {
          if (!val) {
            val = this.formData.smsType;
          }
          let param = {
            "requestUrl": this.$axios.config.sms.baseUrl + this.$axios.config.sms.querySmsTemplateList + '/' + val,
            "requestType": "GET"
          }
          this.$axios.post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, param)
            .then(response => {
              if (JSON.parse(response.data.responseStr).success) {
                this.smsTemplateList = JSON.parse(response.data.responseStr).result;
                //默认选中第一个模板
                this.formData.smsTemplate = this.smsTemplateList[0].smsTheme;
                //查询模板之后，默认加载第一个模板到发送内容
                this.smsTemplateList.forEach(e => {
                  if (e.smsTheme === this.formData.smsTemplate) {
                    this.formData.smsTemplateCode = e.smsId;
                    this.formData.content = e.smsContent;
                  }
                });
              } else {
                this.$message.error(JSON.parse(response.data.responseStr).msg);
              }
            });
        },

        submitForm() {
          //获取操作人code
          this.formData.createUser = this.$store.state.usercode;
          let params = {
            "requestUrl": this.$axios.config.sms.baseUrl + this.$axios.config.sms.querySendingSesCounts,
            "requestType": "POST",
            "requestBody": JSON.stringify(this.formData)
          };
          this.$refs.smsForm.validate(valid => {
            if (valid) {
              this.submitLoading = true;
              this.$axios
                .request({
                  method: "post",
                  url: this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface,
                  data: params
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
                    // this.$message.success("保存成功！");
                    this.$refs.smsForm.clearValidate();
                    this.open(JSON.parse(response.data.responseStr));
                  }
                })
                .finally(() => {
                  this.submitLoading = false;
                });
            } else {
              this.$message.error("校验失败，请查证后再提交！");
              return false;
            }
          });
        },

        open(val) {
          this.$confirm('将发送 ' + val.result + ' 条信息, 是否发送？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info',
            center: true
          }).then(() => {
            //确认发送信息请求

            this.$axios
              .request({
                method: "post",
                url: this.$axios.config.service.baseURL + this.$axios.config.service.insertsNewByXuanBird,
                data: this.formData
              })
              .then(response => {
                if (response.data.code != '200') {
                  this.$message({
                    showClose: true,
                    duration: 10000,
                    message: "发送失败",
                    type: "error"
                  });
                } else {
                  this.$message({
                    type: 'success',
                    message: '发送成功!'
                  });
                }
              })
              .finally(() => {
                this.submitLoading = false;
              });
          }).catch(() => {
            this.submitLoading = false;
            this.$message({
              type: 'info',
              message: '已取消发送'
            });
          });
        }
      }
    }
</script>

<style scoped>

</style>
