<template>
  <div id="app">
    <Layout />
  </div>
</template>

<script>
import Layout from "./layout";
export default {
  name: "App",
  components: {
    Layout
  },
  data() {
    return {
      user: {}
    };
  }
};
</script>

<style>
#app {
  background: #f2f2f4;
}
</style>
