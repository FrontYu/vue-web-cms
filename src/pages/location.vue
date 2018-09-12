<template>
  <div>

    <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100;"
    :title="showTitle ? $t('new store') : $t('edit')"
    :left-options="{backText: '', showBack: true}">

      <span slot="right" @click="resLatlng">
        <x-icon type="ios-checkmark-empty" size="40" style="fill:#fff;position:relative;top:-10px;right:-8px;"></x-icon>
      </span>

    </x-header>

    <div class="head-pt">
      <div class="location-cover">
        <simple-cropper :initParam="uploadParam" :successCallback="uploadRes" :croppedCallback="croppedRes" ref="cropper">
          <div class="upload-head" @click="upload" v-lazy:background-image="dataImg"></div>
        </simple-cropper>
      </div>
      <group class="location-input">
        <x-input :title="$t('name')" :placeholder="$t('location name')" placeholder-align="right" text-align="right" v-model="name" v-validate.initial="'required'" :class="{'is-danger': errors_val.has('location-name')}" name="location-name"></x-input>
        <cell :title="$t('category')">
          <p @click="openCategory = true" v-text="category ? categoryLst[category-1].value : categoryLst[0].value" style="min-width: 100px;font-size:14px;"></p>
        </cell>
        <popup-picker :title="$t('region')" :data="regionLst" :columns="2" v-model="region" ref="regionText" show-name></popup-picker>
        <x-textarea :title="$t('address')" v-model="address" :rows="1" autosize class="address-input"></x-textarea>
        <x-input :title="$t('telephone number')" :placeholder="$t('telephone number')" placeholder-align="right" text-align="right" v-model="phone"></x-input>

        <popup-picker :title="$t('currency')" :data="currencyLst" v-model="currencyVal" @on-change="changeCurrency"></popup-picker>
        <x-input type="number" :title="$t('mini consume')" :placeholder="$t('price')" placeholder-align="right" text-align="right" v-model="price" v-validate.initial="'numeric'" :class="{'is-danger': errors_val.has('location-price')}" name="location-price"></x-input>

      </group>


    </div>

    <popup v-model="openCategory">
      <popup-header
      :left-text="$t('cancel')"
      :right-text="$t('done')"
      :title="$t('category')"
      :show-bottom-border="false"
      @on-click-left="openCategory = false"
      @on-click-right="openCategory = false"></popup-header>
      <group gutter="0">
        <radio v-model="category" :options="categoryLst"></radio>
      </group>
    </popup>

    <popup v-model="errPoint" position="bottom">
      <div class="err-point" v-text="errText"></div>
    </popup>


    <region ref="region"></region>

  </div>
</template>

<script>
import { XHeader, Group, Cell, XInput, XTextarea, XSwitch, PopupHeader, Popup, Radio, PopupPicker } from 'vux'
import Region from '@/components/region'
import SimpleCropper from '@/components/imgFile'


import geolocator from 'geolocator'
geolocator.config({
  language: 'en',
  google: {
    version: '3',
    key: 'AIzaSyBiLIJHwDEBr74ImC2tlXN_gJbdRpKbiJo'
  }
});

