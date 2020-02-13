<template>
  <div class="crud-card">
    <!-- 搜索过滤/创建 -->
    <slot name="header">
      <search-header
        slot="header"
        :searchFields="$attrs.searchFields"
        :btn="$attrs.btn || []"
        @toAdd="toAdd"
        @search="toSearch"
      ></search-header>
    </slot>


    <!-- 表格 -->
    <el-table size="medium" :data="tableData" :attrs="CtableAttrs">
      <slot></slot>
      <el-table-column>
        <template slot-scope="{ row }">
          <el-button size="mini" type="danger" plain="true">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>


    <!-- 分页 -->
    <div class="crud-card--page">
      <slot name="page">
        <el-pagination
          v-if="count > query._limit"
          background
          :current-page="query._page"
          layout="prev, pager, next"
          :total="count"
          @current-change="toSearch"
        >
        </el-pagination>
      </slot>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import SearchHeader from './search-header.vue';

export default Vue.extend({
  name: 'CrudCard',
  components: {
    SearchHeader,
  },
  props: {
    tableAttrs: {
      type: Object,
      default: () => ({}),
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  data(): { tableData: any[]; [key: string]: any } {
    return {
      tableData: [],
      query: {
        _limit: 20,
        _page: 1,
      },
      count: 0,
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    toAdd() {
      this.$emit('toAdd');
    },
    async loadData() {
      let tableData = [];
      const { api, getData, getCount } = this.item;
      if (api) {
        const { data } = await api(this.query);
        if (getCount) {
          this.count = getCount(data);
        } else {
          this.count = data.meta.count;
        }
        if (getData) {
          tableData = getData(data);
        } else {
          tableData = data.items;
        }
      }
      this.tableData = tableData;
    },
    toSearch(query: any) {
      this.query = {
        ...this.query,
        ...query,
      };
      this.loadData();
    },
  },
  computed: {
    CtableAttrs(): object {
      return this.tableAttrs;
    },
  },
});
</script>

<style lang="scss">
.crud-card {
  &--page {
    margin: 20px auto;
    text-align: center;
  }
}
</style>
