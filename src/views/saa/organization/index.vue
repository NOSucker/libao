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
              element-loading-text="您添加编辑状态下切换机构"
              element-loading-spinner="el-icon-info"
              element-loading-background="rgba(0, 0, 0, 0.8)"
            >
              <div class="my-tree-header">
                <span style="margin-left: 10px;">机构树</span>
              </div>
              <el-tree
                ref="taskTree"
                style="margin-top: 20px"
                node-key="comCode"
                :load="loadNode"
                :props="props"
                :data="treeData"
                lazy
                :draggable="true"
                @node-drag-start="nodeDragStart"
                @node-drop="dragEndFun"
                @node-click="onClickNode"
              ></el-tree>
            </el-card>
          </div>
        </el-col>
        <el-col :span="16">
          <el-form ref="editForm" :model="organizationData" label-width="80px">
            <el-row>
              <el-col :span="10">
                <el-form-item prop="upperComName" label="上级机构" :rules="[{ required: false, message: '请点击选择上级机构', trigger: 'change' }]">
                  <el-input v-model="organizationData.upperComName" placeholder="无上级机构" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item prop="comCode" label="机构代码" :rules="[{ required: pageModel !== 'view', message: '请输入机构代码', trigger: 'blur' }]">
                  <el-input v-model="organizationData.comCode" :disabled="pageModel === 'view' || pageModel === 'edit'"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="机构名称" prop="comName" :rules="[{ required: pageModel !== 'view', message: '请输入机构名称', trigger: 'blur' }]">
                  <el-input v-model="organizationData.comName" :disabled="pageModel === 'view'"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="负责人" prop="roleName">
                  <el-input v-model="organizationData.manAger" :disabled="pageModel === 'view'"></el-input>
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
              <el-button @click="operateCLK('new')">创建根机构</el-button>
              <el-button v-if="organizationData.comCode" @click="operateCLK('child')">创建子机构</el-button>
              <el-button @click="operateCLK('edit')">修改</el-button>
              <el-button v-if="organizationData.validStatus !== '0'" type="danger" @click="deleteOrganization">删除</el-button>
              <el-button v-if="organizationData.validStatus === '0'" type="success" @click="recoverOrganization">还原有效</el-button>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "Organization",
  data() {
    return {
      treeData: [],
      beforeTreeData: [],
      treeLoading: false,
      pageModel: "view",
      treeMask: false,
      upperComName: null,
      organizationData: {
        upperComName: null,
        // 上级机构
        upperComCode: null,
        //机构代码
        comCode: null,
        comName: null,
        manAger: null,
        comLevel: null
      },
      showTreeData: [],
      props: {
        label: "comName",
        children: "subList",
        isLeaf: "leaf"
      },
      submitLoading: false,
      dragNodeParent: null,
      dragNodeIndex: -1
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
    nodeDragStart(node) {
      this.dragNodeIndex = node.parent.childNodes.indexOf(node);
      node.data.leaf = node.isLeaf;
      this.dragNodeParent = node.parent;
    },
    dragEndFun(dragNode, referNode, type) {
      //dragNode 被拖拽的Node, referNode 参照物的Node  type 插入的类型， inner需要特殊处理
      let PostDragData = {
        upperComCode: null,
        comLevel: null,
        comCode: dragNode.data.comCode
      };
      if (type === "inner") {
        PostDragData.upperComCode = referNode.data.comCode;
        PostDragData.comLevel = parseInt(referNode.data.comLevel, 10) + 1;
      } else {
        PostDragData.upperComCode = referNode.data.upperComCode;
        PostDragData.comLevel = referNode.data.comLevel;
      }

      this.$confirm("确定移动机构?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (type === "inner" && referNode.data.leaf) {
            referNode.isLeaf = false;
            referNode.data.leaf = false;
          }
          this.treeLoading = true;
          this.$axios
            .post(this.$axios.config.saa.baseURL + this.$axios.config.saa.dragOrganization, PostDragData)
            .then(response => {
              if (response.data.status === 0) {
                // 判断有没有upperComCode这个节点， 有更新下面的数据， 没有更新整个树
                this.$message.success("节点位置变更成功");
              } else {
                this.$refs.taskTree.remove(dragNode.data.comCode);
                if (this.dragNodeIndex + 1 <= this.dragNodeParent.childNodes.length) {
                  this.$refs.taskTree.insertBefore(dragNode.data, this.dragNodeParent.childNodes[this.dragNodeIndex]);
                } else {
                  this.$refs.taskTree.append(dragNode.data, this.dragNodeParent);
                }
                this.$message.error(response.data.statusText);
              }
            })
            .finally(() => {
              this.treeLoading = false;
            });
        })
        .catch(() => {
          this.$refs.taskTree.remove(dragNode.data.comCode);
          if (this.dragNodeIndex + 1 <= this.dragNodeParent.childNodes.length) {
            this.$refs.taskTree.insertBefore(dragNode.data, this.dragNodeParent.childNodes[this.dragNodeIndex]);
          } else {
            this.$refs.taskTree.append(dragNode.data, this.dragNodeParent);
          }
        });
    },
    onClickNode(node) {
      this.organizationData = node;
    },
    getTreeDataWithUser(node, resolve) {
      this.treeLoading = true;
      const theUserCode = JSON.parse(localStorage.getItem("userInfo")).userCode;
      this.$axios
        .get(this.$axios.config.saa.baseURL + this.$axios.config.saa.availableOrganization, {
          params: {
            userCode: theUserCode
          }
        })
        .then(response => {
          if (response.data.status === 0) {
            resolve(response.data.data);
          } else {
            this.$message.error(response.data.statusText);
          }
        })
        .catch(() => {
          resolve([]);
        })
        .finally(() => {
          this.treeLoading = false;
        });
    },

    loadNode(node, resolve) {
      if (!node.data || (node.data && node.data.length === 0)) {
        // 第一次加载获取当前登陆用户可以看见的机构
        this.getTreeDataWithUser(node, resolve);
      } else {
        // 获取下级机构
        this.treeLoading = true;
        this.$axios
          .get(this.$axios.config.saa.baseURL + this.$axios.config.saa.getSubCompany.format({ comCode: node.data.comCode }))
          .then(response => {
            if (response.data.status === 0) {
              if (node.data && node.data.comCode) {
                if (response.data.data[0] && response.data.data[0].subList && response.data.data[0].subList.length > 0) {
                  resolve(response.data.data[0].subList);
                } else {
                  resolve([]);
                }
              } else {
                resolve(response.data.data);
              }
            } else {
              this.$message.error(response.data.statusText);
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
    handelTree(upperCode, needGetRoot) {
      if (!this.organizationData.upperComCode || needGetRoot) {
        this.treeData = [];
        const theUserCode = JSON.parse(localStorage.getItem("userInfo")).userCode;
        this.$axios
          .get(this.$axios.config.saa.baseURL + this.$axios.config.saa.availableOrganization, {
            params: {
              userCode: theUserCode
            }
          })
          .then(response => {
            if (response.data.status === 0) {
              this.treeData = response.data.data;
            } else {
              this.$message.error(response.data.statusText);
            }
          });
      } else {
        let currentCom = upperCode ? upperCode : this.organizationData.upperComCode;
        // 更新tree节点数据
        this.$axios
          .get(this.$axios.config.saa.baseURL + this.$axios.config.saa.getSubCompany.format({ comCode: currentCom }))
          .then(response => {
            if (response.data.status === 0) {
              if (response.data.data[0] && response.data.data[0].subList && response.data.data[0].subList.length > 0) {
                let currentNode = this.$refs.menuTree.getNode(currentCom);
                currentNode.data.subLists.splice(0, currentNode.data.subLists.length);
                this.$refs.taskTree.updateKeyChildren(currentCom, response.data.data[0].subList);
              } else {
                this.$refs.taskTree.updateKeyChildren(currentCom, []);
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
            this.submitLoading = false;
          });
      }
    },
    submitForm() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          let tempUrl = this.$axios.config.saa.createOrganization;
          let PostData = [this.organizationData];
          if (this.pageModel === "edit") {
            tempUrl = this.$axios.config.saa.updateOrganization;
            PostData = JSON.parse(JSON.stringify(this.organizationData));
          }
          this.submitLoading = true;
          this.$axios
            .post(this.$axios.config.saa.baseURL + tempUrl, PostData)
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
      });
    },
    operateCLK(type) {
      let node = this.$refs.taskTree.getCurrentNode();
      if (type === "edit") {
        if (!this.organizationData.comCode) {
          this.$message.error("请您先选择一个需要修改的机构！");
          return;
        }
        this.organizationData = JSON.parse(JSON.stringify(node));
      }
      if (type === "new" || type === "child") {
        this.organizationData = {
          upperComName: null,
          upperComCode: null,
          comCode: null,
          comName: null,
          manAger: null,
          comLevel: null
        };
        if (type === "child") {
          if (node && node.upperComCode) {
            this.$set(this.organizationData, "upperComName", node.comName);
            this.$set(this.organizationData, "upperComCode", node.comCode);
            this.$set(this.organizationData, "comLevel", node.comLevel + 1);
          }
        }
      }
      this.pageModel = type;
    },
    backToView() {
      this.organizationData = {
        upperComName: null,
        upperComCode: null,
        comCode: null,
        comName: null,
        manAger: null,
        comLevel: null
      };
      this.pageModel = "view";
      this.$nextTick(() => {
        this.$refs.editForm.clearValidate();
      });
    },
    // 删除机构
    deleteOrganization() {
      if (!this.organizationData.comCode) {
        this.$message.error("请您选择一个需要删除的机构！");
        return;
      }
      this.$confirm("您确定要删除此机构吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.submitLoading = true;
          this.$axios
            .delete(this.$axios.config.saa.baseURL + this.$axios.config.saa.deleteOrganization, {
              data: [this.organizationData.comCode]
            })
            .then(res => {
              if (res.data.status === 0) {
                this.$message.success("删除成功!");
                // 重新构筑树
                this.handelTree();
                this.backToView();
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
