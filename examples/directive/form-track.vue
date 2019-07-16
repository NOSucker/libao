<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>修理厂查询</span>
        <el-button style="float: right;" type="primary">查询</el-button>
      </div>
      <div>
        <el-form ref="editForm" :model="editData" label-width="80px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="修理厂名称" prop="repairName">
                <el-input v-model="editData.repairName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="修理厂牌" prop="repairBrand">
                <el-input v-model="editData.repairBrand"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="修理厂代码" prop="repairCode">
                <el-input v-model="editData.repairCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="电子邮箱" prop="mobile">
                <el-input v-model="editData.email"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="证件号码" prop="identityNo">
                <el-input v-model="editData.identityNo"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="国家" prop="country">
                <el-select v-model="editData.country" style="width: 100%">
                  <el-option label="中国" :value="'1'"></el-option>
                  <el-option label="荷兰" :value="'2'"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="州/省" prop="province">
                <el-select v-model="editData.province" style="width: 100%">
                  <el-option label="青海省" :value="'1'"></el-option>
                  <el-option label="山东省" :value="'2'"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="市" prop="city">
                <el-select v-model="editData.city" style="width: 100%">
                  <el-option label="济南市" :value="'1'"></el-option>
                  <el-option label="北京市" :value="'2'"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="修理日期" prop="birthdate">
                <el-date-picker v-model="editData.birthdate" value-format="yyyy-MM-dd" style="width: 100%"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="活动性质">
                <el-checkbox-group v-model="editData.type">
                  <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
                  <el-checkbox label="地推活动" name="type"></el-checkbox>
                  <el-checkbox label="线下主题活动" name="type"></el-checkbox>
                  <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="特殊资源">
                <el-radio-group v-model="editData.resource">
                  <el-radio label="线上品牌商赞助"></el-radio>
                  <el-radio label="线下场地免费"></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="editData.remark" type="textarea"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="text-align: center">
            <el-button type="primary" @click="newButtonClick">创建</el-button>
          </el-row>
        </el-form>
      </div>
      <new-model v-model="newDialogVisible"></new-model>
    </el-card>
  </div>
</template>

<script>
import newModel from "./model/newModel";

export default {
  name: "FormTrack",
  components: {
    newModel
  },
  data() {
    return {
      newDialogVisible: false,
      editData: {
        type: []
      }
    };
  },
  methods: {
    //创建
    newButtonClick() {
      this.newDialogVisible = true;
    }
  }
};
</script>
