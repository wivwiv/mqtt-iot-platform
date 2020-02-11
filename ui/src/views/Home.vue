<template>
  <div class="home">
    <div class="list-header">
      <div class="list-header-item">
        <el-input v-model="option.clientid" placeholder="Client ID"></el-input>
        <el-button icon="el-icon-search" @click="loadData" type="success">搜索</el-button>
      </div>
      <div class="list-header-item">
        <el-button type="primary" icon="el-icon-plus">添加</el-button>
      </div>
    </div>
     <el-table :data="clients" stripe>
      <el-table-column
        prop="date"
        label="Client ID"
        min-width="120px">
      </el-table-column>

      <el-table-column
        prop="username"
        label="Username"
        min-width="80px">
      </el-table-column>

      <el-table-column
        prop="onlineState"
        label="在线状态">
      </el-table-column>

    </el-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { findAllClient } from '../api/client';

export default Vue.extend({
  name: 'Home',
  data() {
    return {
      clients: [],
      option: {
        clientid: '',
      },
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      findAllClient({ _page: 1, _limit: 1000 }).then((resp) => {
        this.clients = resp.data;
      });
    },
  },
});
</script>

<style lang="scss">
.list-header {
  margin: 20px auto;
  width: 100%;
  // border: 1px solid #f5f5f5;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius:  2px;
  display: flex;
  &-item {
    display: flex;
    align-items: center;
    max-width: 360px;
    & + & {
      margin-left: 20px;
    }
    .el-input + .el-button {
      margin-left: 12px;
    }
  }
}
</style>
