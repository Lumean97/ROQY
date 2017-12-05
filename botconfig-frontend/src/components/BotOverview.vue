<template>
  <div>
    <div class="md-toolbar">
      <span style="margin-right:5px">{{$lang.translate.overview.sortby}}</span>      
      <md-field class="toolbar-input">
        <md-select>
            <md-option value="date">{{$lang.translate.overview.date}}</md-option>
            <md-option value="type">{{$lang.translate.overview.type}}</md-option>
        </md-select>
      </md-field>
      <md-field style="border-radius:16px;" class="toolbar-input">
         <md-input :placeholder="$lang.translate.overview.search" style="padding:5px;padding-left:20px;"></md-input>
      </md-field>
      <router-link style="color:white;border-radius:46px;" tag="md-button" to="/newBot" class="md-raised md-primary">{{$lang.translate.overview.create}}</router-link>
    </div>
    <md-layout class="overview-wrapper">
      <md-layout style="flex:unset;" v-for="(bot, bots) in bots" :key="bot.id">
        <bot-info :botData="bot"></bot-info>
      </md-layout>
      <md-layout style="flex:unset;">
        <div class="inline-newbot">
          <router-link tag="div" to="/newBot" class="inline-newbot-btn">
            <span class="inline-newbot-plus">+</span>
          </router-link>
        </div>
      </md-layout>
    </md-layout>
  </div>
</template>

<script>
import botInfo from './BotInfo.vue'
import 'vue-material/dist/vue-material.css'

export default {
  computed: {
    bots () {
      return this.$store.getters.getbots
    }
  },
  components: {
    botInfo
  },
  created () {
    this.$store.dispatch('getAllBots')
  }
}
</script>

<style scoped>
  .overview-wrapper{
    text-align: center;
    max-width: 1152px;
    margin: 0 auto;
  }

  .md-warn {
    border: dashed 1px #FF6600;
    border-radius:40px;
    font-family:'verdana';
    font-weight:600;
  }

  div.md-toolbar {
    justify-content: flex-end;
    align-items: center;
  }

  .toolbar-input {
    background-color: white;
    margin: 10px;
  }

  .inline-newbot {
    min-width: 260px;
    min-height: 360px;
    max-width: 260px;
    max-height: 360px;
    display: inline-flex;
    align-items: center;
  }
  
 .inline-newbot-btn {
    width: 64px;
    height: 64px;
    background-color: orange;
    border-radius: 32px;
    margin: auto;
    cursor: pointer;
 }

 .inline-newbot-plus {
    font-size: 40px;
    line-height: 64px;
    cursor: pointer;
    color: white;
    font-weight: 200;
 }
</style>
