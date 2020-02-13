<template>
  <div id="app">
    <el-container>
      <el-header>
        <nav-bar></nav-bar>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer></el-footer>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import NavBar from '@/components/nav-bar/index.vue';

@Component({
  components: {
    NavBar,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
@import "./assets/style/index.scss";

.el-header {
  padding: 0 !important;
  height: 48px !important;
}
</style>
