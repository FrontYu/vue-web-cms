<template>
  <div>

    <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100;"
    :title="$t('comment')"
    :left-options="{backText: '', showBack: true, preventGoBack: true}" @on-click-back="goUrl">
    </x-header>

    <blank v-if="showBlank"></blank>

    <div class="head-pt">
      <div class="bg-white">
        <div class="chart-star"><span>Rating:</span> <rater v-model="averageStar" active-color="#ff3333" disabled></rater></div>
        <div id="canvas-charts" style="width:100%;height:160px;"></div>
      </div>


      <div class="scroll-box wrapper" ref="wrapper" :style="{'height':scrollHeight+'px'}">
        <ul class="comments-lst content">
          <li class="comment" v-for="(comment, index) in comments" :key="comment.id">
            <div class="location-head">
              <div class="flex-box">
                <div class="comment-img" v-lazy:background-image="getImage(comment.guest_photo)"></div>
                <div class="location-mes">
                  <h6 class="comment-time" v-text="timeFormat(comment.comment_at)"></h6>
                  <h5>{{ comment.guest_name }}</h5>
                  <rater v-model="comment.rate" active-color="#ff3333" disabled></rater>
                  <p :class="{commentText: index === activeIndex}" @click="activeIndex = index">{{ comment.comment }}</p>
                  <p class="comment-images">
                    <flexbox :gutter="0" wrap="wrap">
                      <flexbox-item :span="1/4" v-for="(img, ind) in comment.comment_images" :key="ind">
                        <div class="guest-comment-img" v-lazy:background-image="getImage(img.photo)" @click="showImage(comment.comment_images, ind)"></div>
                        <!-- <img class="guest-comment-img" width="100" :src="img.photo" @click="showImage(comment.comment_images, ind)"> -->
                      </flexbox-item>
                    </flexbox>
                  </p>

                  <p v-if="! comment.reply"><span v-if="userLevel(6)" class="reply-btn" @click="onReply(comment)">{{ $t('reply') }}</span></p>
                  <p v-if="comment.reply" class="reply-bar"><span class="reply-name">{{ comment.reply_name }}:</span> {{ comment.reply }}</p>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div class="load-box">
              <load-more :show-loading="hasPage" :tip="loadPageTip" v-show="isUp"></load-more>
            </div>
          </li>
        </ul>
      </div>

    </div>


    <div v-transfer-dom class="comment-layer">
      <x-dialog v-model="showMessage" class="dialog-demo">
        <h4 class="layer-name">{{ $t('reply') }}<x-icon type="ios-close-empty" size="35" color="#333" @click="showMessage=false"></x-icon></h4>
        <group>
          <x-textarea :max="200" :height="200" :rows="8" :cols="30" name="description" :placeholder="$t('say something here')" v-model="replyText"></x-textarea>
        </group>
        <div class="layer-btn-lst">
          <div class="layer-btn-save" @click="saveReply">{{ $t('save') }}</div>
        </div>
      </x-dialog>
    </div>

    <div v-transfer-dom>
      <previewer :list="imgLst" ref="previewer" :options="imgLstOptions"></previewer>
    </div>

  </div>
</template>

<script>
import { XHeader, Group, Rater, LoadMore, XDialog, XTextarea, Flexbox, FlexboxItem, Previewer, TransferDomDirective as TransferDom } from 'vux'

let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/pie')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')

import BScroll from 'better-scroll'

