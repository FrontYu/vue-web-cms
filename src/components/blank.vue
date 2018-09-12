<template>
  <div>
    <div :class="['blank-bg', blankBgImage]"></div>
    <p class="message-text" v-text="showText()"></p>
  </div>
</template>

<script>

export default {
  name: 'blank',
  methods: {
    showText() {
      let text = ''
      switch(this.$route.path){
        case '/merchant/'+this.$route.params.system+'/home':
          this.blankBgImage = 'blank-home'
          text = this.home
          break;
        case '/merchant/'+this.$route.params.system+'/staffs':
          this.blankBgImage = 'blank-staffs'
          text = this.staffs
          break;
        case '/merchant/'+this.$route.params.system+'/dishes':
          this.blankBgImage = 'blank-dishes'
          text = this.dishes
          break;
        case '/merchant/'+this.$route.params.system+'/coupons':
          this.blankBgImage = 'blank-coupons'
          text = this.coupons
          break;
        case '/merchant/'+this.$route.params.system+'/comment':
          this.blankBgImage = 'blank-comment'
          text = this.comment
          break;
      }
      return text
    }
  },
  data() {
    return {
      blankBgImage: '',
      home: this.$t('have no stores yet'),
      staffs: this.$t('have no staff yet'),
      dishes: this.$t('have no dish yet'),
      coupons: this.$t('have no coupon yet'),
      comment: this.$t('have no comment yet'),
    }
  }
}
</script>

<style scoped>
.blank-bg{width: 100%;height:180px;margin-top:50px;background-repeat: no-repeat;background-position: center;background-size: auto 90%;}
.blank-home{background-image: url(../assets/images/blank-home.png);}
.blank-comment{background-image: url(../assets/images/blank-comment.png);}
.blank-coupons{background-image: url(../assets/images/blank-coupon.png);}
.blank-dishes{background-image: url(../assets/images/blank-dishes.png);}
.blank-staffs{background-image: url(../assets/images/blank-staffs.png);}
.message-text{font-size: 14px;color:#3399ff;text-align: center;width: 180px;margin:0 auto;}
</style>