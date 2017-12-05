<template>
  <div id="marketplace">
    <div class="row">
      <div v-for="(marketplacebot, botsforMarketplace) in botsforMarketplace" :key="marketplacebot.name">
        <div class="bot-wrapper">
          <div class="card-horizontal">
          </div>
          <div class="card-vertical">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import botInfo from './BotInfo.vue'
import 'vue-material/dist/vue-material.css'

export default {
  name: 'marketplace',
  computed: {
    botsforMarketplace () {
      return this.$store.getters.getMarketplaceBots
    }
  },
  components: {
    botInfo
  },
  created () {
    this.$store.dispatch('getAllmarketplaceBots')
  }
}
</script>


<style scoped>
  .row {
    padding: auto;
    margin-top:0.4%;
  }

  .add {
    border: dashed 1px orange;
    text-align:center; 
    min-width:auto; 
  }
  .rounded {
      border-radius:50%;
      margin:30%;
      text-align:center
  }
  .md-warn {
    border: dashed 1px #FF6600;
    border-radius:40px;
    font-family:'verdana';
    font-weight:600;
  }
</style>