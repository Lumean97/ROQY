import Vue from 'vue'
import Vuex from 'vuex'
import bots from './modules/bots'
import templates from './modules/template'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    bots,
    templates
  }
})
