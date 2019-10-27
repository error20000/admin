import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

//全局变量
window.LOCALE_LANG_DEFAULT = 'zh-cn';
window.LOCALE_LANG_KEY = 'localeLanguage';

const locales = {
  "zh-cn": require('./lang/zh-cn'),
  "en": require('./lang/en'),
}

const i18n = new VueI18n({
  locale: LOCALE_LANG_DEFAULT,
  messages: locales,
})

//初始化
export const setLang = lang => {
  if (lang === undefined) {
    lang = window.localStorage.getItem(LOCALE_LANG_KEY);
    if (locales[lang] === undefined) {
      lang = LOCALE_LANG_DEFAULT;
    }
  }

  //本地存储
  window.localStorage.setItem(LOCALE_LANG_KEY, lang); 

  //css语言标识
  Object.keys(locales).forEach(lang => {
    document.body.classList.remove(`lang-${lang}`);
  });
  document.body.classList.add(`lang-${lang}`); 
  document.body.setAttribute('lang', lang);

  //Vue的全局配置
  Vue.config.lang = lang;
  i18n.locale = lang;
}

setLang();

window.i18n = i18n;

export default i18n;