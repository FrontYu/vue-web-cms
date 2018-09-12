<template>
  <div>
    <div class="location-head" style="padding-top:20px;padding-bottom:15px;">
      <div class="flex-box">
        <div class="location-img" v-lazy:background-image="getImage(location.photo)"></div>
        <div class="location-mes">
          <rater v-model="location.rate" active-color="#ff3333" :font-size="18" disabled></rater>
          <span class="comment-num">( {{ location.rate_total_nums }} )</span>
          <h4 class="location-address" v-text="getAddress(location.region, location.address)"></h4>
          <region ref="region"></region>
          <p class="location-phone" v-text="location.phone ? location.phone : $t('null')"></p>
          <p class="location-price">
            <span class="location-currency" v-text="location.currency"></span>
            <span v-text="location.price"></span>
          </p>
        </div>
      </div>
      <ul class="location-manage" v-if="userLevel(5)">
        <li><router-link :to="{ path: '/merchant/'+$route.params.system+'/staffs', query: {location_id: location.id} }"><div class="staffs-btn"></div></router-link></li>
        <li><router-link :to="{ path: '/merchant/'+$route.params.system+'/location', query: {location_id: location.id} }"><div class="location-edit"></div></router-link></li>
      </ul>
    </div>

    <div class="scroll-box">
      <router-link :to="{ path: '/merchant/'+$route.params.system+'/coupons', query:{ location_id: location.id }}">
        <group>
          <cell is-link>
            <span slot="title"  class="coupon-bar">
              <span>{{ $t('coupon') }}</span><!-- <span class="coupon-tips">({{ $t('coupon redeem at') }} :$ {{ location.price }})</span> -->
            </span>
          </cell>
        </group>
      </router-link>

      <flexbox :gutter="0" wrap="wrap" style="margin-top:8px;">
        <flexbox-item :span="1/2"  v-for="coupon in location.coupons" :key="coupon.id">
          <div class="coupon-bg" v-lazy:background-image="getImage(coupon.photo)">
            <div :class="[couponBg, gradeClass[coupon.grade-1]]">
              <i class="icon"></i>
              x1
            </div>
            <div class="coupon-name">{{ coupon.name }}</div>
          </div>
        </flexbox-item>
      </flexbox>

    </div>

    <div class="scroll-box">
      <router-link :to="{ path: '/merchant/'+$route.params.system+'/dishes', query:{ location_id: location.id }}">
        <group>
          <cell is-link>
            <span slot="title" class="dishes-bar">
              <span>{{ $t('top dishes') }}</span>
            </span>
          </cell>
        </group>
      </router-link>
      <scroller lock-y scrollbar-x>
        <div :style="{'width':disheWidth+'px'}" style="margin-top:8px;">
          <div v-for="dish in location.dishes" :key="dish.id" v-if="dish.is_top_dish">
            <div class="box-size">
              <div class="banner-bg" v-lazy:background-image="getImage(dish.photo)"></div>
              <p>{{ dish.name }}</p>
            </div>
          </div>
        </div>
      </scroller>
    </div>

    <div class="scroll-box">
      <router-link :to="{ path: '/merchant/'+$route.params.system+'/comment', query:{ location_id: location.id }}">
        <group>
          <cell is-link>
            <span slot="title" class="comment-bar">
              <span>{{ $t('comment') }}</span>
            </span>
          </cell>
        </group>
      </router-link>
      <div style="padding-top:8px;"></div>
      <ul class="comments-lst" v-for="comment in location.comments" :key="comment.id">
        <li class="comment">
          <div class="location-head">
            <div class="flex-box">
              <div class="comment-img" v-lazy:background-image="getImage(comment.guest_photo)"></div>
              <div class="location-mes">
                <h6 class="comment-time" v-text="timeFormat(comment.comment_at)"></h6>
                <h5>{{ comment.guest_name }}</h5>
                <rater v-model="comment.rate" active-color="#ff3333" :font-size="18" disabled></rater>
                <p class="comment-text">{{ comment.comment }}</p>
                <p class="comment-images">
                  <flexbox :gutter="0" wrap="wrap">
                    <flexbox-item :span="1/4" v-for="(img, ind) in comment.comment_images" :key="ind">
                      <div class="guest-comment-img" v-lazy:background-image="getImage(img.photo)"></div>
                    </flexbox-item>
                  </flexbox>
                </p>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <popup v-model="scanLst" position="bottom" max-height="75%">
      <group>
        <cell v-for="coupon in location.coupons" :key="coupon.id" @click.native="qr(coupon.id)" v-if="showCouponLst(coupon)">
          <div class="coupon-image" slot="icon" v-lazy:background-image="getImage(coupon.photo)"></div>
          <div class="scan-title">{{ coupon.name }}</div>
          <div :class="[ScancouponBg, gradeClass[coupon.grade-1]]">
            <i class="icon"></i>
            x{{ coupon.coupons }}
          </div>
          <span v-if="coupon.restriction === 1 ? true : false" class="coupon-use">{{ coupon.count_redemption }}/{{ coupon.total_redemption }}</span>
          <span v-if="coupon.restriction === 2 ? true : false" class="coupon-time">{{ coupon.opening.split('.')[0] }}-{{ coupon.closing.split('.')[0] }}</span>
          <span v-if="coupon.restriction === 3 ? true : false" class="coupon-time">{{ coupon.start_date.replace(/-/g,'.') }}-{{ coupon.expiration_date.replace(/-/g,'.') }}</span>
        </cell>
      </group>
    </popup>

    <popup v-model="scanRes" height="100%">
      <div class="white-bg">

        <div v-if="scanSuccess" class="scan-success">
          <div class="bg">
            <div class="icon-suc"></div>
          </div>
          <div class="scan-mes">
            <p class="title">{{ $t('success') }}!</p>

            <x-table class="scan-table" :cell-bordered="false" :content-bordered="false" style="margin:1rem 0;">
              <thead>
                <tr>
                  <th>{{ $t('name') }}:</th>
                  <th>{{ $t('time') }}:</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ scanLstData.guest_name }}</td>
                  <td v-text="timeFormat(scanLstData.used_at)"></td>
                </tr>
              </tbody>
            </x-table>

            <x-table class="scan-table" :cell-bordered="false" :content-bordered="false">
              <thead>
                <tr>
                  <th>{{ $t('token type') }}:</th>
                  <th>{{ $t('dish') }}:</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td :class="[gradeClass[scanLstData.grade-1]]"><i class="icon"></i>x{{ scanLstData.coupons }}</td>
                  <td>{{ scanLstData.dish_name }}</td>
                </tr>
              </tbody>
            </x-table>

            <div class="close-suc" @click="scanRes = false">{{ $t('next scan') }}</div>

          </div>
        </div>

        <div v-else class="scan-error">
          <div class="bg">
            <div class="icon-err"></div>
          </div>
          <div class="scan-mes">
            <p class="title">{{ $t('something gets wrong') }}</p>
            <p class="tips">{{ $t('fail reason') }}:</p>
            <p class="text">error code: {{ $t('error.code.'+scanErrCode) }}</p>
            <div class="close-err" @click="scanRes = false">{{ $t('ok') }}</div>
          </div>
        </div>

      </div>
    </popup>

  </div>
