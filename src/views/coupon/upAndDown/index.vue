<template>
  <div v-loading="queryLoading">
    <h2 style="background: #f8fbff;font-size: 14px;padding: 10px;margin-bottom: 0;">券码导入</h2>
    <div style="background: #fff; padding-top: 10px">
      <div style="padding: 20px">
        <el-row style="margin-bottom: 15px;">
          <el-button type="info" icon="el-icon-upload2" @click="uploadFile">
            导入
          </el-button>
          <el-button type="primary" icon="el-icon-download" @click="downloadFile">
            模板下载
          </el-button>
        </el-row>
        <el-table header-cell-class-name="user-table-header" :data="tableData" tooltip-effect="dark" stripe @selection-change="tableSelectionChange">
          <!--<el-table-column type="selection" width="55" />-->
          <el-table-column prop="batchCode" label="批次号"/>
          <el-table-column prop="importPerson" label="操作人" />
          <el-table-column prop="importDate" label="导入时间"></el-table-column>
          <el-table-column prop="importNum" label="导入总条数" align="center"></el-table-column>
          <el-table-column prop="importSuccessNum" label="导入成功条数" align="center"></el-table-column>
          <el-table-column prop="importFailNum" label="导入失败条数" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.importFailNum !== 0" style="padding: 10px; cursor: pointer; color: #bf01a6;" @click="view(scope.row.batchCode)">{{scope.row.importFailNum}}</span>
              <span v-else style="padding: 10px;">{{scope.row.importFailNum}}</span>
            </template>
          </el-table-column>
          <!--<el-table-column label="操作" width="150px">
            <template slot-scope="scope">
              <span title="复制" style="padding: 10px; cursor: pointer; color: #5683bf;" @click="userButtonClick('copy', scope.row)">
                <i class="el-icon-tickets"></i>
              </span>
              <span title="编辑" style="padding: 10px; cursor: pointer; color: #5683bf;" @click="userButtonClick('edit', scope.row)">
                <i class="el-icon-edit"></i>
              </span>
            </template>
          </el-table-column>-->
        </el-table>
        <el-pagination
          :current-page.sync="pagerQuery.pageNum"
          background
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="pagerQuery.pageSize"
          style="width: 100%; text-align: right; margin-top: 20px"
          layout="total,  prev, pager, next, sizes, jumper"
          :total="totalCount"
          @current-change="queryData"
          @size-change="
            pagerQuery.pageNum = 1;
            queryData();
          "/>
      </div>
    </div>
    <upload-dialog v-model="uploadDialogVisible"  @query-data="queryData"></upload-dialog>
    <failed-uploads v-model="failedUploadDialogVisible" :data="batchCode"></failed-uploads>
  </div>
</template>

<script>
  import axios from "../../../../src/axios.js";
  import uploadDialog from "../upAndDown/model/upload-dialog";
  import failedUploads from "../upAndDown/model/failed-uploads";
    export default {
        name: "index",
        components: {uploadDialog, failedUploads},
        filters: {
          dataFilter(val, format) {
            if (!val) {
              return "";
            }
            const TempDate = new Date(val);
            if (TempDate instanceof Date && !isNaN(TempDate.getTime())) {
              return format ? TempDate.format(format) : TempDate.format("yyyy-MM-dd hh:mm:ss");
            }
            return "";
          }
        },
        data() {
          return {
            queryLoading: false,
            tableData: [],
            tableSelection: [],
            totalCount: 0,
            pagerQuery: {
              pageNum: 1,
              pageSize: 10,
              isSort: true,
              sortType: false,
              sortName: 'importDate'
            },
            pageParams: {
              "requestUrl": this.$axios.config.file.baseURL + this.$axios.config.file.queryCouponBatchByPage,
              "requestType": "POST",
              "requestBody": ""
            },
            downloadParams: {
              "requestUrl": this.$axios.config.file.baseURL + this.$axios.config.file.downloadFile,
              "requestType": "GET"
            },
            uploadDialogVisible: false,
            failedUploadDialogVisible: false,
            batchCode: '',
          }
        },
        mounted() {
          this.queryData();
        },
        methods: {
          queryData() {
            this.pageParams.requestBody = JSON.stringify(this.pagerQuery);
            this.queryLoading = true;
            this.$axios
              .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, this.pageParams)
              .then(response => {
                this.tableData = JSON.parse(response.data.responseStr).result.dataList;
                this.totalCount = JSON.parse(response.data.responseStr).result.totalCount;
              })
              .finally(() => {
                this.queryLoading = false;
              });
          },
          tableSelectionChange(selection) {
            this.tableSelection = selection;
          },
          uploadFile() {
            this.uploadDialogVisible = true;
          },
          downloadFile() {
            /*this.$axios
              .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, this.downloadParams)
              .then(response => {
                console.log(1111111111111,response)
                this.download(response.request);
              });*/
            axios({
              method: 'post',
              url: this.$axios.config.service.baseURL + this.$axios.config.service.downloadFile,
              data: this.downloadParams,
              /*method: 'get',
              url: this.$axios.config.file.baseURL + this.$axios.config.file.downloadFile,*/
              responseType: 'blob'
            }).then(response => {
              console.log(111111111,response)
              this.download(response.data)
            }).catch((error) => {
              this.$message.error("下载失败");
            });
          },
          // 下载文件
          download (data) {
            if (!data) {
              return
            }
            let url = window.URL.createObjectURL(new Blob([data], { type: 'application/ms-excel;charset=utf-8' }))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', '券码模板.xls')

            document.body.appendChild(link)
            link.click()
          },
          // 增 修改  复制角色调用dialog的方法
          view(val) {
            this.failedUploadDialogVisible = true;
            this.batchCode = val;
          },
        }
    }
</script>

<style scoped>

</style>
