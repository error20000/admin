<template>
  <div>
    <el-menu 
      background-color="#20a0ff" 
      text-color="#fff" 
      active-text-color="#ffd04b" 
      class="el-menu-demo" 
      mode="horizontal" 
      :default-active="defaultActive"
      @select="handleSelect">
      <template v-for="(item, index) in menuData">
          <el-submenu v-if="item[childrenKey] && item[childrenKey].length > 0" :index="item[indexKey]" :key="index">
            <template slot="title">
              <i :class="item[iconKey] ? item[iconKey]: '' "></i>
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
              <i :class="item[iconKey] ? item[iconKey]: '' "></i>
              <span>{{ item[nameKey] }}</span>
            </template>
          </el-menu-item>
        </template>
    </el-menu>
  </div>
</template>

<script>
  import menuTree from './menuTree'

  export default {
    name: 'menuH',
    components: {
      menuTree,
    },
    props: {
        menuData: {
            required: true,
            type: Array
        },
        defaultActive: {
            required: false,
            type: String
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
        pathKey: {
            required: false,
            type: String,
            default: 'path'
        },
        childrenKey: {
            required: false,
            type: String,
            default: 'children'
        }
    },
    watch: {
      // 监听浏览器直接输入路由，将此路由添加到tabnavBox
      '$route.path': function (val) {
        this.selectMenu(val)
      }
    },
    methods: {
      handleSelect: function(index, path){
        console.log(index, path);
        let menusOrg = this.$store.state.menusOrgData;
        console.log("handleSelect", menusOrg);
        let menu = null;
        for (let i = 0; i < menusOrg.length; i++) {
          const e = menusOrg[i];
          if(index == e[this.indexKey]){
            menu = e;
            break;
          }
        }
        //this.$router.push(menu[this.pathKey]);
        this.$router.push("/test");
      },
      selectMenu (path) {
        
        console.log("selectMenu", path);
        let menus = this.$store.state.menusTreeData
        let name = ''
        let navTitle = function (path, routerARR) {
          for (let i = 0; i < routerARR.length; i++) {
            if (routerARR[i].children.length > 0 || routerARR[i].path === path) {
              if (routerARR[i].path === path && routerARR[i].children.length < 1) {
                name = routerARR[i].name
                break
              }
              navTitle(path, routerARR[i].children)
            }
          }
          return name
        }
        this.$store.dispatch('addTab', {
          title: navTitle(key, router),
          path: key
        })
      }
    }
  }
</script>

<style scoped>
  
</style>
