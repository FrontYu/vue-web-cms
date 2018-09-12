<template>
  <div>

    <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100;"
    :title="$t('top five dishes')"
    :left-options="{backText: '', showBack: true, preventGoBack: true}" @on-click-back="goUrl">
      <span slot="right">
        <!-- <span class="edit-dishes"></span> -->
      </span>
    </x-header>

    <blank v-if="showBlank"></blank>

    <div class="head-pt">
      <div class="dishes-lst-padding">

        <div class="dish-lst" v-for="dish in location.dishes" :key="dish.id">
          <router-link :to="{ path: '/merchant/'+$route.params.system+'/dish', query:{ location_id: location.id, dish_id: dish.id }}">
            <flexbox :gutter="10" wrap="wrap">
              <flexbox-item :span="5">
                <div class="bg-cover" v-lazy:background-image="getImage(dish.photo)"></div>
              </flexbox-item>
              <flexbox-item>
                <h4 class="dish-name">{{ dish.name }}</h4>
                <p class="dish-desc">{{ dish.desc }}</p>
                <p class="dish-price">{{ $t('price') }}:  <span>{{ dish.currency }} {{ dish.price }}</span></p>
              </flexbox-item>
            </flexbox>
          </router-link>
        </div>

        <div class="dish-lst" v-if="addBtn">
          <router-link :to="{ path: '/merchant/'+$route.params.system+'/dish', query:{ location_id: location.id }}">
            <flexbox :gutter="0" wrap="wrap">
              <flexbox-item :span="4"></flexbox-item>
              <flexbox-item :span="4">
                <div class="bg-cover">
                  <div class="cross"></div>
                  <div class="vertical"></div>
                </div>
              </flexbox-item>
              <flexbox-item :span="4"></flexbox-item>
            </flexbox>
          </router-link>
        </div>


      </div>
    </div>

  </div>
</template>

<script>
import { XHeader, Flexbox, FlexboxItem } from 'vux'
export default {
  name: 'dishes',
  components: {
    XHeader,
    Flexbox,
    FlexboxItem,
    'Blank': () => import('@/components/blank')
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.$ajax.post('/merchant/location/get', {
        location_id: this.$route.query.location_id
      })
      .then((res) => {
        console.log(res)
        this.location = res.data.data.location
        if (this.location.dishes.length == 0) {
          this.showBlank = true
          this.addBtn = true
        }
        if (this.location.dishes.length >= 5) {
          this.addBtn = false
        }else{
          this.addBtn = true
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
      addBtn: false,
    }
  }
}
</script>

<style scoped>
.edit-dishes{width:40px;height:40px;display:block;background-image:url('../assets/images/edit.png');background-repeat: no-repeat;background-position: center;background-size: auto 50%;position:relative;top:-10px;right:-8px;}

.dishes-lst-padding{padding:20px 10px;}
.dish-lst{margin-bottom: 10px;background: #fff;height:auto; }
.bg-cover{width: 100%;height: 0;position:relative;padding-bottom: 87%;overflow:hidden;background-position: center center;background-repeat: no-repeat;-webkit-background-size:cover;-moz-background-size:cover;background-size:cover;}
.dish-name{font-size: 16px;color:#333;font-weight: bold;word-break:break-all;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden;}
.dish-desc{word-break:break-all;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size: 12px;font-weight: 500;color: #333;}
.dish-price{font-size: 14px;color:#333;font-weight: bold;margin-top: 15px;}
.dish-price span{font-size: 14px;color:#e64848;font-weight: bold;}

.bg-cover .cross{width: 4rem; height: 4px; background-color: #c3c3c3; position: absolute; left: 50%; top: 50%; margin-top: -2px; margin-left: -2rem; border-radius: 4rem; }
.bg-cover .vertical{width: 4px; height: 4rem; background-color: #c3c3c3; position: absolute; left: 50%; top: 50%; margin-top: -2rem; margin-left: -2px; border-radius: 4rem; }
</style>
