<template>
  <div v-loading="submitLoading">
    <h2 style="background: #f8fbff;font-size: 14px;padding: 10px;margin-bottom: 0;">角色管理</h2>
    <div style="background: #fff; padding-top: 10px">
      <el-row :gutter="40">
        <el-col :span="8">
          <el-card
            v-loading="treeLoading"
            style="height: 500px;  overflow-x: auto; overflow-y: auto; "
            element-loading-text="您无法在修改状态下切换机构"
            element-loading-spinner="el-icon-info"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          >
            <el-tree ref="taskTree" node-key="comCode" :load="loadNode" :props="props" lazy :data="treeData" @node-click="onClickNode"></el-tree>
          </el-card>
        </el-col>
        <el-col :span="16">
          <el-form ref="editForm" :model="organizationData" label-width="80px">
            <el-row>
              <el-col :span="10">
                <el-form-item prop="upperComName" label="上级机构" :rules="[{ required: false, message: '请点击选择上级机构', trigger: 'change' }]">
                  <el-input v-model="organizationData.upperComName" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item prop="comCode" label="机构代码" :rules="[{ required: pageModel !== 'view', message: '请输入机构代码', trigger: 'blur' }]">
                  <el-input v-model="organizationData.comCode" :disabled="pageModel === 'view'"></el-input>
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
            <el-row v-if="pageModel === 'add' || pageModel === 'edit'" style="text-align: center;padding-top: 15px; border-top: 1px solid #eee;">
              <el-button type="primary" @click="submitForm">提交</el-button>
              <el-button @click="$refs.editForm.resetFields()">重置</el-button>
              <el-button @click="backToView">返回</el-button>
            </el-row>
            <el-row v-if="pageModel === 'view'" style="text-align: center;padding-top: 15px; border-top: 1px solid #eee;">
              <el-button @click="operateCLK('add')">新增子机构</el-button>
              <el-button @click="operateCLK('addPeople')">新增员工</el-button>
              <el-button @click="operateCLK('edit')">修改</el-button>
              <el-button type="danger" @click="deleteOrganization">删除</el-button>
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
      pageModel: "view",
      treeLoading: false,
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
        children: "subList"
      },
      submitLoading: false
    };
  },
  watch: {
    pageModel(newV) {
      if (newV === "edit") {
        this.treeLoading = true;
      } else {
        this.treeLoading = false;
      }
    }
  },
  methods: {
    onClickNode(node) {
      this.organizationData = JSON.parse(JSON.stringify(node));
      if (this.pageModel === "add") {
        this.$set(this.organizationData, "upperComName", node.comName);
        this.$set(this.organizationData, "upperComCode", node.comCode);
        this.$set(this.organizationData, "comLevel", node.comLevel + 1);
      }
    },

    getTreeDataWithUser(node, resolve) {
      const theUserCode = JSON.parse(localStorage.getItem("userInfo")).userCode;
      this.$axios
        .get(this.$axios.config.saa.baseURL + this.$axios.config.saa.availableOrganization, {
          params: {
            userCode: theUserCode
          }
        })
        .then(response => {
          if (response.data.status === 0) {
            if (node.data && node.data.comCode) {
              if (response.data.data[0] && response.data.data[0].subList && response.data.data[0].subList.length > 0) {
                this.treeData = response.data.data[0].subList;
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
        });
    },

    loadNode(node, resolve) {
      if (node.data.length === 0) {
        // 第一次加载获取当前登陆用户可以看见的机构
        this.getTreeDataWithUser(node, resolve);
      } else {
        // 获取下级机构
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
                if (!this.organizationData.upperComCode) {
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
                  this.pageModel = "view";
                  return;
                }
                let currentCom = this.organizationData.upperComCode;
                // 更新tree节点数据
                this.$axios
                  .get(this.$axios.config.saa.baseURL + this.$axios.config.saa.getSubCompany.format({ comCode: currentCom }))
                  .then(response => {
                    if (response.data.status === 0) {
                      if (response.data.data[0] && response.data.data[0].subList && response.data.data[0].subList.length > 0) {
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
      if (type !== "addPeople") {
        if (type === "edit" && !this.organizationData.comCode) {
          this.$message.error("请您选择一个需要修改的机构！");
          return;
        }
        if (type === "add") {
          this.organizationData = {
            upperComName: null,
            upperComCode: null,
            comCode: null,
            comName: null,
            manAger: null,
            comLevel: null
          };
          let node = this.$refs.taskTree.getCurrentNode();
          if (node) {
            this.$set(this.organizationData, "upperComName", node.comName);
            this.$set(this.organizationData, "upperComCode", node.comCode);
            this.$set(this.organizationData, "comLevel", node.comLevel + 1);
          }
        }
        this.pageModel = type;
      } else {
        // 跳转到添加用户的页面
      }
    },
    backToView() {
      this.pageModel = "view";
      this.$nextTick(() => {
        this.$refs.editForm.validateField("upperComName");
        this.$refs.editForm.validateField("comCode");
        this.$refs.editForm.validateField("comName");
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
                // 重新构筑树 清除当前选择的树节点
                this.$refs.taskTree.remove(this.organizationData.comCode);
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
    }
  }
};
</script>

<style scoped></style>
