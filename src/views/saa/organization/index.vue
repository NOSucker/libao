<template>
  <div v-loading="submitLoading">
    <h2 style="background: #f8fbff;font-size: 14px;padding: 10px;margin-bottom: 0;">机构管理</h2>
    <div style="background: #fff; padding-top: 10px">
      <el-row :gutter="40">
        <el-col v-loading="treeLoading" :span="8">
          <div style="padding: 0 10px 10px ">
            <el-card
              v-loading="treeMask"
              style="height: 500px;  overflow-x: auto; overflow-y: auto;position: relative  "
              element-loading-text="您无法在添加编辑状态下切换机构"
              element-loading-spinner="el-icon-info"
              element-loading-background="rgba(0, 0, 0, 0.8)"
            >
              <div class="my-tree-header">
                <span style="margin-left: 10px;">机构树</span>
              </div>
              <el-tree
                ref="organTree"
                style="margin-top: 20px"
                node-key="organId"
                :load="loadNode"
                :props="props"
                :data="organTreeData"
                lazy
                :draggable="false"
                @node-click="onClickNode"
                highlight-current
              ></el-tree>
            </el-card>
          </div>
        </el-col>
        <el-col :span="16">
          <el-form ref="editForm" :model="organizationData" label-width="80px">
            <el-row>
              <el-col :span="10">
                <el-form-item prop="organCode" label="机构代码" :rules="[{ required: pageModel !== 'view', message: '请输入机构代码', trigger: 'blur' }]">
                  <el-input v-model="organizationData.organCode" :disabled="pageModel === 'view'"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="机构名称" prop="organName" :rules="[{ required: pageModel !== 'view', message: '请输入机构名称', trigger: 'blur' }]">
                  <el-input v-model="organizationData.organName" :disabled="pageModel === 'view'"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item prop="supperComName" label="上级机构" :rules="[{ required: false, message: '请点击选择上级机构', trigger: 'change' }]">
                  <el-input v-model="organizationData.parentId" placeholder="无上级机构" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10" v-if="pageModel !== 'new' || pageModel !== 'edit'">
                <el-form-item label="用户数量" prop="userCount" >
                  <el-input v-model="organizationData.userCount" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="可咨询组" prop="consultationGroup">
                  <select-tree v-model="organizationData.refereeOrganId" :model="organizationData.refereeOrganId" :options="selectTreeData" :default-props="organTreeData.organName" :value="1"
                               :default-check-nodes="showTreeData" :disabled="pageModel === 'view'" @fromChild="getChild">
                  </select-tree>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="可管理组" prop="manngerGroup">
                  <select-tree v-model="organizationData.controllableId" :model="organizationData.controllableId" :options="selectTreeData" :value="1"
                               :default-props="organTreeData.organName" :default-check-nodes="showTreeData" :disabled="pageModel === 'view'" @fromChildMannger="getChildMannger">
                  </select-tree>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row
              v-if="pageModel === 'new' || pageModel === 'child' || pageModel === 'edit'"
              style="text-align: center;padding-top: 15px; border-top: 1px solid #eee;">
              <el-button type="primary" @click="submitForm">提交</el-button>
              <el-button @click="$refs.editForm.resetFields()">重置</el-button>
              <el-button @click="backToView">返回</el-button>
            </el-row>
            <el-row v-if="pageModel === 'view'" style="text-align: center;padding-top: 15px; border-top: 1px solid #eee;">
              <el-button @click="operateCLK('new')">新增</el-button>
              <el-button @click="operateCLK('edit')">修改</el-button>
              <el-button v-if="organizationData.validStatus !== '0'" type="danger" @click="deleteOrganization">删除</el-button>
              <el-button  @click="userAddClick()">引入员工</el-button>
              <el-button @click="insertStaff()">新增员工</el-button>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <add-user
      v-model="showFlag"
      :organ-data="dialogUserData"
      @role-edit-close="
        pagerQuery._pageNo = 1;
        queryData();
      "
    >
    </add-user>
  </div>
</template>

<script>
  import selectTree from "./component/selectTree";
  import addUser from "./component/addUser";
