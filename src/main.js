// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint-disable */
import App from './App'

import './assets/css/reset.css'
import router from './router'
import store from './vuex/store'
const username = localStorage.getItem('username')
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (username || store.state.user.name) {
      next()
    } else {
      next({path: '/'})
    }
    switch (to.path) {
      case '/index':
        store.dispatch('setTitlename', {name: '魔方教育欢迎您的登录' + '（' + username + '）'})
        break
      case '/client':
        store.dispatch('setTitlename', {name: '客户池'})
        break
      case '/record':
        store.dispatch('setTitlename', {name: '联系记录'})
        break
      case '/task':
        store.dispatch('setTitlename', {name: '日常任务'})
        break
      case '/setting':
        store.dispatch('setTitlename', {name: '设置'})
        break
    }
  } else {
    next() // 确保一定要调用 next()
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
