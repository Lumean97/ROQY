<template>
  <div id="marketplace">
    <headermenu></headermenu>
    <div class="md-toolbar">
    <span style="margin-right:5px">{{$lang.translate.overview.sortby}}</span>      
      <md-field style="border-radius:20px;" class="toolbar-input">
        <md-select v-model="sortBy">
            <md-option value="date">{{$lang.translate.overview.date}}</md-option>
            <md-option value="type">{{$lang.translate.overview.type}}</md-option>
        </md-select>
      </md-field>
      <md-field style="border-radius:16px;" class="toolbar-input">
        <input v-model="search" :placeholder="$lang.translate.overview.search" style="padding:5px;padding-left:20px;"></input>
        <md-icon style="margin-right:10px;">search</md-icon>
      </md-field>
    </div>

    <md-layout class="row">
      <md-layout style="flex:unset;" v-for="(bot, bots) in bots" :key="bot.id">
        <bot-info v-if="matchSearch(bot.name) && isValidBot(bot)" :botData="bot" :parent="'marketplace'"></bot-info>
      </md-layout>
    </md-layout>
  </div>
</template>


<script>
import botInfo from './BotInfo.vue'
import 'vue-material/dist/vue-material.css'
import headermenu from './Header.vue'

export default {
  name: 'marketplace',
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
    },
    /**
    * Method to list all public Bots
    * @param input Bots from the store
    */
    isValidBot (input) {
      if (input.privacy === 'public') {
        return true
      } else {
        return false
      }
    }
  }
}
</script>


<style scoped>
.row{
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
}
.row {
  margin-left: 20px;
  margin-right: 20px;
}
.card-wrapper{
  display: inline;
  margin: 14px;
  min-width: 260px;
  min-height: 360px;
  max-width: 260px;
  max-height: 360px;
  float: left;
}

.header{
  float: right;
}

.md-card{
  min-width: 260px;
  min-height: 360px;
  max-width: 260px;
  max-height: 360px;
  word-wrap:break-word;
  padding-top: 10px;
}

.md-card-content{
  word-wrap:break-word;
}

.info-wrapper{
  text-align: left;
  padding: 15px 15px 0 15px;
}

img{
  width: 148px;
  height: 148px;
}
#imgwrapper{
  text-align: center;
}
.typeText {
  font-size:10px;
  display: block;
}
</style>