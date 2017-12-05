// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import vueMaterial from 'vue-material'
import localStorage from 'vue-localstorage'

import {store} from './store'
import lang from 'vuejs-localization'
lang.requireAll(require.context('./lang', true, /\.js$/))

Vue.use(vueMaterial)
Vue.use(localStorage)

Vue.material.registerTheme('default', {
  primary: 'orange',
  accent: 'black'
})

Vue.use(lang)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  lang,
  template: '<App/>',
  components: { App }
})
