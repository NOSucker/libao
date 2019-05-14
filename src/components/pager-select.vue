<template>
  <el-select
    ref="select"
    v-model="selectValue"
    v-bind="$attrs"
    :disabled="inputDisabled"
    :title="title"
    @change="selectChange"
  >
    <el-option v-if="showSearchBar" :disabled="true" value>
      <el-input
        v-model="search"
        placeholder="搜索"
        size="mini"
        prefix-icon="el-icon-search"
        @input="searchInput"
      />
    </el-option>
    <el-option
      v-for="item in list"
      :key="item[valueField]"
      :label="item[labelField]"
      :value="item[valueField]"
    >
    </el-option>
    <el-option v-if="list.length == 0" :disabled="true" value>
      <div style="text-align: center">没有数据</div>
    </el-option>
    <el-option v-if="total > 0" :disabled="true" value>
      <el-pagination
        small
        layout="total, prev, pager, next"
        :current-page="pageNo"
        :page-size="pageSize"
        :total="total"
        style="width: 100%"
        @current-change="pageChange"
      />
    </el-option>
  </el-select>
</template>

<script>
import emitter from "element-ui/lib/mixins/emitter";

export default {
  name: "PagerSelect",
  mixins: [emitter],
  props: {
    value: String,
    disabled: Boolean,
    remoteMethod: Function,
    valueField: {
      type: String,
      default: "code"
    },
    labelField: {
      type: String,
      default: "value"
    },
    pageSize: {
      type: Number,
      default: 10
    },
    showSearchBar: {
      type: Boolean,
      default: false
    }
  },
  inject: {
    elForm: {
      default: ""
    }
  },
  data: function() {
    return {
      list: [],
      title: "",
      search: "",
      total: 0,
      pageNo: 1,
      loading: 0
    };
  },
  computed: {
    selectValue: {
      get: function() {
        return this.value;
      },
      set: function() {}
    },
    inputDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    }
  },
  watch: {
    value: function(val) {
      if (
        val &&
        this.list.every(item => {
          if (item[this.valueField] === val) {
            return false;
          }
          return true;
        })
      ) {
        this.queryData(val);
      }
    }
  },
  mounted() {
    this.queryData(this.value);
  },
  methods: {
    selectChange(ev) {
      this.$emit("input", ev);
      this.dispatch("ElFormItem", "el.form.change", ev);
      this.list.every(item => {
        if (item.code === ev) {
          this.$emit("select-change", item);
          this.title = item.value;
          return false;
        }
        return true;
      });
    },
    queryData(filter) {
      this.$refs.select.$refs.scrollbar.$el.childNodes[0].style.maxHeight =
        "440px";
      if (typeof this.remoteMethod === "function") {
        const loading = this.$loading({
          text: "查询中",
          spinner: "el-icon-loading",
          target: this.$refs.select.$refs.scrollbar.$el
        });
        this.remoteMethod(this.pageNo, this.pageSize, filter)
          .then(response => {
            this.list = response.data.list;
            this.total = response.data.total;
          })
          .finally(() => {
            loading.close();
          });
      }
    },
    refreshData() {
      this.list.splice(0, this.list.length);
      this.search = "";
      this.queryData();
    },
    searchInput() {
      this.loading++;
      setTimeout(() => {
        this.loading--;
        if (this.loading === 0) {
          this.queryData(this.search);
        }
      }, 1000);
    },
    pageChange(no) {
      this.pageNo = no;
      this.queryData();
    }
  }
};
</script>

<style scoped></style>