</template>

<script>
import { Group, Cell, Scroller, Rater, Flexbox, FlexboxItem, Popup, XTable } from 'vux'
import Region from '@/components/region'
import Profile from '@/components/profile'

export default {
  name: 'locationlist',
  components: {
    Group,
    Cell,
    Scroller,
    Rater,
    Flexbox,
    FlexboxItem,
    Popup,
    XTable,
    Region,
    Profile
  },
  created() {
    this.getUserType()
    this.nowtoday()
  },
  mounted() {
    this.regionLst = this.$refs.region.regionLst
  },
  computed: {
    bannerWidth() {
      return this.location.banners ? 130*this.location.banners.length+10 : ''
    },
    disheWidth() {
      return this.location.dishes ? 130*this.location.dishes.length+10 : ''
    },
    couponWidth() {
      return this.location.coupons ? 130*this.location.coupons.length+10 : ''
    }
  },
  methods: {
    userLevel(num) {
      let userT = this.$store.state.userType
      if (userT >= num && userT != 0 ){
        return true
      }else{
        return false
      }
    },
    getUserType() {
      let userT = this.$store.state.userType
      if (userT === 3 || userT === 5){
        this.locations[0] ? this.loadData(this.locations[0].id) : ''
      }else{
        this.loadData(this.$route.query.location_id)
      }
    },
    loadData(id) {
      this.$ajax.post('/merchant/location/get', {
        location_id: id
      })
      .then((res) => {
        console.log(res)
        this.location = res.data.data.location
      })
      .catch((err) => {
        console.log(err)
      })
    },
    goUrl() {
      this.$router.push({
        path: '/merchant/'+this.$route.params.system+'/home',
      })
    },
    timeFormat(strtime) {
      // let date = new Date(strtime.replace(/\-/g, '/'))
      // return date.toLocaleDateString()
      let dateString = strtime.replace(/\-/g, '\/')
      return dateString.split(' ')[0]+" "+dateString.split(' ')[1].split('.')[0]
    },
    getAddress(regionCode, address) {
      let city, region
      if (regionCode){
        for (let i in this.regionLst){
          if(parseInt(this.regionLst[i].value) === parseInt(regionCode)){
            region = this.regionLst[i].name
            city = this.regionLst[i].parent
            for (let j in this.regionLst){
              if(this.regionLst[j].value === city){
                return this.regionLst[j].name +''+ region+''+address
              }
            }
          }
        }

      }
    },
    nowtoday() {
      let today = new Date()
      let todayArr = today.toJSON().split('T')
      this.nowday = parseInt(todayArr[0].replace(/\-/g, ''))
      // let nowTime = parseInt(todayArr[1].split('.')[0].replace(/\:/g, ''))
      let hh = today.getHours() < 10 ? '0'+today.getHours() : today.getHours()
      let mm = today.getMinutes() < 10 ? '0'+today.getMinutes() : today.getMinutes()
      this.nowTime = parseInt(hh+''+mm+'00')
    },
    showCouponLst(coupon) {
      switch (coupon.restriction) {
        case 1:
          return coupon.count_redemption == coupon.total_redemption ? false : true
          break
        case 2:
          if (this.nowTime >= parseInt(coupon.opening.split('.')[0].replace(/\:/g, '')) && this.nowTime <= parseInt(coupon.closing.split('.')[0].replace(/\:/g, ''))){
            return true
          }else{
            return false
          }
          break
        case 3:
          if (this.nowday >= parseInt(coupon.start_date.replace(/-/g, '')) && this.nowday <= parseInt(coupon.expiration_date.replace(/-/g, ''))){
            return true
          }else{
            return false
          }
          break
      }
    },
    showQrLst() {
      this.scanLst = true
    },
    qr(id) {
      window.onScanDone = (str) => {
        this.$vux.loading.show({text: this.$t('loading')})

        let postData = {
          coupon_id: id,
          sn: str
        }
        this.qrQuest(postData)
      }
      window.setScanDone = (str) => {}
      if (window.webkit){
        window.webkit.messageHandlers.MessageSignal.postMessage('qrcode')
      }else{
        this.scanErrCode = 'browser'
        this.scanRes = true
        this.scanSuccess = false

        // test
        // let postData = {
        //   coupon_id: id,
        //   sn: "123456789012345"
        // }
        // this.qrQuest(postData)
      }

    },
    qrQuest(postData) {
      this.$ajax.post('/merchant/coupon/use', postData)
      .then((res) => {
        console.log(res)
        this.$vux.loading.hide()
        if (res.data.code === 0){
          this.scanRes = true
          this.scanSuccess = true
          this.scanLstData = res.data.data.coupon
        }else{
          this.scanRes = true
          this.scanSuccess = false
          this.scanErrCode = res.data.code
        }
      })
      .catch((err) => {
        this.$vux.loading.hide()
        this.$vux.toast.show({text: this.$t('fail'), type: "warn"})
        console.log(err)
      })
    }
  },
  watch: {
    '$store.state.merchantData': function(val) {
      this.locations = val.locations
      this.getUserType()
    }
  },
  data () {
    return {
      drawerVisibility: false,
      locations: this.$store.state.merchantData.locations,
      location: {},
      scanLstData: {},
      regionLst: [],
      scanLst: false,
      scanRes: false,
      scanSuccess: false,
      scanErrCode: '',
      nowday: '',
      nowTime: '',
      couponBg: 'grade-icon',
      ScancouponBg: 'grade-scan-icon',
      gradeClass: ['grade1', 'grade2', 'grade3', 'grade4']
    }
  }
}
</script>

