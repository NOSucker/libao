<template>
  <el-dialog
    custom-class="vipValidateRole-edit"
    :title="dialogTitle"
    :visible.sync="showD"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="80%"
    @open="dOpen">
    <div v-loading="loading">
      <!--<h2 style="background: #f8fbff;font-size: 14px;padding: 10px;margin-bottom: 0;"></h2>-->
      <div style="background: #fff;">
        <!--<el-form ref="failedLog" :model="pagerQuery" label-width="30%" style=" border-bottom: 1px solid #eee;">
          <el-row>
            <el-col :span="6">
              <el-form-item label="省份" prop="areaCode">
                &lt;!&ndash;<tree-select
                  v-model="pagerQuery.reserve1"
                  node-key="areaId"
                  :remote-method="comQuery"
                  :props="{
                    children: 'subList',
                    value: 'areaId',
                    label: 'areaName'
                  }"></tree-select>&ndash;&gt;
                <el-select v-model="pagerQuery.areaCode" style="width: 100%">
                  <el-option v-for="para in subList" :key="para.reserve2" :label="para.areaName" :value="para.reserve2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="客户等级" prop="levelTypeCode">
                <el-select v-model="pagerQuery.levelTypeCode" style="width: 100%">
                  <el-option v-for="para in levelTypeLists" :key="para.key" :label="para.value" :value="para.key"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="服务类型" prop="serverTypeCode">
                <el-select v-model="pagerQuery.serverTypeCode" style="width: 100%">
                  <el-option label="税费代缴" :value="'taxpay'"></el-option>
                  <el-option label="待办年审" :value="'vehicle'"></el-option>
                  <el-option label="维修接送" :value="'accidentcar'"></el-option>
                  <el-option label="非事故道路救援" :value="'pannenhilfe'"></el-option>
                  <el-option label="拖车服务" :value="'trailer'"></el-option>
                  <el-option label="机场接送" :value="'airport'"></el-option>
                  <el-option label="酒后代驾" :value="'drink'"></el-option>
                  <el-option label="理赔代步" :value="'claim'"></el-option>
                  <el-option label="停车秘书" :value="'secretary'"></el-option>
                  <el-option label="安全检测" :value="'securityDetection'"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-button style="margin-left: 20px" type="primary" @click="queryData" icon="el-icon-search">查询</el-button>
              <el-button @click="resetAndQueryData" icon="el-icon-refresh">重置</el-button>
            </el-col>
          </el-row>
        </el-form>-->
        <div style="padding: 0 20px">
          <el-table header-cell-class-name="user-table-header" :data="tableData" tooltip-effect="dark" stripe @selection-change="tableSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="batchId" label="批次"></el-table-column>
            <el-table-column prop="importTime" label="导入时间" />
            <el-table-column prop="couponType" label="券码类型" />
            <el-table-column prop="agentCode" label="代理商"></el-table-column>
            <el-table-column prop="applicableBranch" label="适用分公司"></el-table-column>
            <el-table-column prop="couponCode" label="券码"></el-table-column>
            <el-table-column prop="startTime" label="有效起期"></el-table-column>
            <el-table-column prop="endTime" label="有效止期"></el-table-column>
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
    </div>
  </el-dialog>
</template>

<script>
    export default {
        name: "failed-uploads",
        props: {
          value: Boolean,
          data: String
        },
        computed: {
          showD: {
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
            dialogTitle: '券码上传错误纪录查询',
            loading: false,
            tableData: [],
            totalCount: 0,
            pagerQuery: {
              batchId: '',
              pageNum: 1,
              pageSize: 10,
              isSort: true,
              sortType: false,
              sortName: 'importTime'
            },
            tableSelection: [],
            params: {
              "requestUrl": this.$axios.config.file.baseURL + this.$axios.config.file.queryCouponCodeFailedBypage,
              "requestType": "POST",
              "requestBody": ""
            },
          }
        },
      methods: {
          queryData() {
            this.params.requestBody = JSON.stringify(this.pagerQuery);
            this.loading = true;
            this.$axios
              .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, this.params)
              .then(response => {
                this.tableData = JSON.parse(response.data.responseStr).result.dataList;
                this.totalCount = JSON.parse(response.data.responseStr).result.totalCount;
              })
              .finally(() => {
                this.loading = false;
              });
          },
          tableSelectionChange(selection) {
            this.tableSelection = selection;
          },
        dOpen() {
            console.log(1111111,this.data);
            this.pagerQuery.batchId = this.data;
            this.queryData();
        },
      }
    }
</script>

<style scoped>

</style>
