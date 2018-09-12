<template>
  <div>

    <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100;"
    :title="$t('login')"
    :left-options="{backText: '', showBack: false}">
      <span slot="right">
        <router-link :to="{path: '/merchant/'+$route.params.system+'/register'}"><span class="sign-up-link">{{ $t('sign up') }}</span></router-link>
      </span>
    </x-header>

    <div class="head-pt">
      <div class="login-logo"></div>
      <h1 class="welcome">{{ $t('welcome to whoot platfrom') }}</h1>
      <sms-login></sms-login>
    </div>

  </div>
</template>

<script>
import { XHeader } from 'vux'
export default {
  name: 'login',
  components: {
    XHeader,
    'smsLogin': () => import('@/components/smsLogin.vue')
  },
  data () {
    return {

    }
  }
}
</script>

<style scoped>
  .login-logo{width: 200px;height: 100px;background:url('../assets/images/logo.png') center no-repeat;background-size: 95%;margin:32px auto 0;}
  .welcome{font-size: 16px;color:#000;text-align: center;margin-bottom: 40px;}
  .sign-up-link{font-size: 16px;color: #333;}
</style>
