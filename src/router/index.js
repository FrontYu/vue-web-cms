import Vue from 'vue'
import Router from 'vue-router'
import store from '@/vuex/store'

// const Home = r => require.ensure([], () => r(require('@/pages/home')), 'Home')
// const Login = r => require.ensure([], () => r(require('@/pages/login')), 'Login')
// const Register = r => require.ensure([], () => r(require('@/pages/register')), 'Register')
// const Settings = r => require.ensure([], () => r(require('@/pages/settings')), 'Settings')
// const Staffs = r => require.ensure([], () => r(require('@/pages/staffs')), 'Staffs')
// const Locations = r => require.ensure([], () => r(require('@/pages/locations')), 'Locations')
// const Location = r => require.ensure([], () => r(require('@/pages/location')), 'Location')
// const Dishes = r => require.ensure([], () => r(require('@/pages/dishes')), 'Dishes')
// const Dish = r => require.ensure([], () => r(require('@/pages/dish')), 'Dish')
// const Coupons = r => require.ensure([], () => r(require('@/pages/coupons')), 'Coupons')
// const Coupon = r => require.ensure([], () => r(require('@/pages/coupon')), 'Coupon')
// const Comment = r => require.ensure([], () => r(require('@/pages/comment')), 'Comment')
// const Service = r => require.ensure([], () => r(require('@/pages/service')), 'Service')
// const Nofound = r => require.ensure([], () => r(require('@/pages/nofound')), 'Nofound')

// import Home from '@/pages/home'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/merchant/',
      redirect: '/merchant/web/home'
    },
    {
      path: '/merchant/index',
      redirect: '/merchant/web/home'
    },
    {
      path: '/merchant/:system/home',
      component: (resolve) => require(['@/pages/home'], resolve)
    },
    {
      path: '/merchant/:system/login',
      component: (resolve) => require(['@/pages/login'], resolve)
    },
    {
      path: '/merchant/:system/register',
      component: (resolve) => require(['@/pages/register'], resolve)
    },
    {
      path: '/merchant/:system/settings',
      component: (resolve) => require(['@/pages/settings'], resolve)
    },
    {
      path: '/merchant/:system/service',
      component: (resolve) => require(['@/pages/service'], resolve)
    },
    {
      path: '/merchant/:system/staffs',
      component: (resolve) => require(['@/pages/staffs'], resolve)
    },
    {
      path: '/merchant/:system/locations',
      component: (resolve) => require(['@/pages/locations'], resolve)
    },
    {
      path: '/merchant/:system/location',
      component: (resolve) => require(['@/pages/location'], resolve)
    },
    {
      path: '/merchant/:system/dishes',
      component: (resolve) => require(['@/pages/dishes'], resolve)
    },
    {
      path: '/merchant/:system/dish',
      component: (resolve) => require(['@/pages/dish'], resolve)
    },
    {
      path: '/merchant/:system/coupons',
      component: (resolve) => require(['@/pages/coupons'], resolve)
    },
    {
      path: '/merchant/:system/coupon',
      component: (resolve) => require(['@/pages/coupon'], resolve)
    },
    {
      path: '/merchant/:system/comment',
      component: (resolve) => require(['@/pages/comment'], resolve)
    },
    {
      path: '/merchant/*',
      component: (resolve) => require(['@/pages/nofound'], resolve)
    }
  ]
})

// export default new Router({})

store.registerModule('vux', {
  state: {
    direction: 'forward'
  },
  mutations: {
    updateDirection (state, payload) {
      state.direction = payload.direction
    }
  }
})
// simple history management
const history = window.sessionStorage
history.clear()
let historyCount = history.getItem('count') * 1 || 0
history.setItem('/', 0)
let isPush = false
let endTime = Date.now()

router.beforeEach(function (to, from, next) {
  const toIndex = history.getItem(to.path)
  const fromIndex = history.getItem(from.path)

  if (toIndex) {
    if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
      store.commit('updateDirection', {direction: 'forward'})
    } else {
      // 判断是否是ios左滑返回
      if (!isPush && (Date.now() - endTime) < 377) {
        store.commit('updateDirection', {direction: ''})
      } else {
        store.commit('updateDirection', { direction: 'reverse' })
      }
    }
  } else {
    ++historyCount
    history.setItem('count', historyCount)
    to.path !== '/' && history.setItem(to.path, historyCount)
    store.commit('updateDirection', {direction: 'forward'})
  }

  if (/\/http/.test(to.path)) {
    let url = to.path.split('http')[1]
    window.location.href = `http${url}`
  } else {
    next()
  }
})

export default router