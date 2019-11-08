<template>
  <div>
    <el-dialog
      custom-class="upload-page"
      :title="uploadPageTitle"
      :visible.sync="showUploadDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="21%"
      @open="dialogOpen">
      <el-upload
        class="upload-demo"
        drag
        :action="uploadUrl"
        :data="uploadData"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传xls/xlsx文件</div>
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
            uploadPageTitle: '',
            uploadUrl: this.$axios.config.service.baseURL + this.$axios.config.service.uploadFile,
            fileUploadUrl: this.$axios.config.file.baseURL + this.$axios.config.file.fileUpload,
            multifileUpload: this.$axios.config.file.baseURL + this.$axios.config.file.multifileUpload,
            uploadData: {
              userCode: this.$store.state.usercode,
              requestUrl: this.$axios.config.file.baseURL + this.$axios.config.file.multifileUpload,
              requestType: 'POST'
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
</style>
