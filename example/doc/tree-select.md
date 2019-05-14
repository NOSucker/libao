## tree-select 树状选择器

当选项过多且具有层级关系时，使用树形下拉菜单展示并选择内容。

### 基础用法

适用的树形单选
 `v-model`的值为当前被选中的 value 属性值
```html
<!--treeQuery, treeQuery为文档示例处理函数，开发中可自定义 -->
<template>
    <tree-select
      v-model="selected"
      :highlight-current="true"
      :remote-method="treeQuery"
      :init-lable-method="initLabel"
      :props="defaultProps"
    />
</template>

<script>
  // 此处定义组名为TreeSelect，若引入组件时命名不为TreeSelect，可根据自己的命名进行调整，组件路径根据项目调整
  import treeSelect from "~/components/tree-select";
  export default {
    data() {
      return {
        selected: "",
        // 数据默认字段，对应接口返回数据字段
        defaultProps: {
          parent: "parentId", // 父级唯一标识
          value: "value", // 唯一标识
          label: "label", // 标签显示
          children: "children" // 子级
        }
      }
    },
    components: {
      treeSelect
    },
    methods: {
      // url根据业务接口进行请求，以下仅为示例代码
      treeQuery(node) {
        // node存在时通过node请求子节点，node不存在时请求所有一级节点
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
        let node = "2"; // node为回显时接口返回的选中的节点，需从接口取值
        this.selected = node;
        return this.$axios.get(
          this.$axios.config.sdd.baseURL +
            this.$axios.config.treeQuery +
            `/${node}`
        );
      }
    }
  }
</script>
```

### 禁用选择器

在`tree-select`中，设定`disabled`值为 true，即可禁用选择器
```html
<template>
    <tree-select
        v-model="selected"
        :remote-method="treeQuery"
        :init-lable-method="initLabel"
        :props="defaultProps"
        :disabled="true"
    />
</template>
```

### tree-select Attributes
| 参数            | 说明   | 类型                      | 可选值 | 默认值 |
| --------------- | ------ | ------------------------- | ------ | ------ |
| value / v-model | 绑定值 | boolean / string / number | —      | —      |
| props | 树组件数据默认字段，对应接口返回数据字段 | object | —      | —      |
| disabled | 禁用选择器 | boolean | true/false      | false      |

### tree-select methods
| 方法名           | 说明   | 参数 |
| --------------- | ------ | ------ |
| remote-method | 请求树节点数据 | —      |
| init-lable-method | 回显时通过返回的树节点的value查询选择框中展示的label内容 | 回显时返回的树节点|

### tree-select event
| 事件名称         | 说明   |   回调参数   |
| -----------------| ------ |-------- |
| treeChange |  点击树节点时触发事件  | 当前点击的节点 |
