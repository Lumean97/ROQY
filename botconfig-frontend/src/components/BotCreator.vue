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
                    <div class="card" @click="selectTemplate(template)" :class="{'selected': isSelected(template)}">
                    <img src="../assets/bot.png" :alt="template.name">
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
        </div>
      </div>    
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import botConfig from './BotConfig.vue'
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
      if (this.description !== '' && this.description.length <= 160) {
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
    createBot () {
      if (this.allValid) {
        this.$store.dispatch('addNewBot', {
          name: this.botname,
          image: '../assets/bot.png',
          status: 'offline',
          description: this.description
        })
        this.$router.push('/bots')
      }
    },
    validInput () {
      if (this.botnameValid && this.descriptionValid && this.selected) {
        this.allValid = true
      }
    },
    reset () {
      this.botname = ''
      this.description = ''
      this.item = ''
    },
    selectTemplate (template) {
      this.template = template
      this.selected = true
      this.validInput()
    },
    isSelected (template) {
      if (this.selected) {
        return this.template === template
      }
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