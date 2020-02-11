<template>
  <el-menu
    class="nav-bar"
    router
    mode="horizontal"
    background-color="#545c64"
    text-color="#fff"
    :default-active="activeIndex"
    active-text-color="#ffd04b">
    <el-menu-item index="/">客户端</el-menu-item>
    <!-- <el-menu-item index="/">主页</el-menu-item> -->
    <!-- <el-submenu index="/client">
      <template slot="title">客户端</template>
      <el-menu-item index="/client/list">客户端列表</el-menu-item>
      <el-menu-item index="/client/acl">ACL</el-menu-item>
    </el-submenu>
    <el-submenu index="config">
      <template slot="title">管理</template>
      <el-menu-item index="/emqx">EMQ X 配置</el-menu-item>
    </el-submenu> -->
    <el-menu-item index="/about">关于</el-menu-item>
  </el-menu>

</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      activeIndex: '/',
    };
  },
});
</script>

<style lang="scss">
.nav-bar {
  display: flex;
  justify-content: center;
  .el-menu-item {
    height: 48px !important;
    line-height: 48px !important;
  }
}
</style>
