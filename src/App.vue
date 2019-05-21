<template>
  <div id="app">
    <Layout />
    <Login />
  </div>
</template>

<script>
import Layout from "./layout";
import Login from "./views/saa/login";
export default {
  name: "App",
  components: {
    Layout,
    Login
  }
};
</script>

<style>
#app {
  background: #f2f2f4;
}
</style>
