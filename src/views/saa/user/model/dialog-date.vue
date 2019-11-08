<template>
  <div>
    <el-dialog custom-class="dialog-date" :visible.sync="showDialogDate" :close-on-click-modal="true" :close-on-press-escape="true" width="30%">
      <el-form ref="dateForm" :model="dateForm" label-width="30%">
        <el-row>
          <el-form-item label="过期日期" prop="overTime">
            <el-date-picker v-model="dateForm.overTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%"></el-date-picker>
          </el-form-item>
        </el-row>
      </el-form>
      >
      <span slot="footer">
        <el-button type="primary" @click="submitForm">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "DialogDate",
  props: {
    value: Boolean,
    userRoleId: String
  },
  data() {
    return {
      submitLoading: false,
      dateForm: {
        userRoleId: null,
        overTime: null
      },
      editDialogTitle: ""
    };
  },
  computed: {
    showDialogDate: {
      set(val) {
        this.$emit("input", val);
      },
      get() {
        return this.value;
      }
    }
  },
  methods: {
    submitForm() {
      this.dateForm.userRoleId = this.userRoleId;
      console.log(5120124554, this.dateForm);

      let dateParams = {
        requestUrl: this.$axios.config.user.baseURL + this.$axios.config.user.setUserRoleDate,
        requestType: "POST",
        requestBody: JSON.stringify(this.dateForm)
      };
      this.$axios
        .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, dateParams)
        .then(response => {
          console.log(11111111, response);
          if (JSON.parse(response.data.responseStr).errorCode == 200) {
            this.$message.success("提升成功！");
            this.$emit("input", false);
            this.$emit("role-date-close");
          } else {
            this.$message.error(JSON.parse(response.data.responseStr).msg);
          }
        })
        .finally(() => {});
    }
  }
};
</script>

<style scoped></style>
