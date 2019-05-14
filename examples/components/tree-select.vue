<template>
  <div style="margin-top: 100px;">
    <el-form inline>
      <el-form-item label="">
        <tree-select
          v-model="selected"
          :highlight-current="true"
          :remote-method="treeQuery"
          :init-lable-method="initLabel"
          :props="defaultProps"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import TreeSelect from "../../src/components/tree-select.vue";

  export default {
    components: {
      TreeSelect
    },
    data() {
      return {
        selected: "A",
        // 数据默认字段
        defaultProps: {
          parent: "parentId", // 父级唯一标识
          value: "value", // 唯一标识
          label: "label", // 标签显示
          children: "children" // 子级
        }
      };
    },
    methods: {
      treeQuery(node) {
        let url = "";
        node
          ? (url =
          this.$axios.config.sdd.baseURL +
          this.$axios.config.treeQuery +
          `/${node}`)
          : (url = this.$axios.config.sdd.baseURL + this.$axios.config.treeQuery);
        return this.$axios.get(url);
      },
      initLabel() {
        let node = "2";
        this.selected = node;
        return this.$axios.get(
          this.$axios.config.sdd.baseURL +
          this.$axios.config.treeQuery +
          `/${node}`
        );
      }
    }
  };
</script>