export default {
  directives: {
    TransferDom
  },
  components: {
    XHeader,
    Group,
    Rater,
    LoadMore,
    XDialog,
    XTextarea,
    Flexbox,
    FlexboxItem,
    Previewer,
    'Blank': () => import('@/components/blank')
  },
  created() {
    this.loadMerchant()
    this.$nextTick(() => {
      this.computedHeight()
      this._initScroll()
      this.loadData()
    })
  },
  mounted() {
    this.chartSVG().showLoading()
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
    computedHeight() {
      let winDom = document.getElementById('app')
      this.scrollHeight = winDom.clientHeight-266
    },
    loadMerchant() {
      this.$ajax.post('/merchant/location/get', {
        location_id: this.$route.query.location_id
      })
      .then((res) => {
        console.log(res)
        this.location = res.data.data.location
        this.star1 = this.location.rate1_nums
        this.star2 = this.location.rate2_nums
        this.star3 = this.location.rate3_nums
        this.star4 = this.location.rate4_nums
        this.star5 = this.location.rate5_nums
        this.averageStar = this.location.rate
        this.chartSVG().hideLoading()
      })
    },
    loadData() {
      this.$ajax.post('/merchant/location/comments', {
        location_id: this.$route.query.location_id,
        start: this.start,
        count: this.count
      })
      .then((res) => {
        console.log(res)
        if(res.data.code === 0){
          this.changeData(res.data.data.comments)
        }else{
          this.errTips(res.data.code)
        }
      })
      .catch((err) => {
        console.log(err)
      })
    },
    changeData(data) {
      this.comments = data.concat(this.comments)
      if(this.comments.length >= this.start+this.count ){
        this.start += this.count
      }else{
        this.hasPage = false
        this.loadPageTip = this.$t('no more')
      }
      console.log(this.start, this.comments.length)

      this.$nextTick(() => {
        this.loadFinish()
        this.isUp = false
      })

    },
    _initScroll() {
      this.scroll = new BScroll(this.$refs.wrapper, this.options)
      // 下拉刷新
      this.scroll.on('pullingDown', () => {
        // this.comments = []  // 重置数据
        // this.start = 0      // 重置分页数
        // this.loadData()
      })
      // 上拉加载
      this.scroll.on('pullingUp', () => {
        this.isUp = true
        if (this.hasPage){
          this.loadData()
        }
      })
    },
    loadFinish () {
      this.scroll.finishPullDown()
      this.scroll.finishPullUp()
      this.scroll.refresh()
    },
    chartSVG() {
      let myChart = echarts.init(document.getElementById('canvas-charts'))
      myChart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 20,
            itemWidth: 10,
            itemHeight: 10,
            top: 10,
            data: ['1 '+this.$t('star'), '2 '+this.$t('star'), '3 '+this.$t('star'), '4 '+this.$t('star'), '5 '+this.$t('star')]
          },
          series: [
            {
              color: ['#ff903b', '#ffab33', '#55d8c1', '#68bbff', '#10c003'],
              type: 'pie',
              radius: ['30%', '85%'],
              center: ['60%', '50%'],
              label: {
                  normal: {
                      show: false
                  },
                  emphasis: {
                      show: true
                  }
              },
              data: [
                {
                  value: this.star1,
                  name: '1 '+this.$t('star')
                }, {
                  value: this.star2,
                  name: '2 '+this.$t('star')
                }, {
                  value: this.star3,
                  name: '3 '+this.$t('star')
                }, {
                  value: this.star4,
                  name: '4 '+this.$t('star')
                }, {
                  value: this.star5,
                  name: '5 '+this.$t('star')
                }
              ]
            }
          ]
      })
      return myChart
    },
    timeFormat(strtime) {
      let date = new Date(strtime.replace(/-/g, '/'))
      return date.toLocaleDateString()
    },
    onReply(comment) {
      if (comment){
        this.showMessage = true
        this.replyId = comment.id
      }
    },
    saveReply() {
      this.$vux.loading.show({text: this.$t('loading')})
      let postData = {
        comment_id: this.replyId,
        reply: this.replyText
      }
      this.$ajax.post('/merchant/comment/reply', postData)
      .then((res) => {
        console.log(res)
        this.$vux.loading.hide()
        if (res.data.code === 0){
          this.$vux.toast.show({text: this.$t('success')})
          this.showMessage = false
        }else{
          this.showMessage = false
          this.errTips(res.data.code)
        }

      })
      .catch((err) => {
        this.$vux.loading.hide()
        this.$vux.toast.show({text: this.$t('fail'), type: "warn"})
        console.log(err)
      })
    },
    showImage(img, ind) {
      console.log(img)
      // img.forEach((item, index) => {
      //   this.imgLst[index] = {
      //     src: item.photo,
      //     w: 600,
      //     h: 400
      //   }
      // })
      // this.$refs.previewer.show(ind)
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
      comments: [],
      showBlank: false,
      start: 0, // 开始页数
      count: 5, // 每页数量
      scrollHeight: 350,
      isUp: false,
      hasPage: true,
      loadPageTip: this.$t('loading'),
      options: {
        pullDownRefresh: {
          threshold: 50,  // 当下拉到超过顶部 50px 时，触发 pullingDown 事件
          stop: 20        // 刷新数据的过程中，回弹停留在距离顶部还有 20px 的位置
        },
        pullUpLoad: {
          threshold: -20,  // 在上拉到超过底部 20px 时，触发 pullingUp 事件
        },
        // pullDownRefresh: false,  //关闭下拉
        // pullUpLoad: false,   // 关闭上拉
        click: true,
        probeType: 3,
        startY: 0,
        scrollbar: false
      },
      star1: 0,
      star2: 0,
      star3: 0,
      star4: 0,
      star5: 0,
      averageStar: 0,
      activeIndex: null,
      showMessage: false,
      replyId: '',
      replyText: '',
      imgLst: [],
      imgLstOptions: {
        getThumbBoundsFn (index) {
          let thumbnail = document.querySelectorAll('.guest-comment-img')[index]
          let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
          let rect = thumbnail.getBoundingClientRect()
          return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
        }
      }
    }
  }
}
</script>

