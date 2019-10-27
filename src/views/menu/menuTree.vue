<template>
    <div>
      <template v-for="(item, index) in menuData">
        <el-submenu v-if="item[childrenKey] && item[childrenKey].length > 0" :index="item[indexKey]" :key="index">
          <template slot="title">
            <i :class="item[iconKey] ? item[iconKey]: 'fa fa-key fa-fw' "></i>
            <span>{{ item[nameKey] }}</span>
          </template>
          <menu-tree 
            :menuData="item[childrenKey]" 
            :nameKey="nameKey" 
            :iconKey="iconKey" 
            :indexKey="indexKey" 
            :childrenKey="childrenKey">
          </menu-tree>
        </el-submenu>

        <el-menu-item v-else :index="item[indexKey]" :key="index">
          <template slot="title">
            <i :class="item[iconKey] ? item[iconKey]: 'fa fa-key fa-fw' "></i>
            <span>{{ item[nameKey] }}</span>
          </template>
        </el-menu-item>
      </template>
    </div>
</template>

<script>
export default {
  name: 'menuTree',
  props: {
      menuData: {
          required: true,
          type: Array
      },
      nameKey: {
          required: false,
          type: String,
          default: 'name'
      },
      iconKey: {
          required: false,
          type: String,
          default: 'icon'
      },
      indexKey: {
          required: true,
          type: String,
          default: 'index'
      },
      childrenKey: {
          required: false,
          type: String,
          default: 'children'
      }
  }
}
</script>

<style>

</style>
