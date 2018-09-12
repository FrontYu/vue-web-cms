<template>
  <div>

    <group>
      <x-input class="phone-input" mask="999 9999 9999" v-model="phoneNum" :max="13" is-type="china-mobile" keyboard="number" :placeholder="$t('phone number')" v-validate.initial="'required'" name="phone-num">
        <span slot="label" mini @click="changeNation">
          <span class="nation-text">+{{ nativeCode }}</span>
        </span>
        <x-button slot="right" type="primary" mini @click.native="getCode" :disabled="sendCodeBtn || errors_val.has('phone-num')">
          <span v-show="sendCodeText">{{ $t('send code') }}</span>
          <countdown v-show="sendCodeTimeNum" v-model="timeNum" :start="timeStart" @on-finish="timeFinsh"></countdown>
          <span v-show="sendCodeTime">{{ $t('second') }}</span>
        </x-button>
      </x-input>
    </group>

    <group>
      <x-input class="phone-code" :placeholder="$t('verification code')" :max="6" v-model="smsCode" keyboard="number" v-validate.initial="'required|min:6'" name="phone-code">
        <!-- <img slot="label" style="padding-right:30px;display:block;" src="http://dn-placeholder.qbox.me/110x110/FF2D55/000" width="24" height="24"> -->
      </x-input>
    </group>


    <div class="sign-bar">
      <x-button :gradients="['#37a1f8', '#37a1f8']" :show-loading="false" :disabled="loginBtn = errors_val.has('phone-code') || errors_val.has('phone-num')" @click.native="smsLoginBtn" :class="{'disabled-btn': errors_val.has('phone-code') || errors_val.has('phone-num')}" >
        <spinner type="ripple" v-show="signLoading"></spinner> <span v-show="signText">{{ $t('login') }}</span>
      </x-button>
    </div>

    <actionsheet v-model="showNation" :menus="nationCodeMenus" @on-click-menu="clickNation" show-cancel :cancel-text="$t('cancel')"></actionsheet>

    <popup v-model="errPoint" position="bottom">
      <div class="err-point" v-text="errText"></div>
    </popup>

  </div>
</template>

<script>
import { XInput, XButton, Group, Spinner, Countdown, Actionsheet, Popup } from 'vux'

export default {
  name: 'smsLogin',
  components: {
    XInput,
    XButton,
    Group,
    Spinner,
    Countdown,
    Actionsheet,
    Popup
  },
  data (){
    return {
      errPoint: false,
      errText: '',
      sendCodeText: true,
      sendCodeTimeNum: false,
      sendCodeTime: false,
      sendCodeBtn: false,
      timeStart: false,
      timeNum: 5,
      nativeCode: 86,
      // nativeCodeList: [{key: '86', value: '+86'}, {key: '852', value: '+852'}],
      phoneNum: '',
      smsCode: '',
      signLoading: false,
      loginBtn: true,
      signText: true,
      showNation: false,
      nationCodeMenus: {
        86: '+86',
        852: '+852'
      }
    }
  },
  methods: {
    changeNation() {
      this.showNation = true
    },
    clickNation(key, value) {
      if(value) {
        this.nativeCode = key
      }
    },
    timeFinsh() {
      this.sendCodeText = true,
      this.sendCodeTimeNum = false,
      this.sendCodeTime = false,
      this.timeStart = false,
      this.sendCodeBtn = false,
      this.timeNum = 5
    },
    getCode() {
      this.sendCodeText = false
      this.sendCodeTimeNum = true
      this.sendCodeTime = true
      this.sendCodeBtn = true
      this.timeStart = true

      this.$ajax.post('/merchant/sms/code', {
        nation_code: this.nativeCode,
        phone: this.phoneNum.replace(/ /g,'')
      })
      .then((res) => {
        console.log(res)
        if(res.data.code != 0){
          this.errPoint = true
          this.errText = this.$t('error.code.'+res.data.code)
        }
      })
      .catch((err) => {
        console.log(err)
        this.errPoint = true
        this.errText = err
      })
    },
    smsLoginBtn() {
      this.signLoading = true
      this.loginBtn = true
      this.signText = false

      this.$ajax.post('/merchant/sms/login', {
        nation_code: this.nativeCode,
        phone: this.phoneNum.replace(/ /g, ''),
        code: this.smsCode
      })
      .then((res) => {
        console.log(res)
        this.signLoading = false
        this.loginBtn = false
        this.signText = true
        if(res.data.code === 0){
          // this.$router.push({path: '/merchant/'+this.$route.params.system+'/home'})
          let loginStatus = res.data.data.user_type
          console.log(loginStatus)
          switch(loginStatus) {
            case 1:
              this.$router.push({
                path: '/merchant/'+this.$route.params.system+'/home'
              })
              this.$store.commit('USER_TYPE', 6)
              console.log('merchant')
              break
            case 2:
              this.$router.push({
                path: '/merchant/'+this.$route.params.system+'/locations'
              })
              this.$store.commit('USER_TYPE', 5)
              console.log('manager')
              break
            case 3:
              this.$router.push({
                path: '/merchant/'+this.$route.params.system+'/locations'
              })
              this.$store.commit('USER_TYPE', 3)
              console.log('staff')
              break
          }
        }else{
          this.errPoint = true
          this.errText = this.$t('error.code.'+res.data.code)
        }
      })
      .catch((err) => {
        this.signLoading = false
        this.loginBtn = false
        this.signText = true
        console.log(err)
        this.errPoint = true
        this.errText = err
      })
    }
  }
}
</script>

<style>
.phone-input .weui-input{font-size: 14px;}
.phone-code .weui-input{font-size: 14px;}
</style>

<style scoped>
.sign-bar{width: 80%;margin:20px auto 0;}
.weui-btn_primary{background-color: #37a1f8;}
.weui-btn_disabled.weui-btn_primary{background-color:#ababab;}
.sign-bar .vux-spinner{stroke:#fff;}
.nation-text{color:#333;font-weight: bold;padding-right: 10px;}
.phone-input .weui-btn_primary{position: absolute; top: 1px; right: 0px; border-radius: 0; height: 43px;width: 100px;background-color:#3a3a3a;}
.phone-input .weui-btn_disabled.weui-btn_primary{background-color:#8e8e8e;}
.phone-input{height: 25px;}
.phone-code{height: 25px;}
.disabled-btn{opacity: .5;}
</style>