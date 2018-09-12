<template>
  <div>

    <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100;"
    :title="$t('404')"
    :left-options="{backText: '', showBack: true}">

    </x-header>

    <div class="head-pt">
      <div class="blank-bg blank-404"></div>
      <p class="message-text" v-text="$t('404 no found')"></p>
    </div>


  </div>
</template>

<script>
import { XHeader } from 'vux'

export default {
  name: '404NoFound',
  components: {
    XHeader,
  },
  data () {
    return {}
  }
}
</script>

<style scoped>
.blank-bg{width: 100%;height:180px;margin-top:50px;background-repeat: no-repeat;background-position: center;background-size: auto 90%;}
.blank-404{background-image: url(../assets/images/blank-404.png);}
.message-text{font-size: 14px;color:#3399ff;text-align: center;width: 180px;margin:0 auto;}
</style>