export default {
  name: "Organization",
  components:{
    selectTree,
    addUser
  },
  data() {
    return {
      organTreeData: [],
      organTreeData1:[],
      organTreeData2:[],
      selectTreeData:[],//用于存放下拉树
      dialogUserData: {},//用于存放点击的当前机构的数据
      beforeTreeData: [],
      treeLoading: false,
      pageModel: "view",
      treeMask: false,
      upperComName: null,
      isParent: false,
      organizationData: {
        parentId: null,//上级机构名称
        organCode: null,//该机构代码
        organName: null,//该机构名称
        controllableId: null,//可管理组
        refereeOrganId: null,//可咨询组
        userCount:null,//用户数量
      },
      parentOrganData: {
        organId: 'rootOrganId',
        tenantId: 'default',
        organCode: 'default',
        paperId: null,
        organName: '机构根节点',
        refereeOrganId: null,
        controllableId: null
      },
      showTreeData: [],
      props: {
        label: "organName",
        children: "children",
      },
      submitLoading: false,
      dragNodeParent: null,
      dragNodeIndex: -1,
      showFlag:false,
      addStatus: ""
    };
  },
  watch: {
    pageModel(newV) {
      if (newV !== "view") {
        this.treeMask = true;
      } else {
        this.treeMask = false;
      }
    }
  },
  methods: {
    userAddClick() {//此方法是打开子组件的方法（引入员工）
      this.showFlag = true;
    },
    //此方法是点击新增员工是跳到员工的新增页面
    insertStaff(){
      this.$router.push({
        path:'/user',
        }
      );
    },
    //此方法用于接收子组件传过来的可咨询组值
    getChild(data){
      var Str=data.join(",");
     this.organizationData.refereeOrganId=Str;
    },
    //此方法用于接收传过来的可管理组的值
    getChildMannger(data){
      var Srt=data.join(",");
      this.organizationData.controllableId=Srt;
    },
    onClickNode(node) {
      this.dialogUserData=node;
      this.organizationData = JSON.parse(JSON.stringify(node));
      if (node) {
        this.parentOrganData = node;
      }
      if (this.pageModel === "new" || this.pageModel === "edit") {
        if (node) {
          this.$set(this.organizationData, "parentId", node.parentId);
        } else {
          this.$set(this.organizationData, "parentId", 'rootOrganId');
        }
      }
      //点击一次就调用一次后端接口查出当前机构的父id
      let parentId = '';
      if (node) {
      parentId = '/' + node.parentId;
    }
      let parentOrgan={
        "requestUrl": this.$axios.config.organ.baseURL + this.$axios.config.organ.queryParentName + parentId,
        "requestType": "GET"
      }
      this.$axios
        .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, parentOrgan)
        .then(response => {
          if (JSON.parse(response.data.responseStr).success) {
            this.$set(this.organizationData, "parentId", JSON.parse(response.data.responseStr).result);
          } else {
            this.$message.error(JSON.parse(response.data.responseStr).msg);
          }
        })

      //点击一次就去查该机构的用户数量
      let userCount='';
      if(node.organId){
        userCount='/' + node.organId;

      let userCountParam={
        "requestUrl": this.$axios.config.organ.baseURL + this.$axios.config.organ.queryUserCount + userCount,
        "requestType": "GET"
      }
        this.$axios
          .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, userCountParam)
          .then(response => {
            if (JSON.parse(response.data.responseStr).success) {
              this.$set(this.organizationData, "userCount", JSON.parse(response.data.responseStr).result);
            } else {
              this.$message.error(JSON.parse(response.data.responseStr).msg);
            }
          })
      }

      //点击一次就去查询是否有子节点
      let isChild='';
      if(node.organId){
        isChild ='/' + node.organId;;

        let isChildParam = {
          "requestUrl": this.$axios.config.organ.baseURL + this.$axios.config.organ.queryIsChild + isChild,
          "requestType": "GET"
        }
        this.$axios
          .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, isChildParam)
          .then(response => {
            if (JSON.parse(response.data.responseStr).success) {

              this.isParent = JSON.parse(response.data.responseStr).result;
            } else {
              this.$message.error(JSON.parse(response.data.responseStr).msg);
            }
          })
      }

      return;
    },

    loadNode(node, resolve) {
      if (node.data.length !== 0 && node.data){
       // 第一次加载获取当前登陆用户可以看见的机构（先注释）
     //this.getTreeDataWithUser(node, resolve);------原本代码
        this.parentOrganData = node.data;
      }
      let parentId = '';
      if (node.data.length !== 0) {
        //以当前所选节点的id作为查询的parentId去查到以此id为parentId的所有子节点
        parentId = '/' + node.data.organId;
      } else {
        //-------------------直接调用后端查根节点的接口----parentId = '/rootOrganId';
       let rootOrgan={
          "requestUrl": this.$axios.config.organ.baseURL + this.$axios.config.organ.queryRootOrgan,
          "requestType": "GET"
        }
        this.$axios
          .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, rootOrgan)
          .then(response => {
            if (JSON.parse(response.data.responseStr).success) {
              this.organTreeData = JSON.parse(response.data.responseStr).result;
            } else {
              this.$message.error(JSON.parse(response.data.responseStr).msg);
            }
          })
        return;
      }

      let param = {
        "requestUrl": this.$axios.config.organ.baseURL + this.$axios.config.organ.queryOrganByParentId + parentId,
        "requestType": "GET"
      }
      if (node.data.length === 0) {
        // 第一次加载获取当前登陆用户可以看见的机构
        this.treeLoading = true;
        // const theUserCode = JSON.parse(localStorage.getItem("userInfo")).userCode;
        this.$axios
          .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, param)
         .then(response => {
          // this.isParent = JSON.parse(response.data.responseStr).result.length > 0 ? true : false;
           if (JSON.parse(response.data.responseStr).success) {
             if (node.data || node.data.organId) {
               if (JSON.parse(response.data.responseStr) && JSON.parse(response.data.responseStr).result && JSON.parse(response.data.responseStr).result.length > 0) {
                 this.organTreeData = JSON.parse(response.data.responseStr).result;

               } else {
                 resolve([]);
               }
             } else {
               resolve(response.data.responseStr);
             }
           } else {
             this.$message.error(JSON.parse(response.data.responseStr).msg);
           }
         })
         .catch(() => {
          resolve([]);
         })
           .finally(() => {
            this.treeLoading = false;
           });
     } else {
        // 获取下级机构
        this.treeLoading = true;
        this.$axios
          .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, param)
          .then(response => {
            //this.isParent = JSON.parse(response.data.responseStr).result.length > 0 ? true : false;
            if (JSON.parse(response.data.responseStr).success) {
              if (node.data && node.data.organId) {
                if (JSON.parse(response.data.responseStr) && JSON.parse(response.data.responseStr).result && JSON.parse(response.data.responseStr).result.length > 0) {
                  resolve(JSON.parse(response.data.responseStr).result);

                } else {
                  resolve([]);
                }
              } else {
                resolve(response.data.data);
              }
            } else {
              this.$message.error(JSON.parse(response.data.responseStr).msg);
            }
          })
          .catch(() => {
            resolve([]);
          })
          .finally(() => {
            this.treeLoading = false;
          });
      }
      //这里写的方法就是一开始进来同时也把新增下拉树全部查出来
      let selectTree = {
        "requestUrl": this.$axios.config.organ.baseURL + this.$axios.config.organ.getAllOrgan,
        "requestType": "GET"
      }
      this.$axios
        .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, selectTree)
        .then(response => {
          if (JSON.parse(response.data.responseStr).success) {
            this.selectTreeData=JSON.parse(response.data.responseStr).result;
          } else {
            this.$message.error(JSON.parse(response.data.responseStr).msg);
          }
        })

     },
    submitForm() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          let PostData = {
            "requestUrl": this.$axios.config.organ.baseURL + this.$axios.config.organ.createOrUpdateOrganization,
            "requestType": "POST",
            "requestBody": JSON.stringify(this.organizationData)
          };
          this.submitLoading = true;
          this.$axios
            .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, PostData)
            .then(response => {
          /*
                this.handelTree();//这2个方法是原来写的重筑机构树和回显
                this.backToView();
         */
              if (JSON.parse(response.data.responseStr).success) {
                this.$message.success("操作成功!");
                this.handelTree();
                this.backToView();
              } else {
                this.$message.error(JSON.parse(response.data.responseStr).msg);
              }
            })
            .finally(() => {
              this.submitLoading = false;
            });
        }
      });
    },
    operateCLK(type) {
      let node = this.$refs.organTree.getCurrentNode();
      if (type === "edit") {
        if (!this.organizationData.organCode) {
          this.$message.error("请您先选择一个需要修改的机构！");
          return;
        }
        this.organizationData = JSON.parse(JSON.stringify(node));
      }
      if (type === "new" ) {
        this.organizationData = {
          parentId: null,//上级机构名称
          organCode: null,//该机构代码
          organName: null,//该机构名称
          controllableId: null,//可管理组
          refereeOrganId: null,//可咨询组
          userCount:null//用户数量
        };
        //这里需要一个点击新增就查询上级机构的方法
        let node = this.$refs.organTree.getCurrentNode();
        let parentName="/"+ node.organId;
        let pOrgan={
          "requestUrl": this.$axios.config.organ.baseURL + this.$axios.config.organ.queryParentName+ parentName,
          "requestType": "GET"
        }
        this.$axios
          .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, pOrgan)
          .then(response => {
            if (JSON.parse(response.data.responseStr).success) {
              this.organizationData.parentId = JSON.parse(response.data.responseStr).result;
            } else {
              this.$message.error(JSON.parse(response.data.responseStr).msg);
            }
          })
      }
      this.pageModel = type;
    },

    backToView() {
      this.organizationData = {
        parentId: null,//上级机构名称
        organCode: null,//该机构代码
        organName: null,//该机构名称
        controllableId: null,//可管理组
        refereeOrganId: null,//可咨询组
        userCount:null//用户数量
      };
      this.pageModel = "view";
      this.$nextTick(() => {
        this.$refs.editForm.clearValidate();
      });
    },
    // 删除机构
    deleteOrganization() {
      if (!this.organizationData.organCode) {
        this.$message.error("请您选择一个需要删除的机构！");
        return;
      }
      if (this.isParent=="true") {
        this.$message.error("当前所选菜单含子菜单，不能跨级删除，请先删除子菜单");
        return;
      }
        this.$confirm("您确定要删除此机构吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let deleteParam = {
              "requestUrl": this.$axios.config.organ.baseURL + this.$axios.config.organ.deleteOrgan + '/' + this.organizationData.organId,
              "requestType": "GET"
            }
            this.submitLoading = true;
            this.$axios
              .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, deleteParam)
              .then(res => {
                if (JSON.parse(res.data.responseStr).success) {
                  this.$message.success("删除成功!");
                  // 重新构筑树
                  this.handelTree();
                 //this.backToView();
                 //this.loadNode();
                } else {
                  this.$message.success(res.data.statusText);
                }
              })
              .finally(() => {
                this.submitLoading = false;
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
    },

    handelTree(){
      //就是调第一次加载树的第一个请求
      let rootOrgan={
        "requestUrl": this.$axios.config.organ.baseURL + this.$axios.config.organ.queryRootOrgan,
        "requestType": "GET"
      }
      this.$axios
        .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, rootOrgan)
        .then(response => {
          if (JSON.parse(response.data.responseStr).success) {
            this.organTreeData = JSON.parse(response.data.responseStr).result;
          } else {
            this.$message.error(JSON.parse(response.data.responseStr).msg);
          }
        })
      this.organizationData = {
        parentId: null,//上级机构名称
        organCode: null,//该机构代码
        organName: null,//该机构名称
        controllableId: null,//可管理组
        refereeOrganId: null,//可咨询组
        userCount:null//用户数量
      };
    },
    // 恢复机构
    recoverOrganization() {
      let postData = JSON.parse(JSON.stringify(this.organizationData));
      postData.validStatus = "1";
      if (this.organizationData.upperComCode) {
        const upperNode = this.$refs.taskTree.getNode(this.organizationData.upperComCode);
        if (upperNode) {
          if (upperNode.data.validStatus === "0") {
            this.$message.warning("请您先恢复上级机构的有效状态后，再恢复此机构！");
            return;
          }
        }
      }
      this.submitLoading = true;
      this.$axios
        .post(this.$axios.config.saa.baseURL + this.$axios.config.saa.updateOrganization, postData)
        .then(response => {
          if (response.data.status === 0) {
            this.$message.success("操作成功!");
            this.handelTree();
            this.backToView();
          } else {
            this.$message.error(response.data.statusText);
          }
        })
        .finally(() => {
          this.submitLoading = false;
        });
    }
  }
};
</script>

<style scoped>
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
