<template>
  <div>
    <div class="menu-pd">
      <div class="user-message">
        <div class="user-header" v-lazy:background-image="getImage(merchant.photo)"></div>
        <div @click="changeLang" class="lang-btn" v-text="languageText()">{{ $t('language') }}</div>

        <div class="user-name" v-text="merchant.name"></div>

      </div>

      <span @click="drawerVisibility = false">
        <router-link :to="{path: '/merchant/'+$route.params.system+'/settings'}"><div class="settings-btn">{{ $t('settings') }}</div></router-link>
      </span>
    </div>
    <div class="menu-bottom">
      <router-link :to="{path: '/merchant/'+$route.params.system+'/service'}">
        <div class="service-btn">{{ $t('terms of service') }}</div>
      </router-link>
      <div class="logout-btn" @click="logout">{{ $t('logout') }}</div>
    </div>

    <div v-transfer-dom>
      <actionsheet :show-cancel="false" v-model="showLang" :menus="showLangMenus" @on-click-menu="clickLang" show-cancel :cancel-text="$t('cancel')"></actionsheet>
    </div>

  </div>
</template>

<script>
import { Actionsheet, TransferDomDirective as TransferDom } from 'vux'

export default {
  name: 'profile',
  directives: {
    TransferDom
  },
  components: {
    Actionsheet,
  },
  methods: {
    changeLang() {
      this.showLang = true
    },
    languageText() {
      let lang = this.merchant.language
      return this.showLangMenus[lang]
    },
    clickLang(key, value) {
      if (value){
        this.merchant.language = key
        this.$i18n.set(key)
        this.$store.commit('CHANGE_LANGUAGE', key)
        this.$ajax.post('/merchant/profile', {
          language: key
        })
        .then((res) => {
          if(res.data.code != 0){
            this.errTips(res.data.code)
          }
        })
      }
    },
    logout() {
      this.$ajax.post('/merchant/logout')
      .then((res) => {
        console.log(res)
        if(res.data.code === 0){
          this.$router.push({path: '/merchant/'+this.$route.params.system+'/login'})
        }else{
          this.errTips(res.data.code)
        }
      })
      .catch((err) => {
        console.log(err)
      })
    }
  },
  watch: {
    '$store.state.merchantData': function(val) {
      this.merchant = val.merchant
    }
  },
  data() {
    return {
      drawerVisibility: false,
      showLang: false,
      showLangMenus: {
        'en-US': 'English',
        'zh-CN': '中文简体',
        'zh-HK': '中文繁体'
      },
      merchant: this.$store.state.merchantData.merchant
    }
  }
}
</script>

<style scoped>
.menu-pd{padding: 20px; position: relative;}
.menu-bottom{position: absolute;bottom: 20px;left:20px;}

.user-header{width: 80px;padding-bottom: 80px;overflow:hidden;background-position: center center;background-repeat: no-repeat;-webkit-background-size:cover;-moz-background-size:cover;background-size:cover;border-radius: 50%;border:2px solid #fff;}
.lang-btn{color:#fff;position: absolute;right: 20px;top:20px;padding:0 10px;border:2px solid #fff;border-radius: 5px;min-width: 70px;height: 35px;line-height: 35px;text-align: center;}
.user-name{color:#333;height: 45px;line-height: 45px;}
.settings-btn{color:#fff;margin-top:20px;padding-left:35px;background-image: url(../assets/images/icon-settings.png);background-position: left;background-size: auto 18px;background-repeat:no-repeat;}
.service-btn{font-size:13px;color: #fff;padding-left:35px;background-image: url(../assets/images/icon-service.png);background-position: left;background-size: auto 18px;background-repeat:no-repeat;}
.logout-btn{font-size:13px;color: #fff;margin-top:10px;padding-left:35px;background-image: url(../assets/images/icon-logout.png);background-position: left;background-size: auto 18px;background-repeat:no-repeat;}
</style>