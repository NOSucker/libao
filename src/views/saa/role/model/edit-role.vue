<template>
  <div>
    <el-dialog
      ref="roleDialog"
      v-loading="submitLoading"
      custom-class="edit-role"
      top="5vh"
      :title="editDialogTitle"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="80%"
      @open="dialogOpen">
      <el-row :gutter="40">
        <el-col :span="8">
          <div style="padding:  0 10px 10px">
            <el-card style="height: 500px;  overflow-x: auto; overflow-y: auto;position: relative ">
              <div class="my-tree-header">
                <span style="margin-left: 10px;">角色使用权限</span>
              </div>
              <el-tree
                ref="taskTree"
                style="margin-top: 20px"
                :default-expanded-keys="expandedList"
                :default-checked-keys="checkedList"
                node-key="menuId"
                :data="showTreeData"
                :props="props"
                show-checkbox></el-tree>
            </el-card>
          </div>
        </el-col>
        <el-col :span="16">
          <el-form ref="editForm" :model="rolePageData" :rules="validateRules" label-width="110px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="角色代码" prop="roleCode" required>
                  <el-input v-model="rolePageData.roleCode" placeholder="请输入角色代码" :disabled="this.type === 'edit'"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="角色名称" prop="roleName" required>
                  <el-input v-model="rolePageData.roleName" placeholder="请输入角色名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="默认机构数据权限" prop="organFilter">
                  <el-select v-model="rolePageData.organFilter" placeholder="请选中默认机构数据权限">
                    <el-option v-for="para in organFilterList" :key="para.key" :label="para.value" :value="para.key"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="计时器绿色时长" prop="greenSecond">
                  <el-input v-model="rolePageData.greenSecond" placeholder="请输入计时器绿色时长"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="计时器黄色时长" prop="yellowSecond">
                  <el-input v-model="rolePageData.yellowSecond" placeholder="请输入计时器黄色时长"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="rolePageData.remark" type="textarea"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="text-align: right;">
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
    type: String,
    treeData: Array,
    roleData: Object,
    organFilterData: Array,
  },
  data() {
    return {
      organFilterList: [],
      needQueryListData: false,
      checkedList: [],
      expandedList: [],
      showTreeData: [],
      props: {
        label: "menuName",
        children: "children"
      },
      rolePageData: {
        roleCode: '',
        roleName: '',
        organFilter: '',
        greenSecond: '',
        yellowSecond: '',
        remark: ''
      },
      validateRules: {
        roleCode: [{ required: true, message: "请输入角色代码", trigger: "blur" }],
        roleName: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
      },
      submitLoading: false
    };
  },
  computed: {
    showDialog: {
      set(val) {
        this.$emit("input", val);
      },
      get() {
        return this.value;
      }
    },
    editDialogTitle: {
      set() {},
      get() {
        if (this.type === "add") {
          return "新增角色";
        }
        if (this.type === "edit") {
          return "编辑角色";
        }
        if (this.type === "copy") {
          return "复制角色";
        }
        return "";
      }
    }
  },
  watch: {
    treeData(newV) {
      this.showTreeData = JSON.parse(JSON.stringify(newV));
    },
    organFilterData(val) {
      if (val && val.length > 0) {
        this.organFilterList = [];
        // this.organFilterList = JSON.parse(JSON.stringify(val));
        Object.assign(this.organFilterList, JSON.parse(JSON.stringify(val)));
      }
    }
  },
  mounted() {

  },
  methods: {
    submitForm() {
      let checkedTree = this.$refs.taskTree.getCheckedKeys();
      let PostData = this.rolePageData;
      if (this.type !== "add") {
        PostData = this.rolePageData;
        delete PostData.userCounts;
        delete PostData.menuList;
      }
      let data = {
        role: PostData,
        menuIdList: checkedTree
      }
      let param = {
        "requestUrl": this.$axios.config.role.baseURL + this.$axios.config.role.saveOrUpdate,
        "requestType": "POST",
        "requestBody": JSON.stringify(data)
      };
      this.submitLoading = true;
      this.$axios
        .post(this.$axios.config.service.baseURL + this.$axios.config.service.transitInterface, param)
        .then(response => {
          if (JSON.parse(response.data.responseStr).success) {
            this.$message.success(this.type === "edit" ? "角色更新" : "角色添加" + "成功!");
            this.$emit("role-edit-close");
            this.$emit("input", false);
          } else {
            this.$message.error(JSON.parse(response.data.responseStr).msg);
          }
        })
        .finally(() => {
          this.submitLoading = false;
        });
    },
    dialogOpen() {
      this.checkedList = [];
      this.expandedList = [];
      this.showTreeData = [];
      this.rolePageData = {};
      if (this.type === "copy") {
        if (this.roleData) {
          this.rolePageData = JSON.parse(JSON.stringify(this.roleData));
          this.$set(this.rolePageData, "roleId", null);
          /*this.$set(this.rolePageData, "roleCode", null);
          this.$set(this.rolePageData, "roleName", null);*/
        }
      }
      if (this.type === "edit") {
        if (this.roleData) {
          this.rolePageData = JSON.parse(JSON.stringify(this.roleData));
        }
      }
      if (this.type !== "add") {
        // this.checkedList = JSON.parse(JSON.stringify(this.roleData.menuList));
        Object.assign(this.checkedList, JSON.parse(JSON.stringify(this.roleData.menuList)));
      } else {
        //默认为all
        if (!this.rolePageData.organFilter || this.rolePageData.organFilter === '') {
          this.rolePageData.organFilter = this.organFilterList[0].key;
        }
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
    }
  }
};
</script>

<style>
.edit-role .el-dialog__header {
  background: #f8fbff;
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
