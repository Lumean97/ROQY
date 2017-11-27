<template>
  <bot-config></bot-config>
</template>

<script>
import botConfig from './BotConfig.vue'

export default {
  data () {
    return {
      botname: '',
      description: '',
      botnameValid: false,
      descriptionValid: false,
      allValid: false,
      item: '',
      selected: false
    }
  },
  computed: {
    templates () {
      return this.$store.getters.getTemplates
    }
  },
  watch: {
    botname () {
      if (this.botname !== '') {
        this.botnameValid = true
      }
      this.validInput()
    },
    description () {
      if (this.description !== '' && this.description.length <= 100) {
        this.descriptionValid = true
      }
      this.validInput()
    },
    item () {
      if (this.item !== '') {
        this.selected = true
      }
      this.validInput()
    }
  },
  methods: {
    create () {
      this.$store.dispatch('addNewBot', {
        name: this.botname,
        image: '../assets/bot.png',
        status: 'offline',
        description: this.description
      })
      this.$router.push('/')
    },
    validInput () {
      if (this.botnameValid === true && this.descriptionValid === true && this.selected === true) {
        this.allValid = true
      }
    },
    reset () {
      this.botname = ''
      this.description = ''
      this.item = ''
    },
    selectTemplate (template) {
      this.item = template
      this.selected = true
      console.log(template)
      this.validInput()
    }
  },
  components: {
    botConfig
  }
}
</script>
<style scoped>
  #entername{
    border: 2px solid #D3D3D3;
    border-radius: 5px;
    padding: 2px;
    margin-left: 90px;
  }
  #enterdescription{
    border: 2px solid #D3D3D3;
    border-radius: 5px;
    height: 100px;
    width: 400px;
  }
  .inputwrapper{
    display: block;
    margin-top: 30px;
    clear: left;
  }
  .textarea{
    float: left;
  }
  .marginleft{
    margin-left: 50px;
  }
  .md-card{
    min-width: 60px;
    min-height: 160px;
    max-width: 160px;
    max-height: 260px;
    word-wrap:break-word;
    margin: 20px;
  }
  .md-card-content{
    word-wrap:break-word;
  }
  .md-title{
    text-align: left;
    margin: 10px;
  }
  img{
    width: 148px;
    height: 148px;
  }
  #imgwrapper{
    text-align: center;
  }
</style>