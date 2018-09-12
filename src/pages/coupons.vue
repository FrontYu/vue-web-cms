<template>
  <div>

    <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100;"
    :title="$t('coupon management')"
    :left-options="{backText: '', showBack: true, preventGoBack: true}" @on-click-back="goUrl">

        <span slot="right">
          <router-link :to="{ path: '/merchant/'+$route.params.system+'/coupon', query:{ location_id: location.id }}">
            <x-icon type="ios-plus-empty" size="40"  style="fill:#fff;position:relative;top:-10px;right:-8px;"></x-icon>
          </router-link>
        </span>

    </x-header>

    <blank v-if="showBlank"></blank>

    <div class="head-pt">
      <div class="coupon-lst-padding">

        <div class="dish-lst" v-for="coupon in location.coupons" :key="coupon.id">
          <router-link :to="{ path: '/merchant/'+$route.params.system+'/coupon', query:{ location_id: location.id, coupon_id: coupon.id }}">

            <div :class="[couponBg,  gradeClass[coupon.grade-1]]">
              <div class="bottom-bg"></div>
              <div class="icon-circle">
                <i v-for="i in winWidth"></i>
              </div>

              <div class="contain-message">
                <div class="coupon-img" v-lazy:background-image="getImage(coupon.photo)"></div>
                <div class="coupon-mes">
                  <h4 class="coupon-name">{{ coupon.name }}</h4>
                  <div class="coupon-grade-bar">
                    <span class="coupon-number"><i class="icon-grade"></i>x{{ coupon.coupons }}</span>
                    <span v-if="coupon.restriction === 1 ? true : false" class="coupon-use"><i class="icon-use"></i>{{ coupon.count_redemption }}/{{ coupon.total_redemption }}</span>
                  </div>
                  <span v-if="coupon.restriction === 2 ? true : false" class="coupon-time"><i class="icon-time"></i>{{ coupon.opening.split('.')[0] }}-{{ coupon.closing.split('.')[0] }}</span>
                  <span v-if="coupon.restriction === 3 ? true : false" class="coupon-time"><i class="icon-time"></i>{{ coupon.start_date.replace(/-/g,'.') }}-{{ coupon.expiration_date.replace(/-/g,'.') }}</span>

                </div>
              </div>
            </div>

          </router-link>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { XHeader } from 'vux'
export default {
  components: {
    XHeader,
    'Blank': () => import('@/components/blank')
  },
  created() {
    this.loadData()
  },
  computed: {
    winWidth() {
      return Math.ceil(window.innerWidth / 16)
    }
  },
  methods: {
    loadData() {
      this.$ajax.post('/merchant/location/get', {
        location_id: this.$route.query.location_id
      })
      .then((res) => {
        console.log(res)
        this.location = res.data.data.location
        if (this.location.coupons.length == 0) {
          this.showBlank = true
        }
      })
      .catch((err) => {
        console.log(err)
      })
    },
    goUrl() {
      this.$router.push({
        path: '/merchant/'+this.$route.params.system+'/locations',
        query: {'location_id': this.$route.query.location_id}
      })
    }
  },
  data () {
    return {
      location: {},
      showBlank: false,
      couponBg: 'coupon-bg',
      gradeClass: ['grade1', 'grade2', 'grade3', 'grade4']
    }
  }
}
</script>

<style scoped>
.coupon-lst-padding{padding:20px 10px;}
.coupon-bg{width: 100%;height: 8rem;margin-bottom: 10px;border-radius: 8px;position: relative;overflow: hidden;}
.grade1{background:linear-gradient(90deg, #ff5e3a, #ff9500);}
.grade2{background:linear-gradient(90deg, #95adb1, #d0f0ff);}
.grade3{background:linear-gradient(90deg, #f79a0f, #ffde3f);}
.grade4{background:linear-gradient(90deg, #1d62f0, #19d5fd);}
.bottom-bg{background:#fff;width: 100%;position: absolute;bottom:0;height: 60%; }
.icon-circle{width: 100%;position: absolute;bottom:60%;z-index: 5;height: 14px;overflow: hidden;}
.icon-circle i{display:inline-block;width: 8px;height: 8px;background-color: #fff;margin-left: 8px;margin-bottom:0;border-radius: 50%;}

.grade1 .icon-grade{background-image: url(../assets/images/icon-grade1.png);}
.grade2 .icon-grade{background-image: url(../assets/images/icon-grade2.png);}
.grade3 .icon-grade{background-image: url(../assets/images/icon-grade3.png);}
.grade4 .icon-grade{background-image: url(../assets/images/icon-grade4.png);}
.icon-grade{display: inline-block;width: 20px;height: 20px;background-size: auto 100%;background-position: center;background-repeat: no-repeat;vertical-align: top;margin-right: 5px;}


.contain-message{position: absolute;z-index: 10;
  display: -webkit-box;display: -webkit-flex;display: flex;
  -webkit-box-align:flex-start;-webkit-align-items: flex-start;align-items: flex-start;
}

.coupon-img{width: 90px;height: 90px;background-position: center center;background-repeat: no-repeat;-webkit-background-size:cover;-moz-background-size:cover;background-size:cover;
  border-radius: 50%;
  border: 2px solid #fff;margin: 4% .8em 0;
}
.coupon-mes{-webkit-box-flex: 1; -webkit-flex: 1; flex: 1; min-width: 0;}
.coupon-name{color:#000;margin-top:10px;width:180px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap; word-wrap: normal; word-wrap: break-word; word-break: break-all;}
.coupon-grade-bar{margin-top:25px;}
.coupon-number{color:#000;padding-right: 20px;}
.coupon-use{color: #000;font-size: 13px;}
.coupon-use .icon-use{display: inline-block;width: 20px;height: 20px;background-size: auto 100%;background-position: center;background-repeat: no-repeat;vertical-align: top;margin-right: 5px;background-image: url(../assets/images/icon-use.png);}
.coupon-time{font-size: 12px;color:#000;margin-top: 10px;display: block;}
.coupon-time .icon-time{display: inline-block;width: 20px;height: 20px;background-size: auto 100%;background-position: center;background-repeat: no-repeat;vertical-align: top;margin-right: 5px;background-image: url(../assets/images/icon-time.png);}
</style>
