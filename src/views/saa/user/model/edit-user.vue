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
          <el-col :span="8">
            <el-form-item label="用户名" prop="userName">
              <el-input v-model="postData.userName" :disabled="ortherOption"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="用户代码" prop="userCode">
              <el-input v-model="postData.userCode" :disabled=userCodeStatus ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="组织机构" prop="organId">
              <select-tree
                v-model="postData.organId"
                which-type="user"
                :organ-name="postData.organName"
                :options="options"
                :value="1"
                :default-props="options.organName"
                :default-check-nodes="showTreeData"
                :disabled="ortherOption"
                @fromChild="getChild"
              ></select-tree>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号码" prop="mobile">
              <el-input v-model="postData.mobile" :disabled="ortherOption"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电话" prop="telephone">
              <el-input v-model="postData.telephone" :disabled="ortherOption"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="postData.email" :disabled="ortherOption"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证件号码" prop="idCardNo">
              <el-input v-model="postData.idCardNo" :disabled="ortherOption" style="background: #FFFFFF !important;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别" prop="sex">
              <el-select v-model="postData.sex" :disabled="ortherOption" style="width: 100%">
                <el-option v-for="para in userSex" :key="para.key" :label="para.value" :value="para.key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="有效" prop="vain">
              <el-select v-model="postData.vain" :disabled="ortherOption" style="width: 100%">
                <el-option v-for="para in userVain" :key="para.key" :label="para.value" :value="para.key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="班长" prop="monitor">
              <el-select v-model="postData.monitor" :disabled="ortherOption" style="width: 100%">
                <el-option v-for="para in userVain" :key="para.key" :label="para.value" :value="para.key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="出生年月" prop="birthday">
              <el-date-picker v-model="postData.birthday" :disabled="ortherOption" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="过期日期" prop="expirationDate">
              <el-date-picker v-model="postData.expirationDate" :disabled="ortherOption" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="办公室电话" prop="officephone">
              <el-input v-model="postData.officephone" :disabled="ortherOption" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="员工类型" prop="stafftype">
              <el-select v-model="postData.stafftype" :disabled="ortherOption" style="width: 100%">
                <el-option label="正式" value="正式"></el-option>
                <el-option label="试用" value="试用"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮件签名" prop="emailsignature">
              <el-input v-model="postData.emailsignature" :disabled="ortherOption" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="技能组" prop="skillsGroup">
              <el-select v-model="postData.skillsGroup" :disabled="ortherOption" style="width: 100%">
                <el-option v-for="para in userSkillsGroup" :key="para.key" :label="para.value" :value="para.key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="用户来源" prop="userSource">
              <el-select v-model="postData.userSource" :disabled="ortherOption" style="width: 100%">
                <el-option v-for="para in userSource" :key="para.key" :label="para.value" :value="para.key"></el-option>
              </el-select>
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
  import selectTree from "../../organization/component/selectTree";
  export default {
    name: "EditUser",
    components: {
      selectTree
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
          is: "Y"
          /* userName: '',
          userCode: '',
          id: ''*/
          //value-format="yyyy-MM-dd"
        },
        userCodeStatus: false,
        ortherOption:false,
        editDialogTitle: "",
        validateRules: {
          /*password: [{ required: true, message: "请输入密码", trigger: "blur" }],*/
          userCode: [{ required: true, message: "请输入用户代码", trigger: "blur" }],
          userName: [{ required: true, message: "请输入用户姓名", trigger: "blur" }],
          organId: [{ required: true, message: "请选择组织机构", trigger: "blur" }],
          sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
          vain: [{ required: true, message: "请选择是否有效", trigger: "blur" }],
          monitor: [{required: true, message: "请选择是否班长", trigger: "blur"}],
          stafftype: [{required: true, message: "请选择员工类型", trigger: "blur"}],
          expirationDate: [{required: true, message: "请设置过期日期", trigger: "blur"}],
          userSource: [{required: true, message: "请选择用户来源", trigger: "blur"}]

        },
        userSkillsGroup: [],
        userSource: [],
        userSex: [],
        userVain: [],
        options: [],
        showTreeData: []
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
      //用户技能组
      let initSkillsGroup = {
        requestUrl: this.$axios.config.user.baseURL + this.$axios.config.user.userQuerySkillsGroup,
        requestType: "GET"
      };
      //用户来源
      let initUserSource = {
        requestUrl: this.$axios.config.user.baseURL + this.$axios.config.user.userqueryUserSource,
        requestType: "GET"
      };
      //用户性别
      let initUserSex = {
        requestUrl: this.$axios.config.user.baseURL + this.$axios.config.user.userqueryUserSex,
        requestType: "GET"
      };
      //用户是否有效和是否班长
      let initUserVain = {
        requestUrl: this.$axios.config.user.baseURL + this.$axios.config.user.userqueryUserVain,
        requestType: "GET"
      };
      let queryAllOrgans = {
        requestUrl: this.$axios.config.organ.baseURL + this.$axios.config.organ.getAllOrgan,
        requestType: "GET"
      };

      let urls = this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface;
      //技能组
      this.$axios.post(urls, initSkillsGroup).then(response => {
        this.userSkillsGroup = JSON.parse(response.data.responseStr).result;
      });
      //用户来源
      this.$axios.post(urls, initUserSource).then(response => {
        this.userSource = JSON.parse(response.data.responseStr).result;
      });
      //用户性别
      this.$axios.post(urls, initUserSex).then(response => {
        this.userSex = JSON.parse(response.data.responseStr).result;
      });
      //是否有效及是否班长
      this.$axios.post(urls, initUserVain).then(response => {
        this.userVain = JSON.parse(response.data.responseStr).result;
      });
      //查询所有的机构
      this.$axios.post(urls, queryAllOrgans).then(response => {
        this.options = JSON.parse(response.data.responseStr).result;
      });
    },

    methods: {
      submitForm() {
        let addParam = {
          requestUrl: this.$axios.config.user.baseURL + this.$axios.config.user.userAdd,
          requestType: "POST",
          requestBody: JSON.stringify(this.postData)
        };
        let updateParam = {
          requestUrl: this.$axios.config.user.baseURL + this.$axios.config.user.userUpdate,
          requestType: "POST",
          requestBody: JSON.stringify(this.postData)
        };
        this.$refs.editForm.validate(valid => {
          if (valid) {
            this.submitLoading = true;
            this.$axios
              .request({
                method: "post",
                url: this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface,
                data: this.type == "edit" ? updateParam : addParam
              })
              .then(response => {
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
      getChild(data) {
        var Str = data.join(",");
        this.postData.organId = Str;
        /*this.$set(this.postData, "organId", null);
        this.$set(this.postData, "organId", data);*/
      },
      comQuery(node) {
        // 如果没有点击节点 也就是初始化的时候， 通过用户的userCode去调用接口，返回这个用户有权限操作的接口
        if (!node) {
          const theUserCode = JSON.parse(localStorage.getItem("userInfo")).userCode;
          return new Promise(resolve => {
            this.$axios
              .get(this.$axios.config.saa.baseURL + this.$axios.config.saa.availableOrganization, {
                params: {
                  userCode: theUserCode
                }
              })
              .then(response => {
                resolve({ subList: response.data.data });
              });
          });
        } else {
          return new Promise(resolve => {
            this.$axios
              .get(
                this.$axios.config.saa.baseURL +
                this.$axios.config.saa.getSubCompany.format({ comCode: node ? node.comCode : this.$store.state.app.userInfo.comCode })
              )
              .then(response => {
                resolve(response.data.data[0]);
              });
          });
        }
      },
      dialogOpen() {
        this.postData = {};
        if (this.type === "new") {
          this.editDialogTitle = "新增用户";
          this.userCodeStatus = false;
          this.ortherOption = false;
          this.$set(this.postData, "monitor", "否");
          this.$set(this.postData, "stafftype", "正式");
          this.$set(this.postData, "vain", "是");
          this.$set(this.postData, "userSource", "CRM");
          this.$set(this.postData, "expirationDate", "2099-12-31 23:59:59");
        }
        if (this.type !== "new") {
          this.postData = JSON.parse(JSON.stringify(this.userData));
          if (this.type === "edit") {
            this.editDialogTitle = "修改用户";
            this.userCodeStatus = true ;
            this.ortherOption = false ;
            if (this.userData.stafftype == 0) {
              this.$set(this.postData, "stafftype", "正式");
            } else {
              this.$set(this.postData, "stafftype", "试用");
            }
          }
          if (this.type === "copy") {
            this.editDialogTitle = "复制添加用户";
            this.ortherOption = false;
            this.$set(this.postData, "userCode", null);
            this.$set(this.postData, "userName", null);
            this.$set(this.postData, "password", null);
            this.userCodeStatus = false;
            if (this.userData.stafftype == 0) {
              this.$set(this.postData, "stafftype", "正式");
            } else {
              this.$set(this.postData, "stafftype", "试用");
            }

          }
          if (this.type === "query") {
            this.editDialogTitle = "用户详情";
            this.userCodeStatus = true;
            this.ortherOption = true;
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
