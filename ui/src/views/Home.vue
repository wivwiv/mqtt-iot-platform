<template>
  <div class="home">
     <crud-card :item="item" :data="clients" :searchFields="searchFields" stripe>
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
    </crud-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ISearcnFields } from '@/interface/common.interface';
import { findAllClient } from '../api/client';
import CrudCard from '../components/crud/crud-card.vue';

export default Vue.extend({
  name: 'Home',
  components: {
    CrudCard,
  },
  data(): {
    searchFields: ISearcnFields;
    [key: string]: any;
    } {
    return {
      clients: [],
      searchFields: [
        {
          key: 'clientid',
          attrs: {
            placeholder: 'Client ID',
            clearable: true,
          },
        },
      ],
      item: {
        api: findAllClient,
        getCount(data) {
          return data.length;
        },
        getData(data) {
          return data;
        },
      },
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
    },
  },
});
</script>

<style lang="scss">

</style>
