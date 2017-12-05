import Vue from 'vue'
import Router from 'vue-router'
import overview from '@/components/BotOverview'
import creator from '@/components/BotCreator'
import template from '@/components/BotTemplate'
import marketplace from '@/components/BotMarketplace'
import config from '@/components/BotConfig'
import login from '@/components/BotLogin'

import {store} from '../store'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/bots',
      name: 'overview',
      component: overview,
      beforeEnter: requireAuth
    },
    {
      path: '/newbot',
      name: 'newbot',
      component: creator,
      beforeEnter: requireAuth
    },
    {
      path: '/template',
      name: 'template',
      component: template,
      beforeEnter: requireAuth
    },
    {
      path: '/marketplace',
      name: 'marketplace',
      component: marketplace,
      beforeEnter: requireAuth
    },
    {
      path: '/bot/:id/config/',
      name: 'config',
      component: config,
      beforeEnter: requireAuth,
      props: true

    },
    {
      path: '/',
      name: 'login',
      component: login
    }
  ]
})

function requireAuth (to, from, next) {
  if (!store.getters.checkout) {
    next({
      path: '/'
    })
  } else {
    next()
  }
}
