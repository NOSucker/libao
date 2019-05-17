<template>
  <el-select ref="select" v-model="selectValue" v-bind="$attrs">
    <el-option v-if="showSearchBar" :disabled="true" value>
      <el-input v-model="search" :validate-event="false" clearable placeholder="搜索" size="mini" prefix-icon="el-icon-search" @input="searchInput" />
    </el-option>
    <el-option v-for="item in list" :key="item[valueField]" :label="item[labelField]" :value="item[valueField]" />
    <el-option v-if="list.length == 0" :disabled="true" value>
      <div style="text-align: center">
        没有数据
      </div>
    </el-option>
    <el-option v-if="total > 0" :disabled="true" value>
      <el-pagination
        small
        layout="total, prev, pager, next"
        :current-page="pageNo"
        :page-size="pageSize"
        :total="total"
        style="width: 100%"
        @current-change="pageChange"/>
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: "PagerSelect",
  props: {
    value: String,
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
    },
    debounce: {
      type: Number,
      default: 600
    }
  },
  data: function() {
    return {
      list: [],
      title: "",
      search: "",
      total: 0,
      pageNo: 1,
      debounceCount: 0
    };
  },
  computed: {
    selectValue: {
      get: function() {
        return this.value;
      },
      set: function(val) {
        this.$emit("input", val);
      }
    }
  },
  watch: {
    value: function() {
      this.setLabelText();
    }
  },
  mounted() {
    this.queryData().then(() => {
      this.setLabelText();
    });
  },
  methods: {
    setLabelText() {
      if (
        this.value &&
        this.list.every(item => {
          if (item[this.valueField] === this.value) {
            return false;
          }
          return true;
        })
      ) {
        this.queryData(this.value);
      }
    },
    queryData(value) {
      this.$refs.select.$refs.scrollbar.$el.childNodes[0].style.maxHeight = "440px";
      var loading = this.$loading({
        text: "查询中",
        spinner: "el-icon-loading",
        target: this.$refs.select.$refs.scrollbar.$el
      });
      return this.remoteMethod({ pageNo: this.pageNo, pageSize: this.pageSize, search: this.search, value: value ? value : "" })
        .then(response => {
          if (!value) {
            this.list = response.data.list;
            this.total = response.data.total;
          } else {
            response.data.list.forEach(item => {
              this.list.push(item);
            });
            this.$nextTick(() => {
              response.data.list.forEach(item => {
                this.list.splice(this.list.indexOf(item), 1);
              });
            });
          }
        })
        .finally(() => {
          loading.close();
        });
    },
    refreshData() {
      this.list.splice(0, this.list.length);
      this.search = "";
      this.queryData();
    },
    searchInput() {
      this.debounceCount++;
      setTimeout(() => {
        this.debounceCount--;
        if (this.debounceCount === 0) {
          this.queryData();
        }
      }, this.debounce);
    },
    pageChange(no) {
      this.pageNo = no;
      this.queryData();
    }
  }
};
</script>

<style scoped></style>
