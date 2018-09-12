<template>
  <div>

  </div>
</template>

<script>
export default {
  name: 'region',
  data() {
    return {
      regionLst: [
        {name: this.$t('香港'), value: 'HK', parent: 0 },
        {name: this.$t('中西区'), value: '1', parent: 'HK' },
        {name: this.$t('湾仔区'), value: '2', parent: 'HK' },
        {name: this.$t('东区'), value: '3', parent: 'HK' },
        {name: this.$t('南区'), value: '4', parent: 'HK' },
        {name: this.$t('油尖旺区'), value: '5', parent: 'HK' },
        {name: this.$t('深水埗区'), value: '6', parent: 'HK' },
        {name: this.$t('九龙城区'), value: '7', parent: 'HK' },
        {name: this.$t('黄大仙区'), value: '8', parent: 'HK' },
        {name: this.$t('观塘区'), value: '9', parent: 'HK' },
        {name: this.$t('葵青区'), value: '10', parent: 'HK' },
        {name: this.$t('荃湾区'), value: '11', parent: 'HK' },
        {name: this.$t('屯门区'), value: '12', parent: 'HK' },
        {name: this.$t('元朗区'), value: '13', parent: 'HK' },
        {name: this.$t('北区'), value: '14', parent: 'HK' },
        {name: this.$t('大浦区'), value: '15', parent: 'HK' },
        {name: this.$t('沙田区'), value: '16', parent: 'HK' },
        {name: this.$t('西贡区'), value: '17', parent: 'HK' },
        {name: this.$t('离岛区'), value: '18', parent: 'HK' },
        {name: this.$t('深圳'), value: 'SZ', parent: 0 },
        {name: this.$t('福田区'), value: '19', parent: 'SZ' },
        {name: this.$t('南山区'), value: '20', parent: 'SZ' },
        {name: this.$t('罗湖区'), value: '21', parent: 'SZ' },


      ]
    }
  }
}
</script>