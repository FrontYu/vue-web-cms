import Vue from 'vue'
import Vuex from 'vuex'

import vuexI18n from 'vuex-i18n'
import LangEN from '@/i18n/en-US.json'
import LangCN from '@/i18n/zh-CN.json'
import LangHK from '@/i18n/zh-HK.json'

Vue.use(Vuex)

const i18nStore = new Vuex.Store()
Vue.use(vuexI18n.plugin, i18nStore)
Vue.i18n.add('en-US', LangEN)
Vue.i18n.add('zh-CN', LangCN)
Vue.i18n.add('zh-HK', LangHK)
Vue.i18n.set('en-US')

// 定义状态
const state = {
  userType: 0,
  direction: 'forward',
  lang: 'cn',
  errorTips: {
    show: false,
    text: ''
  },
  // fileImg: '',
  // uploadFile: {
  //   file: null,
  //   fileName: null,
  //   fileUrl: null
  // },
  merchantData: {
    locations: [],
    merchant: {}
  }
}

const store = new Vuex.Store({
  state,
  modules: {
    i18n: vuexI18n.store
  },
  mutations: {
    USER_TYPE (state, val) {
      state.userType = val
    },
    UPDATE_DIRECTION (state, direction) {
      state.direction = direction
    },
    CHANGE_LANGUAGE (state, msg){
      state.lang = msg
      Vue.i18n.set(state.lang)
    },
    ERROR_TIPS (state, data){
      state.errorTips = data
    },
    // SHOW_FILE_IMG (state, msg){
    //   state.fileImg = msg
    // },
    // UPLOAD_FILE (state, arr){
    //   state.uploadFile.file = arr.file
    //   state.uploadFile.fileName = arr.fileName
    //   state.uploadFile.fileUrl = arr.fileUrl
    // },
    MERCHNAT_DATA (state, data){
      state.merchantData = data
    }
  }
})

export default store