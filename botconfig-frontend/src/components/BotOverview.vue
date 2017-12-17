<template>
  <div>
    <headermenu></headermenu>
    <div class="md-toolbar">
      <span style="margin-right:5px">{{$lang.translate.overview.sortby}}</span>      
      <md-field style="border-radius:20px;" class="toolbar-input">
        <md-select v-model="sortBy">
            <md-option value="date">{{$lang.translate.overview.date}}</md-option>
            <md-option value="type">{{$lang.translate.overview.type}}</md-option>
        </md-select>
      </md-field>
      <md-field class="toolbar-input">
        <input v-model="search" :placeholder="$lang.translate.overview.search" style="padding:5px;padding-left:20px;"></input>
        <md-icon style="margin-right:10px;">search</md-icon>
      </md-field>
      <router-link class="default-btn" tag="button" to="/newBot">{{$lang.translate.overview.create}}</router-link>
    </div>
    <md-layout class="overview-wrapper">
      <md-layout style="flex:unset;" v-for="(bot, bots) in bots" :key="bot.id">
        <bot-info v-if="matchSearch(bot.name)" :botData="bot" :parent="'overview'"></bot-info>
      </md-layout>
      <md-layout style="flex:unset;">
          <router-link tag="div" to="/newBot" class="inline-newbot default-shadow">
            <div class="inline-newbot-btn">
              <span class="inline-newbot-plus">+</span>
            </div>
          </router-link>
      </md-layout>
    </md-layout>
  </div>
</template>

<script>
import botInfo from './BotInfo.vue'
import 'vue-material/dist/vue-material.css'
import headermenu from './Header.vue'

export default {
  data () {
    return {
      search: '',
      sortBy: ''
    }
  },
  computed: {
    /**
    * Returns all Bots saved in store
    */
    bots () {
      let sortBy = this.sortBy
      return this.$store.getters.getbots.sort(
        /**
        * Returns sorted Bots depending on each criteria
        * @param a,b Bots we receive from the store
        */
        function (a, b) {
          switch (sortBy) {
            case 'date':
              if (a.id > b.id) {
                return 1
              }
              if (a.id < b.id) {
                return -1
              }
              return 0
            case 'type':
              if (a.type > b.type) {
                return 1
              }
              if (a.type < b.type) {
                return -1
              }
              return 0
          }
        }
      )
    }
  },
  components: {
    botInfo,
    headermenu
  },
  created () {
    this.$store.dispatch('getAllBots')
  },
  methods: {
    /**
    * Method to search for a spezific Bot
    * @param input Name we are searching for
    */
    matchSearch (input) {
      if (this.search === '') {
        return true
      } else {
        return input.toUpperCase().includes(this.search.toUpperCase())
      }
    }
  }
}
</script>

<style scoped>
  .overview-wrapper{
    text-align: center;
    max-width: 1152px;
    margin: 0 auto;
  }

  div.md-toolbar {
    justify-content: flex-end;
    align-items: center;
  }

  .toolbar-input {
    background-color: white;
    margin: 10px;
    border-radius:16px;
  }

  .inline-newbot {
    min-width: 260px;
    min-height: 360px;
    max-width: 260px;
    max-height: 360px;
    display: inline-flex;
    align-items: center;
    border: 3px dashed orange;
    border-radius:7px;
    margin: 14px;
    cursor: pointer;
  }
  
 .inline-newbot-btn {
    width: 64px;
    height: 64px;
    background-color: orange;
    border-radius: 32px;
    margin: auto;
 }

 .inline-newbot-plus {
    font-size: 40px;
    line-height: 64px;
    cursor: pointer;
    color: white;
    font-weight: 200;
 }

 button.default-btn {
   padding: 5px 10px;
 }
</style>
