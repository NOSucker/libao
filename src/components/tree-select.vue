<template>
  <el-popover
    ref="popover"
    placement="bottom-start"
    trigger="click"
    @show="onShowPopover"
    @hide="onHidePopover"
  >
    <el-input placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>
    <el-tree
      ref="tree"
      class="select-tree"
      :style="`min-width: ${treeWidth}`"
      :props="props"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      :default-expand-all="false"
      @node-click="onClickNode"
      :load="loadNode"
      lazy
    >
    </el-tree>
    <el-input
      slot="reference"
      ref="input"
      v-model="labelModel"
      :style="`width: ${width}px`"
      :class="{ rotate: showStatus }"
      suffix-icon="el-icon-arrow-down"
      placeholder="请选择"
    >
    </el-input>
  </el-popover>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    value: String,
    width: String,
    remoteMethod: Function,
    disabled: {
      type: Boolean,
      default: false
    },
    // 树节点配置选项
    props: {
      type: Object,
      required: false,
      default: () => ({
        parent: "parentId",
        value: "value",
        label: "label",
        children: "children"
      })
    }
  },
  // 绑定参数
  model: {
    prop: "value",
    event: "selected"
  },
  inject: {
    elForm: {
      default: ""
    }
  },
  computed: {
    inputDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    }
  },
  watch: {
    labelModel(val) {
      if (!val) {
        this.valueModel = "";
      }
      this.$refs.tree.filter(val);
    },
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    inputDisabled: function(val) {
      this.$refs.popover.disabled = val;
    }
  },
  data() {
    return {
      filterText: "",
      options: [],
      showStatus: false,
      treeWidth: "auto",
      labelModel: "",
      valueModel: "0",
      search: ""
    };
  },
  methods: {
    loadNode(node, resolve) {
      if (node.level == 0) {
        this.remoteMethod()
          .then(response => {
            let treeData = [];
            response.data.options.forEach(e => {
              treeData.push(e);
            });
            resolve(treeData);
          })
          .catch(() => {
            resolve([]);
          });
      } else {
        this.remoteMethod(node.data.parentId)
          .then(response => {
            let childNode = [];
            response.data.options.forEach(e => {
              childNode.push(e);
            });
            resolve(childNode);
          })
          .catch(() => {
            resolve([]);
          });
      }
    },
    // 单击节点
    onClickNode(node) {
      this.labelModel = node[this.props.label];
      this.valueModel = node[this.props.value];
      this.onCloseTree();
    },
    // 隐藏树状菜单
    onCloseTree() {
      this.$refs.popover.showPopper = false;
    },
    onShowPopover() {
      this.showStatus = true;
      this.$refs.tree.filter(false);
    },
    onHidePopover() {
      this.showStatus = false;
      this.$emit("selected", this.valueModel);
    },
    // 树节点过滤方法
    filterNode(query, data) {
      if (!query) return true;
      return data[this.props.label].indexOf(query) !== -1;
    }
  },
  mounted() {
    // 检测输入框原有值并显示对应 label
    this.$refs.popover.disabled = this.inputDisabled;
  }
};
</script>

<style>
.el-input.el-input--suffix.rotate .el-input__suffix {
  transform: rotate(180deg);
}
</style>
