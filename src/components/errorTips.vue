<template>
  <div>
    <popup v-model="$store.state.errorTips.show" position="bottom">
      <div class="err-point" v-text="text($store.state.errorTips.text)"></div>
    </popup>

  </div>
</template>

<script>
import { Popup } from 'vux'

export default {
  name: 'errortips',
  components: {
    Popup
  },
  methods: {
    text(code) {
      return this.$t('error.code.'+code)
    }
  },
  data () {
    return {}
  }
}
</script>

<style scoped>
.err-point{background-color:#3399ff;color: #fff; text-align: center; padding: 15px;}
</style>