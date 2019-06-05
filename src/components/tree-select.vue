<template>
  <div>
    <el-popover
      ref="popover"
      placement="bottom-start"
      :style="{ minWidth: treeWidth }"
      trigger="click"
      :disabled="inputDisabled"
      @show="onShowPopover"
      @hide="onHidePopover">
      <el-scrollbar
        v-loading="loading"
        element-loading-text="加载中"
        element-loading-spinner="el-icon-loading"
        tag="ul"
        wrap-class="el-select-dropdown__wrap"
        view-class="el-select-dropdown__list"
        ref="scrollbar">
        <el-input v-if="showSearchBar" v-model="filterText" clearable :validate-event="false" placeholder="输入关键字进行过滤" />
        <el-tree
          ref="tree"
          v-bind="$attrs"
          :style="{ minWidth: treeWidth }"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          :default-expand-all="false"
          :load="loadNode"
          lazy
          @node-click="onClickNode"/>
      </el-scrollbar>
      <el-input
        slot="reference"
        ref="input"
        v-model="labelModel"
        :validate-event="false"
        :readonly="true"
        :disabled="inputDisabled"
        :class="{ rotate: showStatus }"
        :suffix-icon="suffixIcon"
        :placeholder="placeholder"/>
    </el-popover>
  </div>
</template>

<script>
import { addResizeListener, removeResizeListener } from "element-ui/src/utils/resize-event";
import Emitter from "element-ui/src/mixins/emitter";

export default {
  name: "TreeSelect",
  mixins: [Emitter],
  inject: {
    elForm: {
      default: ""
    }
  },
  props: {
    value: String,
    remoteMethod: Function,
    placeholder: {
      type: String,
      default: "请选择"
    },
    showSearchBar: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      filterText: "",
      showStatus: false,
      treeWidth: "auto",
      labelModel: "",
      valueModel: "",
      suffixIcon: "el-icon-arrow-down"
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
    addResizeListener(this.$el, this.handleResize);
    const _INPUT = this.$refs.input;
    this.$nextTick(() => {
      if (_INPUT && _INPUT.$el) {
        this.treeWidth = _INPUT.$el.getBoundingClientRect().width - 24 + "px";
      }
    });
  },
  beforeDestroy() {
    if (this.$el && this.handleResize) removeResizeListener(this.$el, this.handleResize);
  },
  methods: {
    loadNode(node, resolve) {
      if(node.level == 0){
        this.loading = true;
      }
      this.remoteMethod(node.data)
        .then(response => {
          resolve(response[this.$refs.tree._props.props.children]);
        })
        .catch(() => {
          resolve([]);
        })
        .finally(() => {
          this.loading = false;
          if (node.level == 0) {
            this.changeLabelText(this.value);
          }
        });
    },
    // 单击节点
    onClickNode(node) {
      this.labelModel = node[this.$refs.tree._props.props.label];
      this.valueModel = node[this.$refs.tree._props.props.value];
      this.$emit("input", this.valueModel);
      this.$emit("select-change", node);
      this.dispatch("ElFormItem", "el.form.change", this.valueModel);
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
        this.labelModel = "";
        return;
      }
      let node = null;
      if (this.$refs.tree) {
        node = this.$refs.tree.getNode(val);
      }
      if (node) {
        this.labelModel = node.data[this.$refs.tree._props.props.label];
      } else {
        this.labelModel = val;
        let nodeData = {};
        nodeData[this.$refs.tree._props.props.value] = val;
        this.suffixIcon = "el-icon-loading";
        this.remoteMethod(nodeData)
          .then(data => {
            if (data && data[this.$refs.tree._props.props.label]) {
              this.labelModel = data[this.$refs.tree._props.props.label];
            }
          })
          .finally(() => {
            this.suffixIcon = "el-icon-arrow-down";
          });
      }
      this.$refs.tree.setCurrentKey(val);
    },
    handleResize() {
      this.treeWidth = this.$refs.input.$el.getBoundingClientRect().width - 24 + "px";
    }
  }
};
</script>

<style>
.el-input.el-input--suffix.rotate .el-input__suffix {
  transform: rotate(180deg);
}
</style>
