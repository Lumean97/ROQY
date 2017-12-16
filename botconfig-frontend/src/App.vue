<template>
  <div id="app">
    <app-header v-if="check === true"></app-header>
    <app-login v-show="check === false"></app-login>
  </div>
</template>

<script>
import header from './components/BotHeader.vue'
import login from './components/BotLogin.vue'
import 'vue-material/dist/vue-material.css'

export default {
  name: 'app',
  components: {
    'app-header': header,
    'app-login': login
  },
  created () {
    setTimeout(() => {
      let user = JSON.parse(this.$localStorage.get('user'))
      this.$store.dispatch('logIn', user)
    }, 10)
  },
  computed: {
    check () {
      return this.$store.getters.checkout
    }
  }
}
</script>

<style>
#app {
  font-family: Roboto, 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0 ;
  min-width: 463px;
}
@import './assets/defaults.css'
</style>
