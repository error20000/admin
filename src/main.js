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

//全局变量
window.LOCALE_LOIN_USER_KEY = 'loginUser';
window.LOCALE_LOIN_URL = '/login';

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
