<template>
  <div>
    <el-popover
      ref="popover"
      placement="bottom-start"
      :style="{ minWidth: treeWidth }"
      trigger="click"
      :disabled="inputDisabled"
      @show="onShowPopover"
      @hide="onHidePopover"
    >
      <el-input v-model="filterText" placeholder="输入关键字进行过滤">
      </el-input>
      <el-tree
        ref="tree"
        v-bind="$attrs"
        class="select-tree"
        node-key="value"
        :style="{ minWidth: treeWidth }"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        :default-expand-all="false"
        :load="loadNode"
        lazy
        @node-click="onClickNode"
      >
      </el-tree>
      <el-input
        slot="reference"
        ref="input"
        v-model="labelModel"
        :readonly="true"
        style="width: 100%"
        :disabled="inputDisabled"
        :class="{ rotate: showStatus }"
        suffix-icon="el-icon-arrow-down"
        placeholder="请选择"
      >
      </el-input>
    </el-popover>
  </div>
</template>

<script>
import {
  addResizeListener,
  removeResizeListener
} from "element-ui/src/utils/resize-event";
import Emitter from "element-ui/src/mixins/emitter";
export default {
  name: "Pagination",
  mixins: [Emitter],
  inject: {
    elForm: {
      default: ""
    }
  },
  props: {
    value: String,
    width: String,
    remoteMethod: Function,
    initLableMethod: Function,
    disabled: {
      type: Boolean,
      default: false
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
    addResizeListener(this.$el, this.handleResize);
    const _INPUT = this.$refs.input;
    this.$nextTick(() => {
      if (_INPUT && _INPUT.$el) {
        this.treeWidth = _INPUT.$el.getBoundingClientRect().width - 24 + "px";
      }
    });
  },
  beforeDestroy() {
    if (this.$el && this.handleResize)
      removeResizeListener(this.$el, this.handleResize);
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
        this.remoteMethod(node.id)
          .then(response => {
            let myList = [];
            response.data.options.forEach(e => {
              myList.push(e);
            });
            resolve(myList);
          })
          .catch(() => {
            resolve([]);
          });
      }
    },
    // 单击节点
    onClickNode(node) {
      this.labelModel = node[this.$refs.tree._props.props.label];
      this.valueModel = node[this.$refs.tree._props.props.value];
      this.$emit("input", this.valueModel);
      this.$emit("treeChange", node);
      this.dispatch("ElFormItem", "el.form.change", node.comCode);
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
        this.initLableMethod().then(response => {
          this.labelModel = response.data.options[0].label;
        });
      }
      this.$refs.tree.setCurrentKey(val);
    },
    handleResize() {
      this.treeWidth =
        this.$refs.input.$el.getBoundingClientRect().width - 24 + "px";
    }
  }
};
</script>

<style>
.el-input.el-input--suffix.rotate .el-input__suffix {
  transform: rotate(180deg);
  outline: none;
}
</style>
