<template>
  <div>

    <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100;"
    :title="$t('settings')"
    :left-options="{backText: '', showBack: true}">

      <span slot="right" @click="saveSettings">
        <x-icon type="ios-checkmark-empty" size="40" style="fill:#fff;position:relative;top:-10px;right:-8px;"></x-icon>
      </span>

    </x-header>

    <div class="head-pt">
      <div class="upload-header-img">

        <simple-cropper :initParam="uploadParam" :successCallback="uploadRes" :croppedCallback="croppedRes" ref="cropper">
          <div class="upload-head" @click="upload" v-lazy:background-image="dataImg"></div>
        </simple-cropper>

      </div>
      <group>
        <x-input :title="$t('name')" :placeholder="$t('enter your name')" novalidate placeholder-align="right" text-align="right" v-model="userName"></x-input>
      </group>
    </div>


  </div>
</template>

<script>
import { XHeader, Group, XInput } from 'vux'
import SimpleCropper from '@/components/imgFile'

export default {
  name: 'settings',
  components: {
    XHeader,
    Group,
    XInput,
    SimpleCropper
  },
  methods: {
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
    saveSettings(){
      this.$vux.loading.show({text: this.$t('loading')})
      this.postData = {
        name: this.userName,
      }
      if(this.$refs['cropper'].cacheImgMd5){
        this.$refs['cropper'].getUrl(this.$refs['cropper'].cacheImgMd5)
      }else{
        this.postSettings()
      }
    },
    postSettings() {
      this.$ajax.post('/merchant/profile', this.postData)
      .then((res) => {
        console.log(res)
        this.$vux.loading.hide()
        if(res.data.code === 0){
          this.merchant.name = this.postData.name
          this.postData.photo ? this.merchant.photo = this.postData.photo : ''
          this.$vux.toast.show({text: this.$t('success')})
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
  },
  watch: {
    '$store.state.merchantData': function(val) {
      this.merchant = val.merchant
      this.userName = val.merchant.name
      this.photo = val.merchant.photo
      this.dataImg = val.merchant.photo
    }
  },
  data () {
    return {
      merchant: this.$store.state.merchantData.merchant,
      userName: this.$store.state.merchantData.merchant.name,
      photo: this.$store.state.merchantData.merchant.photo,
      postData: {},
      dataImg: this.$store.state.merchantData.merchant.photo,
      uploadParam: {
        scale: 4  // 相对手机屏幕放大的倍数: 4倍
      }
    }
  }
}
</script>

<style scoped>
.upload-header-img{text-align: center;margin:2rem auto 0;}
.upload-head{width: 150px;height:150px;border-radius: 50%;overflow:hidden;border: 2px solid #fff;overflow:hidden;background-position: center center;background-repeat: no-repeat;-webkit-background-size:cover;-moz-background-size:cover;background-size:cover;margin:0 auto;}
</style>