export default {
  name: 'location',
  components: {
    XHeader,
    Group,
    Cell,
    XInput,
    XTextarea,
    XSwitch,
    PopupHeader,
    Popup,
    Radio,
    PopupPicker,
    Region,
    SimpleCropper
  },
  created() {
    this.loadData()
  },
  mounted() {
    this.regionLst = this.$refs.region.regionLst
  },
  methods: {
    loadData() {
      this.location_id = this.$route.query.location_id
      if (this.location_id) {
        this.showTitle = false
        this.getLocation()
      }else{
        this.showTitle = true
      }
    },
    getLocation() {
      this.$ajax.post('/merchant/location/get', {
        location_id: this.$route.query.location_id
      })
      .then((res) => {
        console.log(res)
        this.location = res.data.data.location
        this.photo = this.location.photo
        this.dataImg = this.photo
        this.name = this.location.name

        let city
        for (let i in this.regionLst){
          if(parseInt(this.regionLst[i].value) === parseInt(this.location.region)){
            city = this.regionLst[i].parent
          }
        }
        this.region = [city, this.location.region.toString()]
        this.address = this.location.address
        this.phone = this.location.phone
        this.category = this.location.category
        this.price = this.location.price
        this.currency = this.location.currency
        this.currencyVal = [this.currency]
        this.markers = {
          lat: this.location.latitude,
          lng: this.location.longitude
        }

      })
      .catch((err) => {
        console.log(err)
      })
    },
    changeCurrency(val){
      this.currency = val[0]
    },
    resLatlng() {
      if (this.name == ''){
        this.errPoint = true
        this.errText = this.$t('store name can not be empty')
        return false
      }
      this.$vux.loading.show({text: this.$t('loading')})
      let searchAddress = this.$refs.regionText&&this.$refs.regionText.getNameValues() + this.address
      geolocator.geocode(searchAddress, (err, location) => {
        console.log(err || location)
        if (err){
          this.$vux.loading.hide()
          this.errPoint = true

          if(err.code == "NOT_FOUND"){
            this.errText = this.$t('no found')+':'+searchAddress
          }else{
            this.errPoint = true
            this.errText = this.$t('not connected to google maps services')
          }
        }else{
          this.latitude = location.coords.latitude
          this.longitude = location.coords.longitude
          let options = {
            latitude : this.latitude,
            longitude : this.longitude
          }
          geolocator.getTimeZone(options, (err, timezone) => {
            console.log(err || timezone)
            if (err){
              this.errPoint = true
              this.errText = err
            }else{
              this.time_zone = parseInt(timezone.rawOffset) / 60
              this.saveLocation()
            }
          })
        }
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
    saveLocation() {
      this.$vux.loading.show({text: this.$t('loading')})
      this.postData = {
        name: this.name,
        latitude: this.latitude,
        longitude: this.longitude,
        region: this.region[1],
        address: this.address,
        time_zone: this.time_zone,
        category: this.category,
        phone: this.phone,
        currency: this.currency,
        price: this.price
      }
      if(this.$refs['cropper'].cacheImgMd5){
        this.$refs['cropper'].getUrl(this.$refs['cropper'].cacheImgMd5)
      }else{
        this.postSettings()
      }
    },
    postSettings() {
      console.log(this.postData)
      if(this.location_id){
        this.postData.location_id = this.location_id
        this.$ajax.post('/merchant/location/update', this.postData)
        .then((res) => {
          console.log(res)
          this.$vux.loading.hide()
          if(res.data.code === 0){
            this.$vux.toast.show({text: this.$t('success')})
            this.$router.push({
              path: '/merchant/'+this.$route.params.system+'/locations',
              query: {'location_id': this.$route.query.location_id}
            })
          }else{
            this.errPoint = true
            this.errText = this.$t('error.code.'+res.data.code)
          }
        })
        .catch((err) => {
          this.$vux.loading.hide()
          this.$vux.toast.show({text: this.$t('fail'), type: "warn"})
          console.log(err)
        })
      }else{
        this.$ajax.post('/merchant/location/create', this.postData)
        .then((res) => {
          console.log(res)
          this.$vux.loading.hide()
          if (res.data.code === 0){
            this.$vux.toast.show({text: this.$t('success')})
            this.$router.push({
              path: '/merchant/'+this.$route.params.system+'/home'
            })
          }else{
            this.$vux.toast.show({text: this.$t('fail'), type: "warn"})
          }

        })
        .catch((err) => {
          this.$vux.loading.hide()
          this.$vux.toast.show({text: this.$t('fail'), type: "warn"})
          console.log(err)
        })
      }

    }
  },
  data() {
    return {
      errPoint: false,
      errText: '',
      showTitle: true,
      postData: {},
      dataImg: require('@/assets/images/img-error.jpg'),
      uploadParam: {
        scale: 4  // 相对手机屏幕放大的倍数: 4倍
      },
      time_zone: '',
      location: {},
      location_id: '',
      latitude: '',
      longitude: '',
      photo: '',
      name: '',
      address: '',
      phone: '',
      category: 1,
      openCategory: false,
      categoryLst: [{key: '1', value: this.$t('restaurant')}, {key: '2', value: this.$t('bar')}, {key: '3', value: this.$t('coffee')}],
      region: ['HK', '1'],
      regionLst: [],
      currency: '',
      price: '',
      currencyVal: ['HKD'],
      currencyLst: [['HKD', 'MOP', 'TWD', 'CNY', 'JPY', 'PHP', 'RM', 'SGD', 'INR', 'EUR', 'ISK', 'DKK', 'SUR', 'GBP', 'FRF', 'ESP', 'CAD', 'USD', 'AUD']]
    }
  }
}
</script>

<style>
.location-input input[type='text']{font-size: 14px;}
.location-input label.weui-label,.location-input label.vux-label{font-size: 14px;}
.location-input .vux-popup-picker-value,.location-input .vux-popup-picker-placeholder{font-size: 14px;}
</style>

<style scoped>
.location-cover{margin:2rem auto 0;text-align: center; }
.location-cover img{width:100px;height:100px;}
.address-input{font-size: 14px;color:#333;}

.upload-head{width: 260px;height:150px;overflow:hidden;border: 2px solid #fff;overflow:hidden;background-position: center center;background-repeat: no-repeat;-webkit-background-size:cover;-moz-background-size:cover;background-size:cover;margin:0 auto;}
</style>