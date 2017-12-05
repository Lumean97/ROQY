
<template>
  <div>
    <md-toolbar class="md-dense" style="color: white; background-color: #414040;">
      <img class="logo" src="../assets/ROQY.png" alt="ROQY">
      <!--TODO "md-title" dient nur als Platzhalter zwischen Logo und DE|EN.
          Platzhalter entfernen und Logo + Sprachauswahl richtig einordnen!-->
      <h1 class="md-title"></h1>
      <div class="lg">
        <div>
            <span @click="changeLang('de')" class="de" >DE</span>
            <span @click="changeLang('en')">EN</span> 
        </div>
      </div>
      <span @click="logout()" style="margin-left:10px">{{$lang.translate.header.bot_login}}</span>
    </md-toolbar>
    <md-toolbar class=" md-dense " style="background-color:white; color: #ff720b;">
      <div id="route">
          <router-link tag="md-button" to="/bots" active-class="active">{{$lang.translate.header.my_bots}}</router-link>
          <router-link tag="md-button" to="/template" active-class="active">{{$lang.translate.header.bot_template}}</router-link>
          <router-link tag="md-button" to="/marketplace" active-class="active">{{$lang.translate.header.bot_marketplace}}</router-link>
      </div>
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
      name: 'header'
    }
  },
  methods: {
    changeLang (lg) {
      this.$lang.setLang(lg)
    },
    logout () {
      setTimeout(() => {
        this.$store.dispatch('logOut')
        this.$router.push('/')
      }, 1000)
      this.clearLocalStorage()
    },
    clearLocalStorage () {
      this.$localStorage.remove('user')
    }
  },
  created () {
    this.$router.push('/bots')
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
span.de {
  border-right: 1px solid white;
  padding-right: 5px;
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
</style>