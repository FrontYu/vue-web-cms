<template>
  <div>
    <drawer width="260px" :show.sync="drawerVisibility" show-mode="push" placement="left" :drawer-style="{'background-color':'#39f', width:'260px'}">
      <!-- slide bar -->
      <div slot="drawer">
        <profile></profile>
      </div>

      <view-box ref="viewBox" body-padding-top="46px">

        <!-- header -->
        <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100;"
        :title="$t('home')"
        :left-options="{backText: '', showBack: true}">

          <span slot="overwrite-left" @click="drawerVisibility = !drawerVisibility" >
            <x-icon type="navicon" size="35" style="fill:#fff;position:relative;top:-8px;left:-3px;"></x-icon>
          </span>

          <span slot="right">
            <router-link to="" :to="{path: '/merchant/'+$route.params.system+'/location'}">
              <x-icon type="ios-plus-empty" size="40" style="fill:#fff;position:relative;top:-10px;right:-8px;"></x-icon>
            </router-link>
          </span>
        </x-header>

        <vue-lazy-component :timeout="1000">
          <home-list />
          <home-list-skeleton slot="skeleton"/>
        </vue-lazy-component>

      </view-box>

    </drawer>

  </div>
</template>

<script>
import { Drawer, ViewBox, XHeader } from 'vux'

import HomeListSkeleton from '@/components/homeListSkeleton'
import HomeList from '@/components/homeList'
import Profile from '@/components/profile'

export default {
  components: {
    Drawer,
    ViewBox,
    XHeader,
    HomeListSkeleton,
    HomeList,
    Profile
  },
  data () {
    return {
      drawerVisibility: false
    }
  }
}
</script>

<style scoped>
</style>
