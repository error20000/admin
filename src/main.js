import Vue from 'vue'
import i18n from './locales';
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.css';
import './assets/css/public.css';
import global from './global';
//import ElementLocale from 'element-ui/lib/locale'

//ElementLocale.i18n((key, value) => i18n.t(key, value));

Vue.use(ElementUI, { 
	size: 'mini',
	i18n: (key, value) => i18n.t(key, value)
});
Vue.use(global);

Vue.config.productionTip = false;

//自定义指令--权限验证
Vue.directive('hasAuth', {
	inserted: function (el, binding, vnode) {
		let auth = binding.value;
		let menuFuns = store.state.cache.menuFunsData;
		if(!menuFuns){
			menuFuns = JSON.parse(localStorage.getItem(store.state.storage.menuFunsDataKey));
			store.state.cache.menuFunsData = menuFuns;
		}
		let flag = false;
		for (var i = 0; i < menuFuns.length; i++) {
			if(menuFuns[i][store.state.fields.menuFun.button] == auth){
			  flag = true;
			  break;
			}
		}
    	if(!flag){
      		el.parentNode.removeChild(el);
    	}
　	}
});

//  获取角色信息，根据用户权限动态加载路由
/* router.beforeEach((to, from, next) => {
	console.log(store.getters.token)
	// debugger
  
	if (store.getters.token) {
	  store.dispatch('setToken', store.getters.token)
	  if (to.path === '/login') {
		next({path: '/'})
	  } else {
		if (!store.getters.info.role) {
		  // const role = ['/markdown', '/erji', '/erji2', '/siji', '/wuji']
		  !async function getAddRouters () {
			// 省略 axios 请求代码 通过 token 向后台请求用户权限等信息，这里用假数据赋值
			await store.dispatch('getInfo', {
			  role: 'superAdmin',
			  permissions: '超级管理员'
			})
			await store.dispatch('newRoutes', store.getters.info.role)
			console.log(store.getters.addRouters)
			await router.addRoutes(store.getters.addRouters)
			next({path: '/index'})
		  }()
		} else {
		  let is404 = to.matched.some(record => {
			if(record.meta.role){
			  return record.meta.role.indexOf(store.getters.info.role) === -1
			}
		  })
		  if(is404){
			next({path: '/404'})
			return false
		  }
		  next()
		}
	  }
	} else {
	  if (to.path === '/login') {
		next()
	  }
	  next({path: '/login'})
  
	}
  }); */

//全局变量
window.LOCALE_LOIN_USER_KEY = 'loginUser';
window.LOCALE_LOIN_URL = 'login';
window.LOCALE_INDEX_URL = 'index';

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
