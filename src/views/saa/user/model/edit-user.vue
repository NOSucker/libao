<template>
  <div>
    <el-dialog
      v-loading="submitLoading"
      :title="editDialogTitle"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="80%"
      @open="dialogOpen"
    >
      <el-form ref="editForm" :model="postData" :rules="validateRules" label-width="80px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="用户姓名" prop="userName">
              <el-input v-model="postData.userName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="用户代码" prop="userCode">
              <el-input v-model="postData.userCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="type !== 'edit'" :span="8">
            <el-form-item label="密码" prop="password">
              <el-input v-model="postData.password" show-password></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="组织机构" prop="comCode">
              <tree-select
                v-model="postData.comCode"
                node-key="comCode"
                :remote-method="comQuery"
                :props="{
                  children: 'subList',
                  value: 'comCode',
                  label: 'comName'
                }"></tree-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号码" prop="mobile">
              <el-input v-model="postData.mobilePhone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电子邮箱" prop="mobile">
              <el-input v-model="postData.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证件号码" prop="">
              <el-input v-model="postData.id"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别" prop="sex">
              <el-select v-model="postData.sex" style="width: 100%">
                <el-option label="男" :value="'1'"></el-option>
                <el-option label="女" :value="'2'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出生日期" prop="">
              <el-date-picker v-model="postData.birthday" value-format="yyyy-MM-dd" style="width: 100%"></el-date-picker>
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
import TreeSelect from "../../../../components/tree-select";
export default {
  name: "EditUser",
  components: {
    TreeSelect
  },
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
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        userCode: [{ required: true, message: "请输入用户代码", trigger: "blur" }, { min: 6, max: 20, message: "长度在 8 到 20 个字符", trigger: "blur" }],
        userName: [{ required: true, message: "请输入用户姓名", trigger: "blur" }, { min: 2, max: 24, message: "长度在 2 到 24 个字符", trigger: "blur" }],
        comCode: [{ required: true, message: "请选择组织机构" }]
      }
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
  methods: {
    submitForm() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          this.$axios
            .request({
              method: "post",
              url: this.$axios.config.saa.baseURL + (this.type == "edit" ? this.$axios.config.saa.userEdit : this.$axios.config.saa.userCreate),
              data: this.postData
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
      }
      if (this.type !== "new") {
        this.postData = JSON.parse(JSON.stringify(this.userData));
        if (this.type === "edit") {
          this.editDialogTitle = "修改用户";
        }
        if (this.type === "copy") {
          this.editDialogTitle = "复制添加用户";
          this.$set(this.postData, "userCode", null);
          this.$set(this.postData, "userName", null);
          this.$set(this.postData, "password", null);
        }
      }
    }
  }
};
</script>

<style scoped></style>
