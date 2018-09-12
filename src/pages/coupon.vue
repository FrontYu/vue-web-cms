<template>
  <div>

    <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100;"
    :title="$t('coupon')"
    :left-options="{backText: '', showBack: true}">
      <!-- <span slot="right" @click="">
        <x-icon type="ios-checkmark-empty" size="40" style="fill:#fff;position:relative;top:-10px;right:-8px;"></x-icon>
      </span> -->
    </x-header>

    <div class="head-pt">
      <div class="upload-header-img">
        <simple-cropper :initParam="uploadParam" :successCallback="uploadRes" :croppedCallback="croppedRes" ref="cropper">
          <div class="upload-head" @click="upload" v-lazy:background-image="dataImg"></div>
        </simple-cropper>
      </div>
      <group class="coupon-input">
        <x-input :title="$t('dish name')" :placeholder="$t('dish name')" v-model="couponName" text-align="right" v-validate.initial="'required'" name="dish-name" :class="{'is-danger': errors_val.has('dish-name')}"></x-input>
        <cell title="coupon type" is-link>
          <p @click="openGrade = true" v-text="grade ? gradeLst[grade-1].value : gradeLst[0].value" style="min-width: 100px;font-size: 14px;"></p>
        </cell>

        <cell :title="$t('restrictions')" is-link>
          <p style="font-size: 14px;" @click="openRestriction = true" v-text="restriction ? restrictionLst[restriction-1].value : restrictionLst[0].value"></p>
        </cell>

        <x-number v-show="restriction == 1 ? true : false" style="font-size: 14px;" :value="total_redemption" :min="1" :title="$t('redemptions')" fillable v-model="total_redemption"></x-number>
        <div v-show="restriction == 2 ? true : false">
          <datetime style="font-size: 14px;" v-model="start_time" format="HH:mm:00" :title="$t('start time')" :confirm-text="$t('ok')" :cancel-text="$t('cancel')"></datetime>
          <datetime style="font-size: 14px;" v-model="expiration_time" format="HH:mm:00" :title="$t('expiration time')" :confirm-text="$t('ok')" :cancel-text="$t('cancel')"></datetime>
        </div>
        <div v-show="restriction == 3 ? true : false">
          <datetime style="font-size: 14px;" v-model="start_date" :title="$t('start date')" :confirm-text="$t('ok')" :cancel-text="$t('cancel')"></datetime>
          <datetime style="font-size: 14px;" v-model="expiration_date" :start-date="start_date" :title="$t('expiration date')" :confirm-text="$t('ok')" :cancel-text="$t('cancel')"></datetime>
        </div>

      </group>

      <div class="edit-box">
        <div class="del" @click="showDelTips = true" v-show="hasCoupon">{{ $t('delete') }}</div>
        <x-button :disabled="errors_val.has('dish-name')" @click.native="saveCoupon" :class="{'save': true, 'disabled-btn': errors_val.has('dish-name')}" >
          <span>{{ $t('save') }}</span>
        </x-button>
        <!-- <div class="save" @click="saveCoupon">Save</div> -->
      </div>
    </div>

    <popup v-model="openGrade">
      <popup-header
      :left-text="$t('cancel')"
      :right-text="$t('done')"
      :title="$t('coupon type')"
      :show-bottom-border="false"
      @on-click-left="openGrade = false"
      @on-click-right="openGrade = false"></popup-header>
      <group gutter="0">
        <radio v-model="grade" :options="gradeLst"></radio>
      </group>
    </popup>

    <popup v-model="openRestriction">
      <popup-header
      :left-text="$t('cancel')"
      :right-text="$t('done')"
      :title="$t('coupon type')"
      :show-bottom-border="false"
      @on-click-left="openRestriction = false"
      @on-click-right="openRestriction = false"></popup-header>
      <group gutter="0">
        <radio v-model="restriction" :options="restrictionLst"></radio>
      </group>
    </popup>

    <div v-transfer-dom>
      <confirm
      v-model="showDelTips"
      :close-on-confirm="false"
      :confirm-text="$t('delete')"
      :cancel-text="$t('cancel')"
      @on-confirm="delCoupon">
        <p style="text-align:center;">{{ $t('are you sure') }}</p>
      </confirm>
    </div>

  </div>
</template>

<script>
import { XHeader, Group, Cell, XInput, XNumber, PopupHeader, Popup, Radio, Datetime, XButton, Confirm, TransferDomDirective as TransferDom } from 'vux'
import SimpleCropper from '@/components/imgFile'

