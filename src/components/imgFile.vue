<template>
  <div class="v-simple-cropper">
    <slot>
      <button @click.native="upload"></button>
    </slot>
    <input class="file" ref="file" type="file" accept="image/*" @change="uploadChange">
    <div class="v-cropper-layer" ref="layer">
      <div class="layer-header">
        <button class="cancel" @click="cancelHandle">{{ $t('cancel') }}</button>
        <button class="confirm" @click="finsh">{{ $t('finsh') }}</button>
      </div>
      <div style="width:100%;height:300px;overflow:hidden;">
        <img ref="cropperImg" width="100%">
      </div>

      <button class="cat-button" @click="confirmHandle">{{ $t('cropped') }}</button>

      <flexbox :gutter="0" wrap="wrap">
        <flexbox-item :span="1/3">
            <div class="show-cache" :style="{'background-image': 'url('+cacheImg+')'}"></div>
        </flexbox-item>
        <flexbox-item :span="2/3">
            <div class="show-cache2" :style="{'background-image': 'url('+cacheImg+')'}"></div>
        </flexbox-item>
      </flexbox>


    </div>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem } from 'vux'
import md5 from 'js-md5'
import Cropper from 'cropperjs'

import 'cropperjs/dist/cropper.min.css'

export default {
  name: 'v-simple-cropper',
  props: {
    // 配置
    initParam: Object,
    // 裁剪完成回调
    croppedCallback: {
      type: Function,
      default: () => {}
    },
    // 上传成功回调
    successCallback: {
      type: Function,
      default: () => {}
    }
  },
  components: {
    Flexbox,
    FlexboxItem,
  },
  data () {
    return {
      cropper: {},
      cacheImg: '',
      cacheImgMd5: '',
      fileUrl: '',
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    // 初始化裁剪插件
    init () {
      let cropperImg = this.$refs['cropperImg']
      this.cropper = new Cropper(cropperImg, {
        aspectRatio: 4 / 3,
        dragMode: 'move',
        viewMode: 1,
        cropBoxMovable: true,
        cropBoxResizable: true
      })
    },
    // 点击上传按钮
    upload () {
      // ios系统需要双击才能唤出文件选项????
      this.$refs['file'].click()
      this.$refs['file'].click()
    },
    // 选择上传文件
    uploadChange (e) {
      let file = e.target.files[0]
      let URL = window.URL || window.webkitURL
      this.$refs['layer'].style.display = 'block'
      this.cropper.replace(URL.createObjectURL(file))
    },
    // 取消裁剪
    cancelHandle () {
      this.cropper.reset()
      this.$refs['layer'].style.display = 'none'
      this.$refs['file'].value = ''
    },
    // 确定裁剪
    confirmHandle () {
      let cropBox = this.cropper.getCropBoxData()
      let scale = this.initParam['scale'] || 1
      let cropCanvas = this.cropper.getCroppedCanvas({
        width: cropBox.width * scale,
        height: cropBox.height * scale
      })
      let imgData = cropCanvas.toDataURL('image/jpeg')
      this.cacheImg = imgData
      this.cacheImgMd5 = md5(imgData)+'.jpeg'
    },
    // base64转blob
    dataURLtoBlob(dataurl) {
      let arr = dataurl.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], {
        type: mime
      })
    },
    finsh() {
      this.croppedCallback(this.cacheImg)
      this.cancelHandle()
    },
    getUrl(fileMd5) {
      this.$ajax.post('/merchant/file_url', {
        file_name: fileMd5
      })
      .then((res) => {
        console.log(res)
        this.fileUrl = res.data.data.file_url
        this.headUrl(this.fileUrl)
      })
      .catch((err) => {
        this.$vux.loading.hide()
        this.$vux.toast.show({text: this.$t('fail'), type: "warn"})
        console.log(err)
      })
    },
    headUrl(fileUrl) {
      this.$ajax.head(fileUrl)
      .then((res) => {
        console.log(res)
        if(res.status == 200){
          this.successCallback(this.fileUrl)
        }else{
          // this.file = this.cacheImg
          this.uploadImg(this.cacheImg, this.cacheImgMd5)
        }
      })
      .catch((err) => {
        this.uploadImg(this.cacheImg, this.cacheImgMd5)
        console.log(err)
      })
    },
    uploadImg(file, fileName) {
      let fileObj = this.dataURLtoBlob(file)
      let formData = new FormData()
      formData.append('file', fileObj)
      formData.append('file_name', fileName)
      formData.append('weight', 336)
      formData.append('height', 280)
      let config = {
        responseType: 'json',
        headers: {'Content-Type': 'multipart/form-data'},
        transformRequest: [(data) => {return data}],
        // onUploadProgress: function (e) {
        //   console.log(e)
        //   let percentage = Math.round((e.loaded * 100) / e.total) || 0
        // }
      }
      this.$ajax.post('/merchant/file_upload', formData, config)
      .then((res) => {
        console.log(res)
        if(res.data.code === 0){
          this.successCallback(this.fileUrl)
        }
      })
      .catch((err) => {
        this.$vux.loading.hide()
        this.$vux.toast.show({text: this.$t('fail'), type: "warn"})
        console.log(err)
      })
    }
  }
}
</script>

<style lang="less">
.v-simple-cropper {
  .file {
    display: none;
  }
  .v-cropper-layer {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    z-index: 99999;
    height: 100%;
    overflow: auto;
    display: none;

    .layer-header {position: relative; top: 0; left: 0; z-index: 99999; background: #37a1f8; width: 100%; height: 46px; box-sizing: border-box; }
    .cancel,
    .confirm {line-height: 46px; font-size: .9rem; background: inherit; border: 0; outline: 0; float: left; padding:0 16px; color:#fff; }
    .confirm {float: right;}
    img {position: inherit!important; border-radius: inherit!important; float: inherit!important; }
    .cat-button{width:80%;height:40px;background: #37a1f8;line-height:40px;color:#fff;text-align:center;border: 0;outline: 0;margin: 1rem 0;}

    .show-cache{width: 90%;height: 0;padding-bottom: 90%;border:1px solid #37a1f8;overflow:hidden;background-position: center center;background-repeat: no-repeat;-webkit-background-size:cover;-moz-background-size:cover;background-size:cover;float: left;    border-radius: 50%;}
    .show-cache2{width: 95%;height: 0;padding-bottom: 75%;border:1px solid #37a1f8;overflow:hidden;background-position: center center;background-repeat: no-repeat;-webkit-background-size:cover;-moz-background-size:cover;background-size:cover;float: right;}

  }
}
</style>