<style>
.comment-layer .weui-dialog{width: 100%;}
.comment-layer .weui-dialog__bd{padding: 0;}
.comment-layer .weui-cells{margin-top: 0;}
.comment-layer .weui-label{text-align: left;}
.comment-layer .vux-x-icon{fill:#3399ff;}
</style>


<style scoped>
.bg-white{background-color: #fff;}
.chart-star{height: 30px;padding:10px 5px 10px 24px;}
.chart-star span{vertical-align: top;font-size: 16px; font-weight: bold;}

.location-head{position: relative;padding:15px;background: #fff;}
.flex-box{
  display: -webkit-box;display: -webkit-flex;display: flex;
  -webkit-box-align:flex-start;-webkit-align-items: flex-start;align-items: flex-start;
}

.location-mes{-webkit-box-flex: 1; -webkit-flex: 1; flex: 1; min-width: 0;}
.location-mes p{color: #333; font-size: 12px; line-height: 18px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2;}
.location-mes p.commentText{-webkit-line-clamp: unset;transition: all .4s;}
.comment-images{margin-top:10px;}
.guest-comment-img{padding-top:100%;background-position: center center;background-repeat: no-repeat;-webkit-background-size:cover;-moz-background-size:cover;background-size:cover;margin:2px;}
.scroll-box{background:#fff;margin-top: 10px;overflow:hidden;}
.comment-img{margin-right: .8em;width: 40px;height: 40px;border-radius:50%;background-position: center center;background-repeat: no-repeat;-webkit-background-size:cover;-moz-background-size:cover;background-size:cover;}
.comment-time{position: absolute;right: 10px;font-size: .7rem;font-weight: 400;color:#999;}
.comments-lst{background-color: #fff;}
.load-box{ width: 100%; display: flex; justify-content:center; align-items:center; height: 60px;}

.reply-btn{text-align: right;font-size: 14px;line-height:24px;color:#3399ff;display:block;width: 100%;}
.reply-bar{margin-top:10px;padding-top: 10px;border-top:1px solid #e2e2e2;}
.reply-name{color:#3399ff;}

.layer-name{margin:10px auto;font-size:20px;position: relative;}
.layer-name svg{position: absolute;right: 10px;}
.layer-btn-lst{overflow: hidden;text-align: center;margin:10px auto;}
.layer-btn-del{display: inline-block;width: 100px;height: 35px;line-height:35px;background-color: #ff3333;color:#fff;margin:0 5px;border-radius: 5px;}
.layer-btn-save{display: inline-block;width: 100px;height: 35px;line-height:35px;background-color: #3399ff;color:#fff;margin:0 5px;border-radius: 5px;}
</style>
