<template>
  <div>

    <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100;"
    :title="$t('dish')"
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
      <group class="dish-input">
        <x-input text-align="right" :title="$t('name')" :placeholder="$t('dish name')" v-model="dishName" v-validate.initial="'required'" name="dish-name" :class="{'is-danger': errors_val.has('dish-name')}"></x-input>
        <!-- <x-input text-align="right" :title="$t('currency')" :placeholder="$t('currency')" v-model="currency"></x-input> -->
        <popup-picker :title="$t('currency')" :data="currencyLst" v-model="currencyVal" @on-change="changeCurrency"></popup-picker>
        <x-input text-align="right" :title="$t('price')" :placeholder="$t('unit price')" v-model="price"></x-input>
        <x-input text-align="right" :title="$t('description')" disabled></x-input>
        <x-textarea :max="200" autosize :rows="5" :cols="30" name="description" :placeholder="$t('say something here')" v-model="desc"></x-textarea>
      </group>

      <div class="edit-box">
        <div class="del" @click="showDelTips = true" v-show="hasDish">Delete</div>
        <x-button :disabled="errors_val.has('dish-name')" @click.native="saveDish" :class="{'save': true, 'disabled-btn': errors_val.has('dish-name')}" >
          <span>{{ $t('save') }}</span>
        </x-button>
      </div>
    </div>

    <div v-transfer-dom>
      <confirm
      v-model="showDelTips"
      :close-on-confirm="false"
      :confirm-text="$t('delete')"
      :cancel-text="$t('cancel')"
      @on-confirm="delDish">
        <p style="text-align:center;">{{ $t('are you sure') }}</p>
      </confirm>
    </div>

  </div>
</template>

<script>
import { XHeader, Group, XInput, XTextarea, Popup, XButton, PopupPicker, Confirm, TransferDomDirective as TransferDom } from 'vux'
import SimpleCropper from '@/components/imgFile'

export default {
  name: 'dish',
  directives: {
    TransferDom
  },
  components: {
    XHeader,
    Group,
    XInput,
    XTextarea,
    Popup,
    XButton,
    PopupPicker,
    Confirm,
    SimpleCropper
  },
  mounted() {
    this.dishId = this.$route.query.dish_id
    if (this.dishId) {
      this.getDish()
    }else{
      this.hasDish = false
    }
  },
  methods: {
    changeCurrency(val){
      this.currency = val[0]
    },
    getDish (){
      this.$ajax.post('/merchant/location/get', {
        location_id: this.$route.query.location_id
      })
      .then((res) => {
        console.log(res)
        let dishes = res.data.data.location.dishes
        dishes.forEach((dish) => {
          // test !=
          if (dish.id == this.dishId){
            this.hasDish = true
            this.dishId = dish.id
            this.dishName = dish.name
            this.currency = dish.currency
            this.currencyVal = [this.currency]
            // this.currencyVal[0] = this.currency
            this.price = dish.price
            this.desc = dish.desc
            this.photo = dish.photo
            this.dataImg = this.photo
            return
          }
        })
      })
      .catch((err) => {
        console.log(err)
      })
    },
    delDish() {
      this.$vux.loading.show({text: this.$t('loading')})
      this.$ajax.post('/merchant/dish/delete',{dish_id: this.dishId})
      .then((res) => {
        console.log(res)
        this.$vux.loading.hide()
        if(res.data.code === 0){
          this.$vux.toast.show({text: this.$t('success')})
          this.$router.push({
            path: '/merchant/'+this.$route.params.system+'/dishes',
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
    saveDish() {
      this.$vux.loading.show({text: this.$t('loading')})
      this.postData = {
        name: this.dishName,
        currency: this.currency,
        price: this.price,
        desc: this.desc,
        is_top_dish: this.is_top_dish
      }
      if(this.$refs['cropper'].cacheImgMd5){
        this.$refs['cropper'].getUrl(this.$refs['cropper'].cacheImgMd5)
      }else{
        this.postSettings()
      }
    },
    postSettings() {
      if(this.hasDish){
        this.postData.dish_id = this.dishId
        this.$ajax.post('/merchant/dish/update', this.postData)
        .then((res) => {
          console.log(res)
          this.$vux.loading.hide()
          if(res.data.code === 0){
            this.$vux.toast.show({text: this.$t('success')})
            this.$router.push({
              path: '/merchant/'+this.$route.params.system+'/dishes',
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
        this.postData.location_id = this.$route.query.location_id
        this.$ajax.post('/merchant/dish/create', this.postData)
        .then((res) => {
          console.log(res)
          this.$vux.loading.hide()
          if(res.data.code === 0){
            this.$vux.toast.show({text: this.$t('success')})
            this.$router.push({
              path: '/merchant/'+this.$route.params.system+'/dishes',
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
      hasDish: false,
      showDelTips: false,
      dishId: null,
      dishName: '',
      currency: '',
      price: '',
      desc: '',
      photo: '',
      is_top_dish: true,
      currencyVal: ['HKD'],
      currencyLst: [['HKD', 'MOP', 'TWD', 'CNY', 'JPY', 'PHP', 'RM', 'SGD', 'INR', 'EUR', 'ISK', 'DKK', 'SUR', 'GBP', 'FRF', 'ESP', 'CAD', 'USD', 'AUD']]
    }
  }
}
</script>

<style>
.dish-input input[type='text']{font-size: 14px;}
.dish-input label.weui-label,.dish-input label.vux-label{font-size: 14px;}
.dish-input .vux-popup-picker-value,.dish-input .vux-popup-picker-placeholder{font-size: 14px;}
</style>

<style scoped>
.upload-header-img{text-align: center;margin:2rem auto 0;}
.edit-box{text-align: center;padding:10px 0;}
.edit-box .del{display: inline-block;width: 40%;height: 46px;line-height:46px;background: #ff3333;color:#fff;border-radius: 8px;margin:0 4%;}
.edit-box .save{display: inline-block;width: 40%;height: 46px;line-height:46px;background: #3399ff;color:#fff;border-radius: 8px;margin:0 4%;}
.disabled-btn{opacity: .5;}

.upload-head{width: 260px;height:150px;overflow:hidden;border: 2px solid #fff;overflow:hidden;background-position: center center;background-repeat: no-repeat;-webkit-background-size:cover;-moz-background-size:cover;background-size:cover;margin:0 auto;}
</style>
