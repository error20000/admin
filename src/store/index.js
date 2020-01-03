import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loginTitle: i18n.t('login.title'),
    sysName: i18n.t('sysName'),

    //本地存储
    storage:{
      menusTreeDataKey: 'menusTreeData', //菜单树
      menusDataKey: 'menusData', //菜单
      menuFunsDataKey: 'menuFunsData', //菜单功能（按钮）
    },
    //数据字段映射
    field:{
      menu: {
        name: "sMenu_Name",
        icon: "sMenu_Icon",
        index: "sMenu_ID",
        path: "sMenu_Url",
        order: "lMenu_Order",
        children: "children",
      },
      menuFunsButton: 'sMFun_Button', //按钮权限标识
    },
    //缓存
    cache: {
      menuFunsData:'',
    },

    test:[]
  },
  mutations: {
    setTest: function(state, value){
      state.test = value;
    }
  },
  actions: {
    setTest: function(context, value){
      context.commit("setTest", value);
    }
  },
  modules: {
  }
})
