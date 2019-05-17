<template>
  <div style="margin-top: 100px;">
    <el-form inline>
      <el-form-item :label="'value:'+ selectModel">
        <pager-select
          :show-search-bar="true"
          v-model="selectModel"
          :remote-method="pagerQuery"
          :page-size="10">
        </pager-select>
      </el-form-item>
    </el-form>
    <el-button @click="selectModel='25'">设置值为25</el-button>
  </div>
</template>

<script>
  import PagerSelect from "../../src/components/pager-select";

  export default {
    components: {
      PagerSelect
    },
    data() {
      return {
        selectModel: ""
      };
    },
    methods: {
      pagerQuery(query) {
        let params = new URLSearchParams();
        params.append("pageNo", query.pageNo);
        params.append("pageSize", query.pageSize);
        params.append("search", query.search);
        params.append("value", query.value);
        return this.$axios.get(
          this.$axios.config.sdd.baseURL +
          this.$axios.config.sdd.baseCode.format({codeType: "codeType"}) + "?" + params.toString()
        );
      }
    }
  };
</script>
