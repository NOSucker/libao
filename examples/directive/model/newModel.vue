<template>
  <div>
    <el-dialog
      v-loading="submitLoading"
      top="5vh"
      title="修理厂维护"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="80%"
      @close="dialogClose">
      <el-form ref="editForm" :model="editData" label-width="80px" :rules="validateRules" :hide-required-asterisk="true">
        <el-row>
          <el-col :span="12">
            <el-form-item label="修理厂名称" prop="repairName">
              <el-input v-model="editData.repairName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="修理厂牌" prop="repairBrand">
              <el-input v-model="editData.repairBrand"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="修理厂代码" prop="repairCode">
              <el-input v-model="editData.repairCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="国家" prop="country">
              <el-select v-model="editData.country" style="width: 100%">
                <el-option label="中国" :value="'1'"></el-option>
                <el-option label="荷兰" :value="'2'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="州/省" prop="province">
              <el-select v-model="editData.province" style="width: 100%">
                <el-option label="青海省" :value="'1'"></el-option>
                <el-option label="山东省" :value="'2'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="市" prop="city">
              <el-select v-model="editData.city" style="width: 100%">
                <el-option label="济南市" :value="'1'"></el-option>
                <el-option label="北京市" :value="'2'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地区" prop="region">
              <el-select v-model="editData.region" style="width: 100%">
                <el-option label="朝阳区" :value="'1'"></el-option>
                <el-option label="海淀区" :value="'2'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="修理日期" prop="birthdate">
              <el-date-picker v-model="editData.birthdate" value-format="yyyy-MM-dd" style="width: 100%"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="地址" prop="address">
              <el-input v-model="editData.address"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="cc">
            <el-form-item label="路线" prop="route">
              <el-input v-model="editData.route"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="cc">
            <el-form-item label="邮编" prop="postalCode">
              <el-input v-model="editData.postalCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="cc">
            <el-form-item label="联系人" prop="contacts">
              <el-input v-model="editData.contacts"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="cc">
            <el-form-item label="联系电话" prop="phoneCode">
              <el-input v-model="editData.phoneCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="cc">
            <el-form-item label="传真" prop="fax">
              <el-input v-model="editData.fax"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="cc">
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="editData.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否首选" prop="firstChoice">
              <el-select v-model="editData.firstChoice" style="width: 100%">
                <el-option label="是" :value="'1'"></el-option>
                <el-option label="否" :value="'2'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="cc">
            <el-form-item label="微信号" prop="chatCode">
              <el-input v-model="editData.chatCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="修理厂区分" prop="repairArea">
              <el-select v-model="editData.repairArea" style="width: 100%">
                <el-option label="朝阳修理厂" :value="'1'"></el-option>
                <el-option label="海淀修理厂" :value="'2'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12" class="cc">
            <el-form-item label="银行名称" prop="bankName">
              <el-input v-model="editData.bankName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="cc">
            <el-form-item label="账号" prop="accountNumber">
              <el-input v-model="editData.accountNumber"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="cc">
            <el-form-item label="发票类型">
              <el-radio-group v-model="editData.resource">
                <el-radio label="专票"></el-radio>
                <el-radio label="普票"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="cc">
            <el-form-item label="增值税率" prop="vatRate">
              <el-input v-model="editData.vatRate"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="text-align: center;">
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="$refs.editForm.clearValidate()">重置</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "EditUser",
  props: {
    value: Boolean
  },
  data() {
    return {
      editData: {
        type: []
      },
      userNameDisabled: false,
      showUserDialog: false,
      lookDisabled: false,
      submitLoading: false,
      validateRules: {
        repairName: [{ required: true, message: "请输入修理厂名称", trigger: "blur" }]
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
    //提交表单
    submitForm() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$message({
            message: "提交成功",
            type: "success"
          });
        } else {
          this.$message({
            message: "请填写必填字段",
            type: "error"
          });
        }
      });
    },

    //当dialog关闭时调用
    dialogClose() {
      this.$refs.editForm.clearValidate();
    }
    //获取当前登录用户的角色列表
  }
};
</script>

<style scoped lang="scss"></style>
