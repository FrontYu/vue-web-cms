<template>
  <div>
    <!-- <input type="file" @change="imgFile" ref="file"> -->

    <VueImgInputer
    placeholder="Upload Image"
    bottomText="Click edit Image1"
    :noMask="true"
    :nhe="true"
    theme="material"
    size="normal"
    accept="*"
    :capture="false"
    :onChange="imgMessage"
    :imgSrc="resImg"
    icon="img">

    </VueImgInputer>

  </div>
</template>

<script>
import browserMD5File from 'browser-md5-file'
import VueImgInputer from 'vue-img-inputer'

export default {
  name: 'fileMD5',
  components: {
    browserMD5File,
    VueImgInputer
  },
  mounted() {

  },
  computed: {
    resImg() {
      // clean old img
      this.$store.commit('UPLOAD_FILE', this.arr)
      // show use img
      return this.getImage(this.$store.state.fileImg)
    }
  },
  methods: {
    getImage(url) {
      if (url){
        return url.substring(0,url.lastIndexOf('.'))+'_s'+url.substring(url.lastIndexOf('.'))
      }
    },
    imgMessage(file, fileName) {
      let fileType = fileName.substring(fileName.lastIndexOf('.') + 1)
      browserMD5File(file, (err, md5) => {
        this.arr.fileName = md5+'.'+fileType
        // get file url
        this.$ajax.post('/merchant/file_url', {
          file_name: this.arr.fileName
        })
        .then((res) => {
          console.log(res)
          this.arr.fileUrl = res.data.data.file_url
          // head file
          this.$ajax.head(this.arr.fileUrl)
          .then((res) => {
            if(res.status == 200){
              this.arr.file = null
            }else{
              this.arr.file = file
            }
            this.$store.commit('UPLOAD_FILE', this.arr)
            console.log(this.$store.state.uploadFile)
          })
          .catch((err) => {
            this.arr.file = file
            this.$store.commit('UPLOAD_FILE', this.arr)
            console.log(this.$store.state.uploadFile)
            console.log(err.toString())
          })
        })

      })

    }
  },
  data() {
    return {
      resType: '',
      arr: []
    }
  }

}
</script>

<style>
.img-inputer__preview-img{/*top:50%;margin-top:-150px;*/object-fit: cover;object-position: center;height:150px;}
</style>