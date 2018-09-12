<template>
  <div>

    <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100;"
    :title="$t('service')"
    :left-options="{backText: '', showBack: true}">

    </x-header>

    <div class="head-pt">
      <p>Development test demo</p>
    </div>


  </div>
</template>

<script>
import { XHeader } from 'vux'

export default {
  name: 'service',
  components: {
    XHeader,
  },
  data () {
    return {}
  }
}
</script>

<style scoped>

</style>
