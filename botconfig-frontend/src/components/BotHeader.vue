
<template>
  <div>
    <md-toolbar class="md-dense" style="color: white; background-color: #414040;">
      <router-link to='/bots'><img class="logo" src="../assets/ROQY.png" alt="ROQY"></router-link>
      <h1 class="md-title"></h1>
      <div class="lg">
        <div>
            <span @click="changeLang('de')" :class="{ selectedLang: lang=='de'}" class="header-text">DE</span>
            <span class="header-text">|</span>
            <span @click="changeLang('en')" :class="{ selectedLang: lang=='en'}" class="header-text">EN</span> 
        </div>
      </div>
      <span @click="logout()" class="header-text" style="margin-left:10px">{{$lang.translate.header.bot_login}}</span>
    </md-toolbar>
    <router-view />
  </div>
</template>

<script>
import 'vue-material/dist/vue-material.css'

export default {
  name: 'header',
  data () {
    return {
      name: 'header',
      lang: 'en'
    }
  },
  methods: {
    /**
    * @param lg language that will be selected
    */
    changeLang (lg) {
      this.lang = lg
      this.$lang.setLang(lg)
    },
    /**
    * Method will route user to the / path and starts Method clearLocalStorage
    */
    logout () {
      setTimeout(() => {
        this.$store.dispatch('logOut')
        this.$router.push('/')
      }, 100)
      this.clearLocalStorage()
    },
    /**
    * Method to clear authorizations from user
    */
    clearLocalStorage () {
      this.$localStorage.remove('user')
    }
  },
  created () {
    this.$router.push('/template')
  }
}
</script>

<style scoped>

.md-button {
  color:black;  
  font-weight:600;
}
.active {
  border-bottom: 2px solid #ff720b;
  color: #ff720b
}
#route {
  margin-left: auto;
  margin-right: auto;
}
span {
    cursor: pointer;
    font-family: 'Roboto';
    font-size: 100%;
}
.md-ripple {
  animation: none !important;
}
.md-ripple.md-active {
  animation: none !important;
}
.logo {
  height: 35px;
}
.lg {
  text-align: right;
}
.md-title{
  flex:1;
  text-align:left;
  margin: 0%;
  padding:0%;
}
.header-text{
  color:white;
}
.selectedLang {
  font-weight: 600;
}
</style>