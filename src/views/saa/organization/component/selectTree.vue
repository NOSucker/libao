<template>
  <el-select
    class="ld-select"
    :clearable="option"
    :value="chooseNodes"
    filterable
    :filter-method="remoteMethod"
    placeholder="请输入"
    popper-class="ld-select_tree-drop"
    :disabled="disabled"
    @clear="clearHandle"
    @focus="changeDefaultCheck">
    <el-option :value="valueTitle">
      <el-tree
        ref="selectTree"
        v-if=conStatus
        :show-checkbox="true"
        accordion
        :check-strictly="true"
        :data="options"
        :props="defaultProps"
        :node-key="defaultProps.label"
        :default-checked-keys="defaultCheckNodes"
        :filter-node-method="filterNode"
        @check="checkNode"
      ></el-tree>
    </el-option>
    <div class="ld-select_tree" disabled>
      <el-button type="primary" size="mini" @click="allotMenuConfirm">确 定</el-button>
    </div>
  </el-select>
</template>

<script>
  export default {
    name: "ElTreeSelect",
    props: {
      organName: {
        type: Array,
        default: () => {
          return [];
        }
      },
      options: {
        type: Array, // 必须是树形结构的对象数组
        default: () => {
          return [];
        }
      },
      disabled: {
        type: Boolean,
        default: true
      },
      model: {
        type: Array,
        default: () => {
          return [];
        }
      },
      defaultProps: {
        type: Object,
        default: () => {
          return {
            label: "organName",
            children: "children"
          };
        }
      },
      whichType: {
        type: String,
        default: () => {
          return "organ";
        }
      },
      value: {
        type: Number,
        default: () => {
          return null;
        }
      },
      defaultCheckNodes: {
        type: Array, // 已经分配的资源
        default: () => {
          return [];
        }
      }
    },
    data() {
      return {
        valueId: this.value, // 初始值
        valueTitle: "",
        chooseNodes: [],
        option:true,
        conStatus:true
      };
    },
    watch: {
      organName(newV) {
        this.chooseNodes = JSON.parse(JSON.stringify(newV));
      }
    },
    mounted() {
      this.chooseNodes = this.organName;
    },
    created() {
      this.initHandle();
    },
    methods: {
      /*  //此方法是子组件向父组件传值时调用
        toFather(chooseNodes){
          this.$emit("fromChild",chooseNodes);
        },*/
      changeDefaultCheck() {
        // 改变默认选中的时候 子级未全选父级全选状态的问题(改为半选)
        const defaultNodes = this.$refs.selectTree.getCheckedNodes();
        defaultNodes.map(item => {
          if (item.childList && item.childList.length > 0) {
            const currentNodes = this.$refs.selectTree.getNode(item);
            this.changeParentStatus(currentNodes);
          }
        });
      },
      // 初始化值
      initHandle() {
        this.chooseNodes = [];
      },
      checkNode(node, treeStatus) {
        if (this.whichType == "organ") {
          const selected = treeStatus.checkedKeys.indexOf(node.id); // -1未选中
          // 选中
          if (selected === -1) {
            this.changeParentAndChild(node); // 取消节点时的方法
          } else {
            // 勾子改变父
            this.selectedParent(node);
            // 勾父全选子
            this.uniteChildSame(node, true);
          }
        }
        if (this.whichType == "user") {
          // let checkedKey = treeStatus.checkedKeys;
          //  let curryKey = node.organId;
          this.$refs.selectTree.setCheckedNodes([node]);
        }
      },
      // 勾父全选子 取消父取消子
      uniteChildSame(treeList, isSelected) {
        this.$refs.selectTree.setChecked(treeList.id, isSelected);
        if (treeList.childList !== null) {
          for (let i = 0; i < treeList.childList.length; i++) {
            this.uniteChildSame(treeList.childList[i], isSelected);
          }
        }
      },
      // 统一处理父节点为选中
      selectedParent(currentObj) {
        const currentNode = this.$refs.selectTree.getNode(currentObj);
        if (currentNode.parent.key) {
          const childCheckedStatus = currentNode.parent.childNodes.every(item => {
            return item.checked === true;
          });
          if (childCheckedStatus) {
            this.$refs.selectTree.setChecked(currentNode.parent, true);
          } else {
            currentNode.parent.indeterminate = true;
          }
          this.selectedParent(currentNode.parent);
        }
      },
      changeParentAndChild(currentObj) {
        const currentNode = this.$refs.selectTree.getNode(currentObj);
        if (currentNode.childNodes.length > 0) {
          // 被取消的如果有子  则走uniteChildSame方法去取消所有的子的选中状态
          this.uniteChildSame(currentObj, false);
        }
        if (currentNode.parent.key) {
          this.changeParentStatus(currentNode.parent);
        }
      },
      changeParentStatus(parentNodes) {
        //	取消子以后改变父  然后继续看父的父应该的状态
        const childNodes = parentNodes.childNodes;

        const childCheckedStatus = childNodes.every(item => {
          // 子全部未选中
          return item.checked === false && item.indeterminate === false;
        });

        const childCheckedAllChecked = childNodes.every(item => {
          // 子全部完全选中
          return item.checked === true;
        });

        if (childCheckedStatus) {
          parentNodes.checked = false;
          parentNodes.indeterminate = false;
        }

        if (childCheckedAllChecked) {
          parentNodes.checked = true;
          parentNodes.indeterminate = false;
        }

        if (!childCheckedStatus && !childCheckedAllChecked) {
          parentNodes.checked = false;
          parentNodes.indeterminate = true;
        }

        if (parentNodes.parent.key) {
          const parentNode = parentNodes.parent;
          this.changeParentStatus(parentNode);
        }
      },
      // 清除选中
      clearHandle() {
        this.chooseNodes = null;
        this.remoteMethod(this.chooseNodes);
      },
      remoteMethod(val) {
        this.chooseNodes = val;
        this.$refs.selectTree.filter(val);
      },
      filterNode(value, data) {
        // 2019/04/10 删除自定义的过滤
        if (!value) return true;
        return data.resourceName.indexOf(value) !== -1;
      },
      allotMenuConfirm() {
        // 确认分配
        if (this.whichType == "organ") {
          this.chooseNodes = this.$refs.selectTree.getCheckedKeys().concat(this.$refs.selectTree.getHalfCheckedKeys());
          this.$emit("fromChild", this.chooseNodes);
          this.$emit("fromChildMannger", this.chooseNodes);
        //  this.conStatus = false;
        } else {
          this.chooseNodes = this.$refs.selectTree.getCheckedKeys().concat(this.$refs.selectTree.getHalfCheckedKeys());
          this.$emit("fromChild", this.chooseNodes);
         // this.conStatus = false;
        }
      }
    }
  };
</script>

<style scoped>
  .el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
    height: auto;
    padding: 0;
  }

  .el-select-dropdown__item.selected {
    font-weight: normal;
  }

  ul li >>> .el-tree .el-tree-node__content {
    height: auto;
  }

  .el-tree-node__label {
    font-weight: normal;
  }

  .el-tree >>> .is-current .el-tree-node__label {
    color: #409eff;
    font-weight: 700;
  }

  .el-tree >>> .is-current .el-tree-node__children .el-tree-node__label {
    color: #606266;
    font-weight: normal;
  }

  .ld-select_tree {
    text-align: right;
    padding-right: 20px;
    position: absolute;
    bottom: 10px;
    right: -4px;
  }
</style>

<style lang="scss">
  .ld-select {
    .el-input__icon {
      line-height: 32px !important;
    }
  }
</style>
