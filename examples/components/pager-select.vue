<template>
  <div style="margin-top: 100px;">
    <pager-select
      v-model="selectModel"
      :remote-method="pagerQuery"
      :page-size="6"
    ></pager-select>
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
        selectModel: "1"
      };
    },
    methods: {
      pagerQuery(pageNo, pageSize, filter) {
        let params = new URLSearchParams();
        params.append("pageNo", pageNo);
        params.append("pageSize", pageSize);
        params.append("filter", filter);
        return this.$axios.get(
          this.$axios.config.sdd.baseURL +
          this.$axios.config.sdd.baseCode.format({
            codeType: "123"
          }) +
          "?" +
          params.toString()
        );
      }
    }
  };
</script>
