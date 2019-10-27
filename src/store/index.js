import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loginTitle: i18n.t('login.title'),
    sysName: i18n.t('sysName'),
    menusTreeDataKey: 'menusTreeData',
    menusDataKey: 'menusData',
    menuFunsDataKey: 'menuFunsData',
    menusOrgData:[],
  },
  mutations: {
    setMenusData: function(state, value){
      state.menusOrgData = value;
    }
  },
  actions: {
    setMenusData: function(context, value){
      context.commit("setMenusData", value);
    }
  },
  modules: {
  }
})
