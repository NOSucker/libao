## page-select 分页选择器

当选项过多时，使用树形下拉菜单展示并选择内容。

### 基础用法

适用的分页单选
 `v-model`的值为当前被选中的 value 属性值
```html
<!-- pagerQuery仅为示例处理函数，开发中可自定义处理函数 -->
<template>
    <pager-select
      v-model="selectModel"
      :remote-method="pagerQuery"
    ></pager-select>
</template>

<script>
  // 定义组名为TreeSelect，若引入组件时命名不为TreeSelect，可根据自己的命名进行调整
import PagerSelect from "~/components/pager-select";

export default {
  data() {
    return {
      selectModel: "1",
    };
  },
  components: {
    PagerSelect
  },
  methods: {
    // url根据业务接口进行请求，以下为示例代码
    pagerQuery(pageNo, pageSize, filter) {
      let params = new URLSearchParams();
      params.append("pageNo", pageNo);
      params.append("pageSize", pageSize);
      params.append("filter", filter);
      return this.$axios.get(
        this.$axios.config.sdd.baseURL +
        this.$axios.config.sdd.baseCode.format({codeType: "123"}) +"?" +
          params.toString()
      )
    }
  }
}
</script>
```

### 禁用选择器

在`pager-select`中，设定`disabled`值为 true，即可禁用选择器
```html
<template>
    <pager-select
      v-model="selectModel"
      :remote-method="pagerQuery"
      :disabled="true"
    ></pager-select>
</template>
```

### 设置选项每页展示的条数

在`page-size`中，设定页面需要展示的数据条数
```html
<template>
    <pager-select
      v-model="selectModel"
      :remote-method="pagerQuery"
      :page-size="6"
    ></pager-select>
</template>
```

### page-select Attributes
| 参数            | 说明   | 类型                      | 可选值 | 默认值 |
| --------------- | ------ | ------------------------- | ------ | ------ |
| value / v-model | 绑定值 | boolean / string / number | —      | —      |
| disabled | 禁用选择器 | boolean | true/false      | false      |
| page-size | 设置一页展示的数据条数 | number | —      | —       |

### page-select methods
| 方法名           | 说明   | 参数 |
| --------------- | ------ | ------ |
| remote-method | 请求分页数据 | —      |

