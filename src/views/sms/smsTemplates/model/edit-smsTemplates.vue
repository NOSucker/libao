<template>
  <div>
    <el-dialog
      v-loading="submitLoading"
      custom-class="smsTemplates-edit"
      :title="editDialogTitle"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="80%"
      @open="dialogOpen">
      <el-form ref="editForm" :model="postData" :rules="validateRules" label-width="50%">
        <el-row  :gutter="24">
          <el-col :span="16">
            <el-form-item label="短信主题" prop="smsTheme" label-width="24.5%">
              <el-input v-model="postData.smsTheme" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row  :gutter="24">
          <el-col :span="8">
           <el-form-item label="部门" prop="field1">
              <el-select v-model="postData.field1" style="width: 100%" @change="setSecondStatus">
                <el-option v-for="para in smsTemplateConfigs" :key="para.id" :label="para.showName" :value="para.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
           <el-col :span="8">
            <el-form-item label="类型" prop="field2">
              <el-select v-model="postData.field2" style="width: 100%" @change="setThirdStatus">
                <el-option v-for="para in smsTemplateConfigsTwo" :key="para.id" :label="para.showName" :value="para.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="小项" prop="field3">
              <el-select v-model="postData.field3" style="width: 100%">
                <el-option v-for="para in smsTemplateConfigsThree" :key="para.id" :label="para.showName" :value="para.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row  :gutter="24">
           <el-col :span="24">
            <el-form-item label="短信内容" prop="smsContent" label-width="16%">
              <el-input type="textarea" :rows="2" placeholder="请输入内容"  v-model="postData.smsContent"> </el-input>
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
  name: "EditSmsTemplates",
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
        smsTheme: [{ required: true, message: "请输入短信主题", trigger: "blur" }],
        field1: [{ required: true, message: "请选择部门", trigger: "blur" }],
        field2: [{ required: true, message: "请选择类型", trigger: "blur" }],
        field3: [{ required: true, message: "请选择小项", trigger: "blur" }],
        smsContent: [{ required: true, message: "请输入短信内容", trigger: "blur" }]
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
    let urls = this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface;
    let initParamsfirst= {
        "requestUrl": this.oldurl+"/root",
        "requestType": "GET"
    };
    this.$axios.post(urls, initParamsfirst).then(response => {
      (this.smsTemplateConfigs = JSON.parse(response.data.responseStr).result);
    });
  },
  methods: {
    submitForm() {
      //获取操作人code
      if ("edit" == this.type) {
        //this.postData.updateUser = this.$store.state.usercode;
      } else {
        this.postData.createPerson = this.$store.state.usercode;
      }
      let insertParams = {
        "requestUrl": this.$axios.config.smsTemplates.baseURL + this.$axios.config.smsTemplates.saveSmsTemplates,
        "requestType": "POST",
        "requestBody": JSON.stringify(this.postData)
      };
      let updateParams = {
        "requestUrl": this.$axios.config.smsTemplates.baseURL + this.$axios.config.smsTemplates.modifySmsTemplates,
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
    setSecondStatus(val) {
      alert(111);
      let urls = this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface;
      this.initParams.requestUrl = this.oldurl+"/"+val;
      this.$axios.post(urls, this.initParams).then(response => {
         alert(111);
        (this.smsTemplateConfigsTwo = JSON.parse(response.data.responseStr).result);
      });
    },
    setThirdStatus(val){
      let urls = this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface;
      this.initParams.requestUrl = this.oldurl+"/"+val;
      this.$axios.post(urls, this.initParams).then(response => {
        (this.smsTemplateConfigsThree = JSON.parse(response.data.responseStr).result);
      });
    },
    initinfo(){
      let urls = this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface;
      this.initParams.requestUrl = this.oldurl+"/"+this.userData.field1;
      this.$axios.post(urls, this.initParams).then(response => {
        (this.smsTemplateConfigsTwo = JSON.parse(response.data.responseStr).result);
        this.setThirdStatus(this.userData.field2);
      });
    },
    dialogOpen() {
      this.initinfo();
      this.postData = {};
      if (this.type === "new") {
        this.editDialogTitle = "新增短信模板";
      }
      if (this.type !== "new") {
        this.postData = JSON.parse(JSON.stringify(this.userData));
        if (this.type === "edit") {
          this.editDialogTitle = "修改短信模板";
        }
        if (this.type === "copy") {
          this.editDialogTitle = "复制添加短信模板";
        }
      }
    }
  }
};
</script>

<style>
.smsTemplates-edit .el-dialog__header {
  background: #f8fbff;
}
.smsTemplates-edit .el-dialog__body {
  border-bottom: 1px solid #eee;
}
</style>
