<template>
  <div>

    <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100;"
    :title="$t('sign up')"
    :left-options="{backText: '', showBack: true}">
    </x-header>

    <div class="head-pt">
      <p class="sign-tips-text">{{ $t('Welcome to Whoot! platform and please fill in the following') }}</p>

      <group>
        <x-input class="input-phone" :placeholder="$t('phone number')" v-model="phone">
          <img slot="label" class="input-icon" src="../assets/images/icon-phone.png" width="18" height="22">
          <span slot="right" mini @click="changeNation">
            <span class="nation-text">+{{ nation_code }}</span>
          </span>
        </x-input>
      </group>

      <!-- <group>
        <x-input placeholder="Email Adress" v-model="email">
          <img slot="label" style="padding-right:10px;display:block;" src="../assets/images/icon-email.png" width="24" height="24">
        </x-input>
      </group> -->

      <group>
        <x-input class="input-code" :placeholder="$t('authorization code')" v-model="code">
          <img slot="label" class="input-icon" src="../assets/images/icon-code.png" width="18" height="22">
        </x-input>
      </group>

      <div class="sign-bar">
        <x-button :gradients="['#37a1f8', '#37a1f8']" :show-loading="false" :disabled="signBtn" @click.native="signUpBtn">
          <spinner type="ripple" v-show="signLoading"></spinner> <span v-show="signText">{{ $t('sign up') }}</span>
        </x-button>
      </div>
    </div>

    <actionsheet v-model="showNation" :menus="nationCodeMenus" @on-click-menu="clickNation" show-cancel :cancel-text="$t('cancel')"></actionsheet>

    <div v-transfer-dom>
      <popup v-model="errPoint" position="bottom">
        <div class="err-point" v-text="errText"></div>
      </popup>
    </div>

  </div>
</template>

<script>
import { XHeader, Group, XInput, XButton, Spinner, Actionsheet, Popup, TransferDomDirective as TransferDom } from 'vux'
export default {
  name: 'login',
  directives: {
    TransferDom
  },
  components: {
    XHeader,
    Group,
    XInput,
    XButton,
    Spinner,
    Actionsheet,
    Popup
  },
  methods: {
    changeNation() {
      this.showNation = true
    },
    clickNation(key, value) {
      if (value){
        this.nation_code = key
      }
    },
    signUpBtn() {
      this.signLoading = true
      this.signText = false
      this.signBtn = true
      let postData = {
        nation_code: this.nation_code,
        phone: this.phone,
        code: this.code
      }
      this.$ajax.post('/merchant/register',postData)
      .then((res) => {
        this.signLoading = false
        this.signText = true
        this.signBtn = false
        console.log(res)
        if(res.data.code === 0 ){
          this.$router.push({
            path: '/merchant/'+this.$route.params.system+'/login'
          })
        }else{
          this.signLoading = false
          this.signText = true
          this.signBtn = false
          this.errPoint = true
          this.errText = this.$t('error.code.'+res.data.code)
        }
      })
      .catch((err) => {
        this.signLoading = false
        this.signText = true
        this.signBtn = false
        this.errPoint = true
        this.errText = err
      })
    }
  },
  data () {
    return {
      errPoint: false,
      errText: '',
      showNation: false,
      signBtn: false,
      signLoading: false,
      signText: true,
      nation_code: 86,
      phone: '',
      code: '',
      nationCodeMenus: {
        86: '+86',
        852: '+852'
      }
    }
  }
}
</script>

<style>
.input-phone .weui-input{font-size: 14px;}
.input-code .weui-input{font-size: 14px;}
</style>

<style scoped>
.sign-tips-text{text-align: center; color:#666;font-size: 16px;margin:2rem auto;width: 85%;}
.input-icon{padding-right:8px;margin-right:8px;display:block;border-right:1px solid #b7b7b7;}
.sign-bar{width: 80%;margin:2rem auto 0;}
.sign-bar .vux-spinner{stroke:#fff;}
.nation-text{color:#333;font-weight: bold;}
.phone-input{height: 25px;}
.phone-code{height: 25px;}
</style>
