<template>
  <div>
    <el-dialog
      v-loading="submitLoading"
      top="5vh"
      custom-class="user-add"
      title="引入用户"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="80%"
      @closed="dialogCloused"
      @open="dialogOpen">
      <div style="background: #fff; padding-top: 10px">
        <el-form ref="userForm" :model="pageQuery" label-width="30%" style=" border-bottom: 1px solid #eee;">
          <el-row>
            <el-col :span="6">
              <el-form-item label="用户代码" prop="userCode">
                <el-input v-model="pageQuery.userCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="用户名称" prop="userName">
                <el-input v-model="pageQuery.userName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-button style="margin-left: 100px" type="primary" @click="queryUserInOrgan">查询</el-button>
            </el-col>
          </el-row>
        </el-form>
        <div style="padding: 20px">
          <el-table header-cell-class-name="user-table-header" :data="tableData" tooltip-effect="dark" stripe @selection-change="tableSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="userCode" label="用户代码" />
            <el-table-column prop="userName" label="用户名称" />
            <el-table-column prop="organName" label="机构" />
          </el-table>
          <el-row>
          <el-button  style="margin-top: 20px" type="primary" @click="updateOrgan">引入</el-button>
          <el-pagination
            :current-page.sync="pageQuery.pageNum"
            background
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="pageQuery.pageSize"
            style="width: 100%; text-align: right; margin-top: 20px"
            layout="total,  prev, pager, next, sizes, jumper"
            :total="totalCount"
            @current-change="queryUserInOrgan"
            @size-change="
            pageQuery.pageNum = 1;
            queryUserInOrgan();
          "/>
          </el-row>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "AddUser",
    props: {
      value: Boolean,
      organData: Object
    },
    data() {
      return {
        AllCount: 0,
        tableSelection: [],
        totalCount: 0,
        tableData:[],//表单数据
        submitLoading:true,
        pageQuery: {
          userCode: null,
          userName: null,
          pageNum: 1,
          pageSize: 10,
          organId:null
        },
        userQueryAllParams: {
          "requestUrl": this.$axios.config.user.baseURL + this.$axios.config.user.userQuery,
          "requestType": "POST",
          "requestBody": ''
        },

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
      dialogOpen() {//对应一打开的方法
        this.submitLoading = true;
        this.pageQuery.organId = this.organData.organId;
        this.queryUserInOrgan();
      },
      dialogCloused() {//对应关闭的方法
        this.initPublicData();
      },
      //这个方法就是一进来就查询全部用户数据
      queryUserInOrgan(){
        this.userQueryAllParams.requestBody = JSON.stringify(this.pageQuery);
        this.$axios
          .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, this.userQueryAllParams)
          .then(response => {
            this.tableData = JSON.parse(response.data.responseStr).result.dataList;
           // this.$set(this.tableData, JSON.parse(response.data.responseStr).result.dataList);
            this.totalCount = JSON.parse(response.data.responseStr).result.totalCount;
          })
          .finally(() => {
            this.submitLoading = false;
          });
      },

      tableSelectionChange(selection) {
        this.tableSelection = selection;
      },
      updateOrgan(){
            console.log(330303030,this.tableSelection);
            console.log(99999999,this.organData);
            let param = {
              userList:this.tableSelection,//存放所选用户的数组
              organId:this.organData.organId//存放当前所选机构的id
            };

            let updateUserOrgan = {
               "requestUrl": this.$axios.config.organ.baseURL + this.$axios.config.organ.updatUserOrgan,
              "requestType": "POST",
              "requestBody": JSON.stringify(param)
            };
          this.submitLoading = true;
        this.$axios
          .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, updateUserOrgan)
          .then(response => {
            if (JSON.parse(response.data.responseStr).success) {
              this.$message.success("用户引入成功！");
              this.queryUserInOrgan();
            } else {
              this.$message.error(JSON.parse(response.data.responseStr).msg);
            }
          })
          .finally(() => {
            this.submitLoading = false;
          });
      }
    },
  }
</script>

<style>
  .user-add .el-dialog__header {
    background: #f8fbff;
  }
  .user-add .el-dialog__body {
    border-bottom: 1px solid #eee;
    padding: 10px 20px 30px;
  }
  .my-tree-header {
    background: rgb(248, 251, 255);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 40px;
    line-height: 40px;
    font-size: 15px;
    color: #c1c1c4;
  }
</style>
