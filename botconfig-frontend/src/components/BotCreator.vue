<template>
  <div id="creator" >
    <div class="margin">
      <div class="header">
        <h2>{{$lang.translate.creator.title}}</h2>
      </div>
      <div class="content">
        <div class="left">
          <div class="margin">
          <span>{{$lang.translate.creator.name}} *</span>
          </div>
          <div class="margin" style="margin-top:20px">
            <span>{{$lang.translate.creator.description}} *</span>
          </div>
        </div>
        <div class="right-input">
          <div class="margin">
            <input v-model="botname" type="name" required/>
          </div>
          <div class="margin">
            <textarea v-model="description"  type="name" rows="4" cols="70"></textarea>
          </div>
        </div>
        <div>
            <div class="margin">
              <span>{{$lang.translate.creator.template}} *</span>
            </div>
            <div class="row">
              <div v-for="(template, templates) in templates" :key="template.name">
                  <div class="card-wraper">
                    <div class="card" @click="selectTemplate(template)" :class="{'selected': isSelected(template), 'isAvailable': isAvailable(template)}">
                    <img :src="getTemplateImage(template.name)" :alt="template.name">
                    <div class="container">
                      <h4><b>{{template.name}}</b></h4>
                      <p>{{template.description}}</p>
                    </div>

                  </div>
                  </div>
              </div>
            </div>
        </div>
        <div id="footer">
          <div>
            <button class="button" @click="createBot()">{{$lang.translate.creator.create}}</button>
          </div>
          <div id="firstButton">
            <button class="button" @click="routeBack()">{{$lang.translate.creator.back}}</button>
          </div>
        </div>
      </div>    
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import botConfig from './BotConfig.vue'
import botWelcome from '../assets/bot_orange.svg'
import botFaq from '../assets/bot_violett.svg'
import api from '../api/botData'
export default {
  name: 'creator',
  data () {
    return {
      botname: '',
      description: '',
      template: null,
      botnameValid: false,
      descriptionValid: false,
      selected: false,
      allValid: false
    }
  },
  computed: {
    /**
    * Returns all Templates saved in store
    */
    templates () {
      return this.$store.getters.getTemplates
    }
  },
  watch: {
    /**
    * Returns true if bot.name input field is not empty else false
    */
    botname () {
      if (this.botname !== '') {
        this.botnameValid = true
      }
      this.validInput()
    },
    /**
    * Returns true if bot.description is not empty and length of text is not over 160 letters
    */
    description () {
      if (this.description !== '' && this.description.length <= 160) {
        this.descriptionValid = true
      }
      this.validInput()
    },
    /**
    * Returns true if Bot-Template is selected else start method validInput
    */
    item () {
      if (this.item !== '') {
        this.selected = true
      }
      this.validInput()
    }
  },
  methods: {
    /**
    * Bot will be pushed to the store
    * @param allValid true if all input fields filled else false
    */
    createBot () {
      if (this.allValid) {
        api.addNewBot({
          name: this.botname,
          description: this.description,
          botType: this.template.name
        })
        .then((response) => {
          this.$router.push('/bots')
        })
        .catch((err) => {
          console.log(err.message)
          alert('Failed to create this bot please try again.')
        })
      }
    },
    /**
    * routes user back to /bots
    */
    routeBack () {
      this.$router.push('/bots')
    },
    /**
    * Sets this.allValid true if all input field filled
    */
    validInput () {
      if (this.botnameValid && this.descriptionValid && this.selected) {
        this.allValid = true
      }
    },
    /**
    * Method to clear input fields after creating/leaving the path
    */
    reset () {
      this.botname = ''
      this.description = ''
      this.item = ''
    },
    /**
    * @param selected True if Template is selected
    */
    selectTemplate (template) {
      let welcome = this.$store.getters.getbots.find((bot) => {
        return bot.botType === 'welcome'
      })
      if (welcome === undefined) {
        this.template = template
        this.selected = true
        this.validInput()
      } else {
        if (template.name === 'faq') {
          this.template = template
          this.selected = true
          this.validInput()
        } else {
          this.selected = false
          this.template = null
        }
      }
    },
    isSelected (template) {
      if (this.selected) {
        return this.template === template
      }
    },
    /**
    * If selected Bot is welcome then use Welcome-Bot Image else Faq-Bot image
    * @param template Current Bot Template
    */
    isAvailable (template) {
      let welcome = this.$store.getters.getbots.find((bot) => {
        return bot.botType === 'welcome'
      })
      if (welcome === undefined) {
        return false
      } else {
        if (template.name === 'faq') {
          return false
        } else {
          return true
        }
      }
    },
    getTemplateImage (template) {
      return template === 'welcome' ? botWelcome : botFaq
    }
  },
  components: {
    botConfig
  }
}
</script>
<style scoped>
  #creator {
    width: 60%;
    margin: auto;
  }
  .header {
   width: 30%;
   margin-left: auto;
   margin-right: auto;
   margin-top: 7%;
   margin-bottom: 5%
  }
  header h2 {
   min-width: 170px;
  }
  input, textarea{
    border:1px solid black;
    border-radius: 3px;
  }
  input {
    width: 40%;
    height: 30px;
    padding: 1.5px;
  }
  textarea {
    width: 70%;
    height: 100px;
  }
  .content {
    max-width: 90%;
    margin: 0 auto;
  }
  .right-input {
    margin-left: 25%;
  }
  .margin {
    margin-top: 4%;
  }
  row {
    width:100%;
    text-align: center;
    margin: 0 auto;
    overflow: hidden;
  }
  .card-wraper {
    display: inline;
    min-width: 25%;
    max-height: 250px;
    min-height: 250px;
    max-width: 25%;
  }
  .card {
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    border-radius: 3px;
    transition: 0.3s;
    min-width: 23%;
    max-height: 210px;
    min-height: 210px;
    max-width: 23%;
    padding-top: .5%;
    margin: .5%;
    background-color: white;
    cursor: pointer;
    word-wrap:break-word;
    float: left;
  }
  .selected {
    border: 3px solid orange;
  }
  .isAvailable {
    background-color: #d4d6d8;
    opacity: .5%;
  }
  .container {
    margin-top: 5%;
    padding: 2px 10px;
  }
  img {
    width: 80px;
    height: 80px;
    margin-top: 10%;
    margin-right: auto;
    margin-left: auto;
    display: block;
  }
  #footer {
    width: 100%;
    padding: .5%;
    display: flex;
    flex-flow: row-reverse wrap;
    margin-bottom: 5%;
  }

  #footer .button {
    background-color: orange;
    border: none;
    border-radius: 10px;
    color: black;
    padding: 8px 15px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    cursor: pointer;
    width: 90px;
  }

  #firstButton {
    margin-right: 2%;
  }

  @media only screen and (max-width: 800px) {
    .card-wraper {
      display: inline;
      min-width: 33%;
      max-height: 250px;
      min-height: 250px;
      max-width: 33%;
    }
    .card {
      min-width: 32%;
      max-height: 220px;
      min-height: 220px;
      max-width: 32%;
    }
  }
</style>