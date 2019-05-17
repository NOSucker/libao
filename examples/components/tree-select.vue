<template>
  <div style="margin-top: 100px;">
    <el-form inline>
      <el-form-item :label="'value:'+ selectModel">
        <tree-select
          v-model="selectModel"
          node-key="comCode"
          :remote-method="treeQuery"
          :props="{
          isLeaf: 'isLeaf',
          children: 'subCompanyList',
          value: 'comCode',
          label: 'comCName'
        }"
        />
      </el-form-item>
    </el-form>
    <el-button @click="selectModel='110200'">设置值为110200</el-button>
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
          this.$axios.get(this.$axios.config.saa.baseURL + this.$axios.config.saa.companyQuery.format({comCode: node ? node.comCode : ""})).then(response => {
            if(response.data.data.subCompanyList){
              response.data.data.subCompanyList.forEach(function (item) {
                if(item.subCompanyList && item.subCompanyList.length == 0){
                  item.isLeaf = true;
                }
              })
            }
            resolve(response.data.data)
          })
        })
      }
    }
  };
</script>