<style scoped>
.location-head{position: relative;padding:0 15px;background: #fff;}
.flex-box{
  display: -webkit-box;display: -webkit-flex;display: flex;
  -webkit-box-align:flex-start;-webkit-align-items: flex-start;align-items: flex-start;
}
.location-img{margin-right: .8em;width: 110px;height: 110px;background-position: center center;background-repeat: no-repeat;-webkit-background-size:cover;-moz-background-size:cover;background-size:cover;}
.location-mes{-webkit-box-flex: 1; -webkit-flex: 1; flex: 1; min-width: 0;}
.location-address{font-weight: 400; font-size: 12px; width: auto; overflow: hidden; text-overflow: ellipsis; white-space: unset; word-wrap: normal; word-wrap: break-word; word-break: break-all; margin-bottom: 8px;padding-left:20px;background-image: url(../assets/images/icon-gray-location.png);background-position: 0px 4px;;background-repeat: no-repeat;background-size: 14px 18px;}
.location-phone{color: #999; font-size: 13px; line-height: 18px;height: 18px;padding-left: 20px;background-image: url(../assets/images/icon-phone.png);background-position:left;background-repeat: no-repeat;background-size: 14px 18px;}
.location-price{padding-left: 20px;background-image: url(../assets/images/icon-price.png);background-position:left;background-repeat: no-repeat;background-size: 15px 15px;}
.location-manage{padding:15px 5px 5px;font-size: 13px; color: #cecece; line-height: 1em; list-style: none; overflow: hidden;}
.location-manage li{float: left; padding-right: 1em;}

.staffs-btn{width: 30px;height: 30px;background-image: url(../assets/images/icon-staffs.png);background-size: 60%;background-position: center;background-repeat: no-repeat;border-radius: 50%;overflow: hidden;box-shadow: 0px 0px 11px 0 rgb(88, 180, 255);}
.location-edit{width: 30px;height: 30px;background-image: url(../assets/images/icon-edit.png);background-size: 50%;background-position: center;background-repeat: no-repeat;border-radius: 50%;overflow: hidden;box-shadow: 0px 0px 11px 0 rgb(88, 180, 255);}

.box-size{margin-left:10px;width: 120px;overflow: hidden;float:left}
.box-size p{font-weight: 400; font-size: 17px; width: auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; word-wrap: normal; word-wrap: break-word; word-break: break-all; margin-bottom: 8px;}

.scroll-box{background:#fff;padding-bottom: 20px;}
.img-scroll{width: 100%;overflow:scroll;-webkit-overflow-scrolling:touch;}
.img-scroll ul{overflow: auto;padding: 0 5px;}
.img-scroll li{list-style: none;display: inline-block;margin:0 5px;width: 120px;overflow: hidden;}
.img-scroll li p{font-weight: 400; font-size: 17px; width: auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; word-wrap: normal; word-wrap: break-word; word-break: break-all; margin-bottom: 8px;}
.banner-bg{width: 120px;height: 90px;background-position: center center;background-repeat: no-repeat;-webkit-background-size:cover;-moz-background-size:cover;background-size:cover;}

.coupon-bg{margin: 0 10px 15px;height: 120px; background-position: center center; background-repeat: no-repeat; background-size: cover;overflow: hidden;position: relative;}
.coupon-name{position: absolute;z-index: 2;bottom: 0;left:0;width: 100%;background-color:rgba(0, 0, 0, 0.2);color: #fff; text-indent: 5px; height: 25px;line-height: 25px;font-size: 13px;}
.grade-icon{position: absolute;z-index: 3;right: 5px;top:5px;width: 60px;height: 25px;text-align: center;border-radius: 25px;color: #fff;}
.grade-icon .icon{background-position: left;background-repeat: no-repeat;background-size: auto 20px;display: inline-block;width: 20px;height: 20px;vertical-align: text-bottom;}
.coupon-bg .grade1 {background-color: rgba(249, 134, 30,  .3)}
.coupon-bg .grade2 {background-color: rgba(171, 197, 211, .8)}
.coupon-bg .grade3 {background-color: rgba(250, 191, 23,  .3)}
.coupon-bg .grade4 {background-color: rgba(22, 168, 249,  .3)}
.grade1 .icon{background-image: url(../assets/images/icon-grade1.png);}
.grade2 .icon{background-image: url(../assets/images/icon-grade2.png);}
.grade3 .icon{background-image: url(../assets/images/icon-grade3.png);}
.grade4 .icon{background-image: url(../assets/images/icon-grade4.png);}

.comment-img{margin-right: .8em;width: 40px;height: 40px;border-radius:50%;background-position: center center;background-repeat: no-repeat;-webkit-background-size:cover;-moz-background-size:cover;background-size:cover;}
.comment-time{position: absolute;right: 10px;font-size: .7rem;font-weight: 400;color:#999;}
.comment-num{font-size: 13px;color: #999;}
.comment-text{font-size: 12px;}
.comment-images{margin-top:10px;}
.guest-comment-img{padding-top:100%;background-position: center center;background-repeat: no-repeat;-webkit-background-size:cover;-moz-background-size:cover;background-size:cover;margin:2px;}

.coupon-bar{color: #333;padding-left: 25px;background-image: url(../assets/images/icon-coupons.png);background-repeat: no-repeat;background-position: left;background-size: 20px auto;font-size: 14px;font-weight: bold;}
.dishes-bar{color: #333;padding-left: 25px;background-image: url(../assets/images/icon-topdishes.png);background-repeat: no-repeat;background-position: left;background-size: 16px auto;font-size: 14px;font-weight: bold;}
.comment-bar{color: #333;padding-left: 25px;background-image: url(../assets/images/icon-comments.png);background-repeat: no-repeat;background-position: left;background-size: 18px auto;font-size: 14px;font-weight: bold;}
.coupon-tips{font-size: 12px;color:#f26161;padding-left: 10px;font-weight: 500;}


.white-bg{background: #fff;height: 100%;position: relative;}
.scan-success .bg{width: 100%;height: 0;padding-bottom: 40%;background-image: url(../assets/images/scanning-bg-sucess.png);background-size: 100% auto;background-position:top center;background-repeat: no-repeat;position: relative;-webkit-background-size:cover;-moz-background-size:cover;background-size:cover;}
.icon-suc{width: 100px;height: 100px;border-radius:50%;position: absolute;z-index: 3;bottom: 0;left:50%;margin-left:-50px;background-image: url(../assets/images/scanning-pic-sucess.png);background-position: center;background-repeat: no-repeat;background-size: 100% 100%;}

.scan-error .bg{width: 100%;height: 0;padding-bottom: 40%;background-image: url(../assets/images/scanning-bg-fail.png);background-size: 100% auto;background-position:top center;background-repeat: no-repeat;position: relative;-webkit-background-size:cover;-moz-background-size:cover;background-size:cover;}
.icon-err{width: 100px;height: 100px;border-radius:50%;position: absolute;z-index: 3;bottom: 0;left:50%;margin-left:-50px;background-image: url(../assets/images/scanning-pic-fail.png);background-position: center;background-repeat: no-repeat;background-size: 100% 100%;}

.coupon-use{padding-left:23px;background-image: url(../assets/images/icon-use.png);background-size: 18px 18px;background-position:left;background-repeat: no-repeat;margin-left: 10px;}
.coupon-time{padding-left:23px;background-image: url(../assets/images/icon-time.png);background-size: 18px 18px;background-position:left;background-repeat: no-repeat;margin-left: 10px;}
.grade-scan-icon{margin-bottom: .5rem;}
.grade-scan-icon .icon{background-position: left;background-repeat: no-repeat;background-size: auto 20px;display: inline-block;width: 20px;height: 20px;vertical-align: text-bottom;}
.scan-title{color:#000;margin-bottom: .5rem;}

.scan-mes{padding:1rem;}
.scan-mes .title{text-align: center;font-size: 22px;}
.scan-mes .tips{font-size: 14px;color:#666;margin-top:20px;}

.close-suc{width: 80%;height: 40px;background-color: #39f;color:#fff;text-align: center;line-height: 40px;border-radius: 5px;position: absolute;z-index: 10;bottom: 2rem;left: 10%;}
.close-err{width: 80%;height: 40px;background-color: #FF3534;color:#fff;text-align: center;line-height: 40px;border-radius: 5px;position: absolute;z-index: 10;bottom: 2rem;left: 10%;}

.scan-table th{font-size: 14px;color:#666;}
.scan-table td{font-size: 13px;}
.scan-table td, .scan-table th{text-align: left;width: 50%;line-height: 25px;}
.scan-table.vux-table td:before, .scan-table.vux-table th:before{height:0;border-bottom:0;}
.scan-table.vux-table td:after, .scan-table.vux-table th:after{height:0;border-bottom:0;}
.scan-table.vux-table:after{height:0;border-top:0;}
.scan-table i.icon{background-position: left;background-repeat: no-repeat;background-size: auto 20px;display: inline-block;width: 20px;height: 20px;vertical-align: text-bottom;margin-right: 10px;}
.scan-table .grade1 .icon{background-image: url(../assets/images/icon-grade1.png);}
.scan-table .grade2 .icon{background-image: url(../assets/images/icon-grade2.png);}
.scan-table .grade3 .icon{background-image: url(../assets/images/icon-grade3.png);}
.scan-table .grade4 .icon{background-image: url(../assets/images/icon-grade4.png);}


.coupon-image{width: 120px;height: 90px;background-position: center center;background-repeat: no-repeat;-webkit-background-size:cover;-moz-background-size:cover;background-size:cover;}
</style>