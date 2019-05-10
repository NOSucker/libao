<template>
  <el-popover
    ref="popover"
    placement="bottom-start"
    trigger="click"
    @show="onShowPopover"
    @hide="onHidePopover"
  >
    <el-input v-model="filterText" placeholder="输入关键字进行过滤"> </el-input>
    <el-tree
      ref="tree"
      v-bind="$attrs"
      class="select-tree"
      :style="`min-width: ${treeWidth}`"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      :default-expand-all="false"
      lazy
      @node-click="onClickNode"
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
  // 绑定参数
  model: {
    prop: "value",
    event: "selected"
  },
  props: {
    value: String,
    width: String,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  inject: {
    elForm: {
      default: ""
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
  computed: {
    inputDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    }
  },
  watch: {
    value(val) {
      this.changeLabelText(val);
    },
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    inputDisabled: function(val) {
      this.$refs.popover.disabled = val;
    }
  },
  mounted() {
    // 检测输入框原有值并显示对应 label
    this.$refs.popover.disabled = this.inputDisabled;
    this.changeLabelText(this.value);
  },
  methods: {
    // 单击节点
    onClickNode(node) {
      this.labelModel = node[this.$refs.tree._props.props.label];
      this.valueModel = node[this.$refs.tree._props.props.value];
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
      this.$emit("input", this.valueModel);
    },
    // 树节点过滤方法
    filterNode(query, data) {
      if (!query) return true;
      return data[this.$refs.tree._props.props.label].indexOf(query) !== -1;
    },
    changeLabelText(val) {
      if (!val) {
        this.labelModel = "请选择";
        return;
      }
      let node = null;
      if (this.$refs.tree) {
        node = this.$refs.tree.getNode(val);
      }
      if (node) {
        this.labelModel = node.data[this.$refs.tree._props.props.label];
      } else {
        // 这里要调用一个接口 给Value获取Name的
      }
      this.$refs.tree.setCurrentKey(val);
    }
  }
};
</script>

<style>
.el-input.el-input--suffix.rotate .el-input__suffix {
  transform: rotate(180deg);
}
</style>
