<template>
  <el-form ref="editForm" :model="editData" v-form-track="trackData" :rules="validateRules" label-width="80px">
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
        <el-form-item label="出生日期" prop="birthdate">
          <el-date-picker v-model="editData.birthdate" value-format="yyyy-MM-dd" style="width: 100%"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注" prop="remark">
          <el-input v-model="editData.remark" type="textarea"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row style="text-align: right">
      <el-button type="primary" @click="$refs.editForm.validate()">提交</el-button>
    </el-row>
  </el-form>
</template>

<script>
  import formTrack from "../../src/directive/form-track"

  export default {
    directives: {
      formTrack
    },
    name: "form-track",
    data(){
      return {
        editData: {},
        trackData: {
          userCode: "12345678",
          birthdate: new Date().format("yyyy-MM-dd"),
          sex: "2"
        },
        validateRules: {
          userCode: [{ required: true, message: "请输入用户代码"}, { min: 8, max: 10, message: "长度在 8 到 10 个字符"}],
          userName: [{ required: true, message: "请输入用户姓名"}, { min: 2, max: 4, message: "长度在 2 到 4 个字符"}],
          sex: [{ required: true, message: "请选择组织机构" }]
        }
      }
    }
  }
</script>
