<template>
  <div>
      <blank v-if="showBlank"></blank>

      <div class="home-padding">
        <flexbox :gutter="0" wrap="wrap">
          <flexbox-item :span="1/2" v-for="location in locations" :key="location.id">
            <router-link :to="{ path: '/merchant/'+$route.params.system+'/locations', query: { location_id: location.id }}">
              <div class="margin-10">
                <div class="location-img" v-lazy:background-image="getImage(location.photo)"></div>
                <div class="bg-white">
                  <h4 class="location-name">{{ location.name }}</h4>
                  <div class="location-people">
                    <i class="icon-people"></i>
                    <span class="staffs-num">{{ location.staffs }}</span>
                  </div>
                </div>
              </div>
            </router-link>
          </flexbox-item>
        </flexbox>
      </div>

  </div>
</template>

<script>
import { Flexbox, FlexboxItem } from 'vux'

export default {
  name: 'homelist',
  components: {
    Flexbox,
    FlexboxItem,
    'Blank': () => import('@/components/blank')
  },
  methods: {

  },
  watch: {
    '$store.state.merchantData': function(val) {
      // console.log(val)
      this.locations = val.locations
      if (this.locations){
        this.showBlank = this.locations.length == 0 ? true : false
      }else{
        this.showBlank = false
      }
    }
  },
  data () {
    return {
      showBlank: false,
      locations: this.$store.state.merchantData.locations,
    }
  }
}
</script>

<style scoped>
.home-padding{padding:20px 0;}
.margin-10{margin:0 10px 20px;box-shadow: 6px 7px 13px 0 rgba(156,156,156,.5);}
.bg-white{background-color: #fff;}
.location-img{width: 100%;height: 0;padding-bottom: 75%;overflow:hidden;background-position: center center;background-repeat: no-repeat;-webkit-background-size:cover;-moz-background-size:cover;background-size:cover;}
.location-name{width: 90%;word-break:break-all;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden;font-size: 15px;font-weight: 500;padding:8px 5%;color:#000;}
.location-people{width: 90%;padding:0 5% 10px;}
.icon-people{width: 20px;height: 20px;display:inline-block;margin-right: 5px;background: url('../assets/images/icon-people.png') center center / contain no-repeat;vertical-align: middle;}
.location-people span{vertical-align: middle;font-size: 13px;color: #999;}
</style>
