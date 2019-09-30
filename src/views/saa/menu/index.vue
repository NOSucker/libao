<template>
  <div v-loading="submitLoading">
    <h2 style="background: #f8fbff;font-size: 14px;padding: 10px;margin-bottom: 0;">菜单管理</h2>
    <div style="background: #fff; padding-top: 10px">
      <el-row :gutter="40">
        <el-col v-loading="treeLoading" :span="8">
          <div style="padding:  0 10px 10px">
            <el-card
              v-loading="treeMask"
              style="height: 500px;  overflow-x: auto; overflow-y: auto; position: relative "
              element-loading-text="您无法在修改状态下切换菜单"
              element-loading-spinner="el-icon-info"
              element-loading-background="rgba(0, 0, 0, 0.8)"
            >
              <div class="my-tree-header">
                <span style="margin-left: 10px;" @click="clickRoot">系统菜单根节点</span>
              </div>
              <el-tree
                ref="menuTree"
                style="margin-top: 20px"
                node-key="menuId"
                :load="loadMenuNode"
                :props="menuTreeProps"
                lazy
                :data="menuTreeData"
                @node-click="menuNodeClick"
              ></el-tree>
            </el-card>
          </div>
        </el-col>
        <el-col :span="16">
          <el-form ref="menuForm" :model="menuData" label-width="80px">
            <el-row>
              <el-col :span="10">
                <el-form-item prop="upperTaskName" label="上级目录">
                  <el-input v-model="menuData.upperTaskName" placeholder="无上级目录，将作为根菜单" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="菜单类型" prop="menuType" :rules="[{ required: pageModel !== 'view', message: '请输入菜单类型', trigger: 'blur' }]">
                  <el-input v-model="menuData.menuType" :disabled="pageModel === 'view' || pageModel === 'edit'"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
            <el-col :span="10">
              <el-form-item :label="pageModel === 'view' ? '菜单名称' : '目录名称'" prop="menuName" :rules="[{ required: pageModel !== 'view', message: '请输入目录名称', trigger: 'blur' }]">
                <el-input v-model="menuData.menuName" :disabled="pageModel === 'view' || pageModel === 'edit'"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="功能代码" prop="taskCode" :rules="[{ required: pageModel !== 'view', message: '请输入功能代码', trigger: 'blur' }]">
                <el-input v-model="menuData.taskCode" :disabled="pageModel === 'view' || pageModel === 'edit'"></el-input>
              </el-form-item>
            </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="打开图标" prop="openIcon" :rules="[{ required: pageModel !== 'view', message: '请输入打开图标', trigger: 'blur' }]">
                  <el-input v-model="menuData.openIcon" :disabled="pageModel === 'view' || pageModel === 'edit'"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="关闭图标" prop="closeIcon" :rules="[{ required: pageModel !== 'view', message: '请输入关闭图标', trigger: 'blur' }]">
                  <el-input v-model="menuData.closeIcon" :disabled="pageModel === 'view' || pageModel === 'edit'"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="序号" prop="displayNo" :rules="[{ required: pageModel !== 'view', message: '请输入序号', trigger: 'blur' }]">
                  <el-input-number v-model="menuData.displayNo" :disabled="pageModel === 'view' || pageModel === 'edit'" controls-position="right" :min="1" :max="6"></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="菜单名称" prop="menuName" :rules="[{ required: pageModel !== 'view', message: '请输入菜单名称', trigger: 'blur' }]">
                  <el-input v-model="menuData.menuName" :disabled="pageModel === 'view'"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item prop="url" label="URL">
                  <el-input v-model="menuData.url" :disabled="pageModel === 'view'"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="pageModel === 'add' || pageModel === 'edit'" style="text-align: center;padding-top: 15px; border-top: 1px solid #eee;">
              <el-button type="primary" @click="submitForm">提交</el-button>
              <el-button @click="$refs.menuForm.resetFields()">重置</el-button>
              <el-button @click="backToView">返回</el-button>
            </el-row>
            <el-row v-if="use === false" style="text-align: center;padding-top: 15px; border-top: 1px solid #eee;">
              <el-button v-if="'root' === this.parentMenuData.menuType || 'dir' === this.parentMenuData.menuType" @click="operationMenu('add')">创建目录</el-button>
            </el-row>
            <el-row v-if="pageModel === 'view' && use === true" style="text-align: center;padding-top: 15px; border-top: 1px solid #eee;">
              <!--<el-button v-if="menuData.level < 3" @click="operationMenu('add')">{{ buttonName }}</el-button>-->
              <el-button v-if="'root' === this.parentMenuData.menuType || 'dir' === this.parentMenuData.menuType" @click="operationMenu('add')">创建目录</el-button>
              <el-button @click="operationMenu('add')">创建子页面</el-button>
              <el-button @click="operationMenu('edit')">修改</el-button>
              <el-button v-if="menuData.validind !== '0'" type="danger" @click="deleteMenu">删除</el-button>
              <el-button v-if="menuData.validind === '0'" type="success" @click="recoverMenu">还原有效</el-button>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "Menu",
  data() {
    return {
      menuTreeData: [],
      menuTreeProps: {
        label: "menuName",
        children: "children"
      },
      use: false,
      pageModel: "view",
      treeLoading: false,
      treeMask: false,
      submitLoading: false,
      parentMenuData: {
        menuId: 'menu5acfcbb1cfbc4c3e9247db3325210b06',
        tenantId: 'default',
        url: null,
        remark: null,
        taskCode: null,
        displayNo: 1,
        parentId: null,
        moduleId: null,
        openIcon: null,
        closeIcon: null,
        menuType: 'root',
        menuName: '系统菜单根节点',
        sysMenu: 'Y',
        sysMenuId: null
      },
      menuData: {
        upperTaskName: null,
        upperTaskCode: null,
        level: null,
        tenantId: 'default',
        url: null,
        remark: null,
        taskCode: null,
        displayNo: null,
        parentId: null,
        moduleId: null,
        openIcon: null,
        closeIcon: null,
        menuType: null,
        menuName: null,
        sysMenu: null,
        sysMenuId: null
      },
      menuDataNew: {
        upperTaskName: null,
        upperTaskCode: null,
        level: null,
        tenantId: 'default',
        url: null,
        remark: null,
        taskCode: null,
        displayNo: null,
        parentId: null,
        moduleId: null,
        openIcon: null,
        closeIcon: null,
        menuType: null,
        menuName: null,
        sysMenu: null,
        sysMenuId: null
      }
    };
  },
  computed: {
    buttonName: {
      set() {},
      get() {
        if ('root' === this.menuData.menuType || 'dir' === this.menuData.menuType) {
          return "创建目录";
        } else {
          return "创建子页面";
        }
      }
    }
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
    clickRoot() {
      this.use = false;
      this.menuData = this.menuDataNew;
    },
    menuNodeClick(node) {
      this.use = true;
      this.menuData = JSON.parse(JSON.stringify(node));
      if (this.pageModel === "add") {
        /*this.$set(this.menuData, "upperTaskCode", node.upperTaskCode);
        this.$set(this.menuData, "upperTaskName", node.upperTaskName);
        this.$set(this.menuData, "level", node.level ? node.level + 1 : 1);*/
        if (node) {
          this.$set(this.menuData, "parentId", node.parentId);
        } else {
          this.$set(this.menuData, "parentId", 'menucc01253c617948f1933b1a390eaec884');
        }
      }
    },
    loadMenuNode(node, resolve) {
      if (node.data.length !== 0 && node.data) {
        this.parentMenuData = node.data;
      }
      console.log(1111, this.parentMenuData)
      let parentId = '';
      if (node.data.length !== 0) {
        //以当前所选节点的id作为查询的parentId去查到以此id为parentId的所有子节点
        parentId = '/' + node.data.menuId;
      } else {
        //写死的根节点
        parentId = '/menu5acfcbb1cfbc4c3e9247db3325210b06';
      }
      //构造查询菜单的请求参数
      let param = {
        "requestUrl": this.$axios.config.menu.baseUrl + this.$axios.config.menu.queryMenuByParentId + parentId,
        "requestType": "GET"
      }
      if (node.data.length === 0) {
        // 第一次加载获取当前登陆用户可以看见的机构
        this.treeLoading = true;
        // const theUserCode = JSON.parse(localStorage.getItem("userInfo")).userCode;
        this.$axios
          // .get(this.$axios.config.saa.baseURL + this.$axios.config.saa.getMenuWithUser.format({ userCode: theUserCode }))
          .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, param)
          .then(response => {
            if (JSON.parse(response.data.responseStr).success) {
              if (node.data.menuId || node.data) {
                // 第一次应该不会执行到这里 但是为了安全写一下
                if (JSON.parse(response.data.responseStr) && JSON.parse(response.data.responseStr).result && JSON.parse(response.data.responseStr).result.length > 0) {
                  this.menuTreeData = JSON.parse(response.data.responseStr).result;
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
      } else {
        // 获取下级机构
        this.treeLoading = true;
        this.$axios
          // .get(this.$axios.config.saa.baseURL + this.$axios.config.saa.getSubMenu.format({ taskCode: node.data.taskCode }))
          .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, param)
          .then(response => {
            if (JSON.parse(response.data.responseStr).success) {
              if (node.data && node.data.menuId) {
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
    },
    operationMenu(type) {
      if (type === "edit" && !this.menuData.taskCode) {
        this.$message.error("请您选择一个需要修改的菜单！");
        return;
      }
      if (type === "add") {
        this.menuData = {
          /*upperTaskName: null,
          upperTaskCode: null,
          level: null,*/
          parentId: null,
          url: null,
          taskCode: null,
          menuName: null
        };
        let node = this.$refs.menuTree.getCurrentNode();
        if (node) {
          /*this.$set(this.menuData, "upperTaskName", node.upperTaskName);
          this.$set(this.menuData, "upperTaskCode", node.upperTaskCode);
          this.$set(this.menuData, "lever", node.level + 1);*/
          this.$set(this.menuData, "parentId", node.menuId);
        } else {
          //如果未获取带节点，则为设置父节点为根节点
          this.$set(this.menuData, "parentId", "menucc01253c617948f1933b1a390eaec884")
        }
      }
      this.pageModel = type;
    },
    backToView() {
      this.pageModel = "view";
      this.$nextTick(() => {
        this.$refs.menuForm.validateField("taskCode");
        this.$refs.menuForm.validateField("menuName");
      });
    },
    deleteMenu() {
      if (!this.menuData.taskCode) {
        this.$message.error("请您选择一个需要删除的菜单！");
        return;
      }
      this.$confirm("您确定要删除此菜单吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.submitLoading = true;
          this.$axios
            .delete(this.$axios.config.saa.baseURL + this.$axios.config.saa.deleteMenu, {
              data: [this.menuData.taskCode]
            })
            .then(res => {
              if (res.data.status === 0) {
                this.$message.success("删除成功!");
                this.handleTreeData();
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
    handleTreeData() {
      if (!this.menuData.upperTaskCode) {
        this.menuTreeData = [];
        this.treeLoading = true;
        const theUserCode = JSON.parse(localStorage.getItem("userInfo")).userCode;
        this.$axios
          .get(this.$axios.config.saa.baseURL + this.$axios.config.saa.getMenuWithUser.format({ userCode: theUserCode }))
          .then(response => {
            if (response.data.status === 0) {
              this.menuTreeData = response.data.data;
            } else {
              this.$message.error(response.data.statusText);
            }
          })
          .finally(() => {
            this.treeLoading = false;
          });
        this.pageModel = "view";
      } else {
        let currentTask = this.menuData.upperTaskCode;
        // 更新tree节点数据
        this.$axios
          .get(this.$axios.config.saa.baseURL + this.$axios.config.saa.getSubMenu.format({ taskCode: currentTask }))
          .then(response => {
            if (response.data.status === 0) {
              if (response.data.data && response.data.data.subLists && response.data.data.subLists.length > 0) {
                let currentNode = this.$refs.menuTree.getNode(currentTask);
                currentNode.data.subLists.splice(0, currentNode.data.subLists.length);
                this.$refs.menuTree.updateKeyChildren(currentTask, response.data.data.subLists);
              } else {
                this.$refs.menuTree.updateKeyChildren(currentTask, []);
              }
              this.pageModel = "view";
            } else {
              this.$message.error(response.data.statusText);
            }
          })
          .catch(err => {
            console.log(err);
          })
          .finally(() => {
            this.treeLoading = false;
          });
      }
      this.menuData = {
        upperTaskName: null,
        upperTaskCode: null,
        url: null,
        level: null,
        taskCode: null,
        menuName: null
      };
    },
    submitForm() {
      this.$refs.menuForm.validate(valid => {
        if (valid) {
          let PostData = {
            "requestUrl": this.$axios.config.menu.baseUrl + this.$axios.config.menu.saveOrUpdate,
            "requestType": "POST",
            "requestBody": JSON.stringify(this.menuData)
          };
          // let PostData = [this.menuData];
          /*if (this.pageModel === "edit") {
            tempUrl = this.$axios.config.saa.updateMenu;
            PostData = JSON.parse(JSON.stringify(this.menuData));
          }*/
          // 手动设置type h饿 clazz 后端要求不能为空。 根据业务需求要自己调整
          /*if (this.pageModel === "add") {
            PostData[0].type = "1";
            PostData[0].validind = "1";
            PostData[0].clazz = "1";
          }*/
          this.submitLoading = true;
          this.$axios
            .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, PostData)
            .then(response => {
              console.log(3333333333,response)
              if (JSON.parse(response.data.responseStr).success) {
                this.$message.success("操作成功!");
                this.handleTreeData();
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
    // 还原到有效
    recoverMenu() {
      if (this.menuData.upperTaskCode) {
        const upperNode = this.$refs.menuTree.getNode(this.menuData.upperTaskCode);
        if (upperNode) {
          if (upperNode.data.validind === "0") {
            this.$message.warning("请您先恢复上级机构的有效状态后，再恢复此机构！");
            return;
          }
        }
      }
      this.submitLoading = true;
      let PostData = JSON.parse(JSON.stringify(this.menuData));
      PostData.validind = "1";
      this.$axios
        .post(this.$axios.config.saa.baseURL + this.$axios.config.saa.updateMenu, PostData)
        .then(response => {
          if (response.data.status === 0) {
            this.$message.success("操作成功!");
            this.handleTreeData();
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
