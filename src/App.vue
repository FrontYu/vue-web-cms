<template>
  <div id="app">
    <transition :name="viewTransition">
      <router-view class="router-view"></router-view>
    </transition>

    <!-- error tips -->
    <error-tips />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ErrorTips from '@/components/errorTips'
export default {
  name: 'app',
  components: {
    ErrorTips
  },
  created() {
    this.getLoginStatus()
  },
  computed: {
    ...mapState({
      direction: state => state.vux.direction
    }),
    viewTransition () {
      if (!this.direction) return ''
      return 'vux-pop-' + (this.direction === 'forward' ? 'in' : 'out')
    }
  },
  methods: {
    getLoginStatus() {
      let loginStatus = document.getElementById('login-status').getAttribute('data-type')
      let urlParams = this.$route.params.system
      urlParams === 'web' || urlParams === 'ios' || urlParams === 'android' ? urlParams : urlParams = 'web'
      loginStatus ? this.loadMerchant() : ''
      switch(loginStatus) {
        case '0':
          this.$router.push({
            path: '/merchant/'+urlParams+'/login'
          })
          this.$store.commit('USER_TYPE', 0)
          console.log('no login')
          break
        case '1':
          this.$router.push({
            path: '/merchant/'+urlParams+'/home'
          })
          this.$store.commit('USER_TYPE', 6)
          console.log('merchant')
          break
        case '2':
          this.$router.push({
            path: '/merchant/'+urlParams+'/locations'
          })
          this.$store.commit('USER_TYPE', 5)
          console.log('manager')
          break
        case '3':
          this.$router.push({
            path: '/merchant/'+urlParams+'/locations'
          })
          this.$store.commit('USER_TYPE', 3)
          console.log('staff')
          break
        default:
          this.$store.commit('USER_TYPE', 6)
          console.log('dev test')
      }
    },
    loadMerchant() {
      this.$ajax.post('/merchant/home')
      .then((res) => {
        console.log(res)
        this.$i18n.set(res.data.data.merchant.language)
        this.$store.commit('CHANGE_LANGUAGE', res.data.data.merchant.language)
        this.$store.commit('MERCHNAT_DATA', res.data.data)
      })
    }
  },
  data() {
    return{}
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
/*@import '~vux/src/styles/1px.less';*/
/*@import '~vux/src/styles/tap.less';*/

body,html{width:100%;height:100%;overflow-x: hidden;}
#app{width: 100%;height: 100%;background: #f3f4f6;}

.router-view {width: 100%;height: 100%;}
.vux-pop-out-enter-active,.vux-pop-out-leave-active,.vux-pop-in-enter-active,.vux-pop-in-leave-active {
  will-change: transform;transition: all 500ms;
  height: 100%;position: absolute;
  backface-visibility: hidden;perspective: 1000;
}
.vux-pop-out-enter {opacity: 0;transform: translate3d(-100%, 0, 0);}
.vux-pop-out-leave-active {opacity: 0;transform: translate3d(100%, 0, 0);}
.vux-pop-in-enter {opacity: 0;transform: translate3d(100%, 0, 0);}
.vux-pop-in-leave-active {opacity: 0;transform: translate3d(-100%, 0, 0);}

#app .vux-header{background-color:#37a1f8;}
#app .vux-header .vux-header-left .left-arrow:before{border:1px solid rgb(255, 255, 255);border-width: 2px 0 0 2px;width: 8px;height: 8px;top:10px;}

.head-pt{padding-top:46px;background: #f3f4f6;}

.weui-label{padding-right:20px;}

.is-danger .weui-label{color:#ff5e5e;}
</style>