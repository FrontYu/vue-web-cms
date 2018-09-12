import 'babel-polyfill'
import Vue from 'vue'
import FastClick from 'fastclick'
import App from './App'
import Routes from './router/index.js'
import axios from 'axios'
import qs from 'qs'
import Vuex from 'vuex'
import store from './vuex/store'
import VueLazyload from 'vue-lazyload'
import VeeValidate, { Validator } from 'vee-validate'
// import zh_CN from 'vee-validate/dist/locale/zh_CN'
import VueLazyComponent from '@xunlei/vue-lazy-component'
import { LoadingPlugin, ToastPlugin } from 'vux'

/* Plugs config */

// Validator.localize('zh_CN', zh_CN)
const config_VeeValidate = {
  errorBagName: 'errors_val', // change if property conflicts
  fieldsBagName: 'fields',
  delay: 0,
  locale: 'en-US',
  dictionary: null,
  strict: true,
  classes: false,
  classNames: {
    touched: 'touched', // the control has been blurred
    untouched: 'untouched', // the control hasn't been blurred
    valid: 'valid', // model is valid
    invalid: 'invalid', // model is invalid
    pristine: 'pristine', // control has not been interacted with
    dirty: 'dirty' // control has been interacted with
  },
  events: 'input|blur',
  inject: true,
  validity: false,
  aria: true,
  i18n: null, // the vue-i18n plugin instance,
  i18nRootKey: 'validations' // the nested key under which the validation messsages will be located
}

/* Use Plugs */

Vue.use(VueLazyComponent)
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.use(Vuex)
Vue.use(VeeValidate, config_VeeValidate)
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: require('@/assets/images/img-error.jpg'),
  loading: require('@/assets/images/img-loading.gif'),
  attempt: 1
})

FastClick.attach(document.body)

/*** Global function ***/

/* axios config */
Vue.prototype.$ajax = axios.create({
  // timeout: 10000,
  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  transformRequest: [
    (data) => {return qs.stringify(data)}
  ],
  paramsSerializer: (data) => {return qs.stringify(data)}
})

/* Get compressed picture */
Vue.prototype.getImage = (url) => {
  if (url && url.indexOf('.jpeg') > 0){
    return url.substring(0,url.lastIndexOf('.'))+'_s'+url.substring(url.lastIndexOf('.'))
  }else{
    return url
  }
}

/* error tips */
Vue.prototype.errTips = (code) => {
  store.state.errorTips.show = true
  store.state.errorTips.text = code
}

/* dev mock */
import mock from './mock.js'
// Vue.config.debug = true
// require('@/assets/js/console.min.js')

/* bug test */
require('@/assets/js/bugtags-1.0.3.js')
new Bugtags('f98f0c345a61f6681caf87f20988479f', '1.0.0', '1.0.1')


// Set this to false to prevent the production tip on Vue startup.
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  router:Routes,
  store,
  render: h => h(App)
}).$mount('#app-box')
