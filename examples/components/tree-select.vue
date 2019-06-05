<template>
  <div style="margin-top: 100px;">
    <el-form inline>
      <el-form-item :label="'value:'+ selectModel">
        <tree-select
          v-model="selectModel"
          node-key="comCode"
          :remote-method="treeQuery"
          :props="{
          children: 'subList',
          value: 'comCode',
          label: 'comCName'
        }"
        />
      </el-form-item>
    </el-form>
    <el-button @click="selectModel='15100001308888888'">设置值为15100001308888888</el-button>
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
        selectModel: "",
      };
    },
    methods: {
      treeQuery(node) {
        return new Promise(resolve => {
          this.$axios.get(this.$axios.config.saa.baseURL + this.$axios.config.saa.getSubCompany.format({comCode: node ? node.comCode : ""})).then(response => {
            resolve(response.data.data[0])
          })
        })
      }
    }
  };
</script>