export default {
  name: 'coupon',
  directives: {
    TransferDom
  },
  components: {
    XHeader,
    Group,
    Cell,
    XInput,
    XNumber,
    PopupHeader,
    Popup,
    Radio,
    Datetime,
    XButton,
    Confirm,
    SimpleCropper
  },
  mounted() {
    this.couponId = this.$route.query.coupon_id
    if (this.couponId) {
      this.getCoupon()
    }else{
      this.hasCoupon = false
    }

  },
  methods: {
    getCoupon (){
      this.$ajax.post('/merchant/location/get', {
        location_id: this.$route.query.location_id
      })
      .then((res) => {
        console.log(res)
        let coupons = res.data.data.location.coupons
        coupons.forEach((coupon) => {
          // test !=
          if (coupon.id == this.couponId){
            this.hasCoupon = true
            this.couponId = coupon.id
            this.couponName = coupon.name
            this.photo = coupon.photo
            this.dataImg = this.photo
            this.grade = coupon.grade
            this.restriction = coupon.restriction
            this.total_redemption = coupon.total_redemption
            this.start_date = coupon.start_date
            this.expiration_date = coupon.expiration_date
            this.start_time = coupon.opening.split('.')[0]
            this.expiration_time = coupon.closing.split('.')[0]
            return
          }
        })
      })
      .catch((err) => {
        console.log(err)
      })
    },
    delCoupon() {
      this.$vux.loading.show({text: "loading"})
      this.$ajax.post('/merchant/coupon/delete',{coupon_id: this.couponId})
      .then((res) => {
        console.log(res)
        this.$vux.loading.hide()
        this.$vux.toast.show({text: this.$t('success')})
        this.$router.push({
          path: '/merchant/'+this.$route.params.system+'/coupons',
          query: { location_id: this.$route.query.location_id }
        })
      })
      .catch((err) => {
        this.$vux.loading.hide()
        this.$vux.toast.show({text: this.$t('fail'), type: "warn"})
        console.log(err)
      })
    },
    // input按钮
    upload () {
      this.$refs['cropper'].upload()
    },
    // 裁剪完成回调
    croppedRes(data) {
      this.dataImg = data
    },
    // 上传成功回调
    uploadRes (fileUrl) {
      console.log(fileUrl)
      this.postData.photo = fileUrl
      this.postSettings()
    },
    saveCoupon() {
      this.$vux.loading.show({text: this.$t('loading')})
      this.postData = {
        name: this.couponName,
        grade: this.grade,
        restriction: this.restriction,
        total_redemption: this.total_redemption,
        start_date: this.start_date,
        expiration_date: this.expiration_date,
        opening: this.start_time,
        closing: this.expiration_time
      }
      if(this.$refs['cropper'].cacheImgMd5){
        this.$refs['cropper'].getUrl(this.$refs['cropper'].cacheImgMd5)
      }else{
        this.postSettings()
      }
    },
    postSettings() {
      console.log(this.postData)
      if(this.hasCoupon){
        this.postData.coupon_id = this.couponId
        this.$ajax.post('/merchant/coupon/update', this.postData)
        .then((res) => {
          console.log(res)
          this.$vux.loading.hide()
          if (res.data.code === 0){
            this.$vux.toast.show({text: this.$t('success')})
            this.$router.push({
              path: '/merchant/'+this.$route.params.system+'/coupons',
              query: {'location_id': this.$route.query.location_id}
            })
          }else{
            this.errTips(res.data.code)
          }
        })
        .catch((err) => {
          this.$vux.loading.hide()
          this.$vux.toast.show({text: this.$t('fail'), type: "warn"})
          console.log(err)
        })
      }else{
        if(this.postData.photo){
          this.postData.location_id = this.$route.query.location_id
          this.$ajax.post('/merchant/coupon/create', this.postData)
          .then((res) => {
            console.log(res)
            this.$vux.loading.hide()
            if (res.data.code === 0){
              this.$vux.toast.show({text: this.$t('success')})
              this.$router.push({
                path: '/merchant/'+this.$route.params.system+'/coupons',
                query: { location_id: this.$route.query.location_id }
              })
            }else{
              this.errTips(res.data.code)
            }

          })
          .catch((err) => {
            this.$vux.loading.hide()
            this.$vux.toast.show({text: this.$t('fail'), type: "warn"})
            console.log(err)
          })
        }else{
          this.$vux.loading.hide()
          this.errTips('img')
        }

      }

    }
  },
  data () {
    return {
      postData: {},
      dataImg: require('@/assets/images/img-error.jpg'),
      uploadParam: {
        scale: 4  // 相对手机屏幕放大的倍数: 4倍
      },
      photo: '',
      openGrade: false,
      openRestriction: false,
      hasCoupon: false,
      showDelTips: false,
      couponId: null,
      couponName: '',
      grade: 1,
      restriction: 1,
      total_redemption: 1,
      start_date: '',
      expiration_date: '',
      start_time: '',
      expiration_time: '',
      gradeLst: [{key: '1', value: this.$t('copper')}, {key: '2', value: this.$t('silver')}, {key: '3', value: this.$t('gold')}, {key: '4', value: this.$t('diamond')}],
      restrictionLst: [{key: '1', value: this.$t('daily number of times')}, {key: '2', value: this.$t('time period')}, {key: '3', value: this.$t('date')}],
    }
  }
}
</script>

<style>
.coupon-input input[type='text']{font-size: 14px;}
.coupon-input label.weui-label,.coupon-input label.vux-label{font-size: 14px;}
.coupon-input .vux-popup-picker-value,.coupon-input .vux-popup-picker-placeholder{font-size: 14px;}
</style>


<style scoped>
.upload-header-img{text-align: center;margin:2rem auto 0;}
.edit-box{text-align: center;padding:10px 0;}
.edit-box .del{display: inline-block;width: 40%;height: 46px;line-height:46px;background: #ff3333;color:#fff;border-radius: 8px;margin:0 4%;}
.edit-box .save{display: inline-block;width: 40%;height: 46px;line-height:46px;background: #3399ff;color:#fff;border-radius: 8px;margin:0 4%;}
.disabled-btn{opacity: .5;}

.upload-head{width: 260px;height:150px;overflow:hidden;border: 2px solid #fff;overflow:hidden;background-position: center center;background-repeat: no-repeat;-webkit-background-size:cover;-moz-background-size:cover;background-size:cover;margin:0 auto;}
</style>
