<template>
  <div class="not-found">
    <h1>Coming soon</h1>
    <div class="link">
      <el-link href="/">
        Home
      </el-link>
      <el-link href="https://github.com/wivwiv/mqtt-iot-platform" _target="blank">Github</el-link>
      <el-link href="https://wivwiv.com" _target="blank">Blog</el-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({

});
</script>

<style lang="scss">
.not-found {
  text-align: center;
  .link {
    .el-link {
      margin: 4px 10px;
    }
  }
}
</style>
