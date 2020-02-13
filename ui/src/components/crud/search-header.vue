/* eslint-disable no-underscore-dangle */
<template>
  <div class="search-header">
    <div class="search-header-item">

      <el-input
        v-for="(item, i) in _searchFields"
        v-bind="item.attrs"
        v-on="item.on"
        v-model="record[item.key]"
        :key="i"
      ></el-input>

      <el-button
        v-if="_btn.includes('search')"
        type="primary"
        icon="el-icon-search"
        @click="toSearch">
        搜索
      </el-button>
    </div>
    <div class="search-header-item">
      <el-button v-if="_btn.includes('search')" type="dashed" icon="el-icon-plus" @click="toAdd">
        添加
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ISearcnFields } from '@/interface/common.interface.ts';

export default Vue.extend({
  name: 'SearchHeader',
  props: {
    searchFields: {
      type: Array,
      default: () => [],
    },
    btn: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      record: {},
    };
  },
  methods: {
    toAdd() {
      this.$emit('toAdd');
    },
    toSearch() {
      const val = this.getSearchValue();
      this.$emit('search', val);
    },
    getSearchValue() {
      const data: any = {};
      this._searchFields.forEach((item: ISearcnFields) => {
        const { key } = item;
        let val: any = this.record[key];
        if (item.transform) {
          val = item.transform(val);
        }
        data[key] = val;
      });
      return data;
    },
  },
  computed: {
    // eslint-disable-next-line no-underscore-dangle
    _searchFields(): any[] {
      return this.searchFields.map((item: ISearcnFields) => ({
        ...item,
      }));
    },
    // eslint-disable-next-line no-underscore-dangle
    _btn(): string[] {
      const defaultValue: any = { refresh: true, search: true, create: true };
      this.btn.forEach((btn: any) => {
        if (btn.startsWith('-')) {
          delete defaultValue[btn.replace('-', '')];
        } else {
          defaultValue[btn] = true;
        }
      });
      return Object.keys(defaultValue) || [];
    },
    showHeader(): boolean {
      return this.searchFields.length > 0 && this._btn.length > 0;
    },
  },
});
</script>

<style lang="scss">
  .search-header {
  margin: 20px auto;
  width: 100%;
  // border: 1px solid #f5f5f5;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius:  4px;
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
