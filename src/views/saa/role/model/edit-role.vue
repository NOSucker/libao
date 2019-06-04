<template>
  <div>
    <el-dialog
      ref="roleDialog"
      v-loading="submitLoading"
      top="5vh"
      :title="editDialogTitle"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="80%"
      @close="closeThedialog"
      @open="dialogOpen"
    >
      <el-row :gutter="40">
        <el-col :span="8">
          <el-card style="height: 500px;  overflow-x: auto; overflow-y: auto; ">
            <el-tree
              ref="taskTree"
              :default-expanded-keys="expandedList"
              :default-checked-keys="checkedList"
              node-key="taskCode"
              :data="showTreeData"
              :props="props"
              show-checkbox
            ></el-tree>
          </el-card>
        </el-col>
        <el-col :span="16">
          <el-form ref="editForm" :model="rolePageData" :rules="validateRules" label-width="80px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="角色代码" prop="roleCode">
                  <el-input v-model="rolePageData.roleCode" :disabled="this.model === 'edit'"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="角色名称" prop="roleName">
                  <el-input v-model="rolePageData.roleName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="rolePageData.remark" type="textarea"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="text-align: right">
              <el-button type="primary" @click="submitForm">提交</el-button>
              <el-button @click="$refs.editForm.resetFields()">重置</el-button>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "EditRole",
  props: {
    value: Boolean,
    model: String,
    treeData: Array,
    roleData: Object
  },
  data() {
    return {
      needQueryListData: false,
      checkedList: [],
      expandedList: [],
      showTreeData: [],
      props: {
        label: "taskName",
        children: "subLists"
      },
      rolePageData: {},
      validateRules: {},
      submitLoading: false
    };
  },
  computed: {
    showDialog: {
      set() {},
      get() {
        return this.value;
      }
    },
    editDialogTitle: {
      set() {},
      get() {
        if (this.model === "add") {
          return "新增角色";
        }
        if (this.model === "edit") {
          return "编辑角色";
        }
        if (this.model === "copy") {
          return "复制角色";
        }
        return "";
      }
    }
  },
  watch: {
    treeData(newV) {
      this.showTreeData = JSON.parse(JSON.stringify(newV));
    }
  },
  mounted() {},
  methods: {
    submitForm() {
      let checkedTree = this.$refs.taskTree.getCheckedKeys();
      let theUrl = this.$axios.config.saa.createRole;
      let PostData = [this.rolePageData];
      this.rolePageData.taskCodeList = checkedTree;
      if (this.model === "edit") {
        theUrl = this.$axios.config.saa.updateRole;
        PostData = this.rolePageData;
      }
      this.submitLoading = true;
      this.$axios
        .post(this.$axios.config.saa.baseURL + theUrl, PostData)
        .then(response => {
          if (response.data.status === 0) {
            this.$message.success(this.model === "edit" ? "角色更新" : "角色添加" + "成功!");
            this.needQueryListData = true;
            this.$refs.roleDialog.handleClose();
          } else {
            this.$message.error(response.data.statusText);
          }
        })
        .finally(() => {
          this.submitLoading = false;
        });
    },
    dialogOpen() {
      this.checkedList = [];
      this.expandedList = [];
      this.rolePageData = {};
      if (this.model === "copy") {
        if (this.roleData) {
          this.rolePageData = JSON.parse(JSON.stringify(this.roleData));
          this.$set(this.rolePageData, "roleCode", null);
          this.$set(this.rolePageData, "roleName", null);
        }
      }
      if (this.model === "edit") {
        if (this.roleData) {
          this.rolePageData = JSON.parse(JSON.stringify(this.roleData));
        }
      }
      if (this.model !== "add") {
        this.checkedList = this.rolePageData.taskCodeList;
      }
      this.showTreeData = JSON.parse(JSON.stringify(this.treeData));
      this.setExpandedList();
    },
    setExpandedList() {
      let tempArr = [];
      function pushDataInExpandArr(child, val, checkAll) {
        if (checkAll) {
          tempArr.push(child.taskCode);
          if (child.subLists) {
            child.subLists.forEach(c => {
              pushDataInExpandArr(c, val, true);
            });
          }
        } else {
          if (child.taskCode === val) {
            tempArr.push(child.taskCode);
            if (child.subLists) {
              child.subLists.forEach(c => {
                pushDataInExpandArr(c, val, true);
              });
            }
          } else {
            if (child.subLists) {
              child.subLists.forEach(c => {
                pushDataInExpandArr(c, val, false);
              });
            }
          }
        }
      }
      if (this.treeData && this.treeData.length !== 0 && (this.checkedList && this.checkedList.length !== 0)) {
        this.checkedList.forEach(checked => {
          this.treeData.forEach(tree => {
            pushDataInExpandArr(tree, checked, false);
          });
        });
        this.expandedList = tempArr;
      }
    },
    closeThedialog() {
      this.showTreeData = [];
      this.$emit("input", false);
      if (this.needQueryListData) {
        this.$emit("role-edit-close");
      }
    }
  }
};
</script>

<style scoped></style>
