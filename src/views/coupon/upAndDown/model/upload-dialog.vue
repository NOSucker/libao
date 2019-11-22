<template>
  <div>
    <el-dialog
      custom-class="upload-page"
      :title="uploadPageTitle"
      :visible.sync="showUploadDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="30%"
      @open="dialogOpen">
      <el-upload
        class="upload-demo"
        drag
        :action="uploadUrl"
        :data="uploadData"
        :before-upload="beforeUpload"
        :on-success="uploadSuccess"
        :on-error="uploadFail"
        :on-progress="uploadProgress"
        :on-change="change"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传xls/xlsx文件，最近一个文件上传状态：<i class="el-icon-loading" v-if="loading"></i><span :style="{color: status && status == '成功' ? 'green' : 'red'}">{{status}}</span></div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "upload-dialog",
        props: {
          value: Boolean
        },
        computed: {
          showUploadDialog: {
            set(val) {
              this.$emit("input", val);
            },
            get() {
              return this.value;
            }
          }
        },
        data() {
          return {
            loading: false,
            status: '',
            uploadPageTitle: '',
            uploadUrl: this.$axios.config.service.baseURL + this.$axios.config.service.uploadFile,
            fileUploadUrl: this.$axios.config.file.baseURL + this.$axios.config.file.fileUpload,
            multifileUpload: this.$axios.config.file.baseURL + this.$axios.config.file.multifileUpload,
            uploadData: {
              "userCode": this.$store.state.usercode,
              "requestUrl": this.$axios.config.file.baseURL + this.$axios.config.file.multifileUpload,
              "requestType": 'POST'
            },
            data: {
              userCode: this.$store.state.usercode
            },
          }
        },
        mounted() {

        },
        methods: {
          dialogOpen() {

          },
          beforeUpload(file) {
            this.loading = true;
            this.status = '';
          },
          uploadSuccess(response, file, fileList) {
            this.loading = false;
            if (response.code && response.code == '200') {
              this.status = '成功';
              this.$emit("query-data");
            } else {
              this.status = '未知错误';
            }
          },
          uploadFail(err, file, fileList) {
            this.loading = false;
            console.log(err, file, fileList)
          },
          uploadProgress(event, file, fileList) {
            console.log(event, file, fileList)
          },
          change(file, fileList) {
            console.log(file, fileList)
          }
        }
    }
</script>

<style scoped>
  .upload-page .el-dialog__header {
    background: #f8fbff;
  }
  .upload-page .el-dialog__body {
    border-bottom: 1px solid #eee;
  }
  .el-upload-return__tip {
    color: red;
  }
  .upload-demo {
    width: 100%
  }
</style>
