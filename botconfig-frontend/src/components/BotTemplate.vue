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
      <md-field style="border-radius:16px;" class="toolbar-input">
        <input v-model="search" :placeholder="$lang.translate.overview.search" style="padding:5px;padding-left:20px;"></input>
        <md-icon style="margin-right:10px;">search</md-icon>
      </md-field>
    </div>

    <md-layout class="overview-wrapper">
      <md-layout v-if="matchSearch(template.name)" v-for="(template, templates) in templates" :key="template.name">    
      
      <md-card>
        <md-card-header>

          <div id="imgwrapper">
            <img :src="getTemplateImage(template.name)" :alt="template.name">
          </div>
          <!--          
          <div class="auswahlmenü">
            <md-menu clas md-direction="bottom left">
            <md-button class="md-icon-button header-menu-btn" md-menu-trigger>
              <md-icon>more_vert</md-icon>
            </md-button>
            <md-menu-content>
              <md-menu-item v-on:click="openDialog(ref1, template)">
                <span>{{$lang.translate.template.delete}}</span>
              </md-menu-item>
            </md-menu-content>
            </md-menu>
          </div>
          -->
          <div id="right-text">
            <div id="template-name">{{template.name}}</div>
            <div id="template-title">{{template.name}}</div>
            <div id="template-desc">{{template.description}}</div>
          </div>
        </md-card-header> 
      </md-card>
    </md-layout>
  </md-layout>
  <!--
  <md-dialog md-open-from="#confirm" md-close-to="#confirm" ref='dialog1'>
    <md-dialog-title>{{$lang.translate.info.title}}</md-dialog-title>
    <md-dialog-content>{{$lang.translate.info.contentHtml}}</md-dialog-content>
    <md-dialog-actions>
      <md-button class="md-primary" v-on:click="closeDialog(ref1)"> {{$lang.translate.info.cancel}}</md-button>
      <md-button class="md-primary" @click="deleteItem()" >{{$lang.translate.info.ok}}</md-button>
    </md-dialog-actions>
  </md-dialog>
  -->
  </div>

</template>
<script>
import 'vue-material/dist/vue-material.css'
import botWelcome from '../assets/bot_orange.svg'
import botFaq from '../assets/bot_violett.svg'
import headermenu from './Header.vue'

export default {
  data () {
    return {
      ref1: 'dialog1',
      selectedTemplate: null,
      search: '',
      sortBy: ''
    }
  },
  computed: {
    /**
    * Returns all Bots saved in store
    */
    templates () {
      let sortBy = this.sortBy
      return this.$store.getters.getTemplates.sort(
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
    headermenu
  },
  methods: {
    /**
    * Method to delete the selected Template
    */
    deleteItem () {
      this.$store.dispatch('deleteTemplate', this.selectedTemplate)
      this.closeDialog(this.ref1)
    },
    /**
    * Method to open pop up window
    * @param ref dialog that should be open
    * @param template Selected Template
    */
    openDialog (ref, template) {
      this.$refs[ref].open()
      this.selectedTemplate = template
    },
    /**
    * Method to close open pop up window
    * @param ref dialog that should be open
    */
    closeDialog (ref) {
      this.$refs[ref].close()
      this.selectedTemplate = null
    },
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
    * If selected Bot is welcome then use Welcome-Bot Image else Faq-Bot image
    * @param template Current Bot Template
    */
    getTemplateImage (template) {
      return template === 'welcome' ? botWelcome : botFaq
    }
  },
  created () {
    this.$store.dispatch('getTemplates')
  }
}
</script>

<style scoped>
  .md-card{
    min-width: 500px;
    min-height: 200px;
    max-width: 475px;
    max-height: 250px;
    word-wrap:break-word;
    margin-top: 12.5px;
    margin-bottom: 12.5px;
    margin-right: 15px;
    margin-left: 15px;
    padding: 2px;
    border-radius: 5px;
  }
  .md-card-content{
    word-wrap:break-word;
  }
  img{
    width: 140px;
    height: 140px;
    float: left;
  }
  #imgwrapper{
    margin-top: 12px;
    margin-left: 26.5px;
    text-align: left;
  }
  #right-text{
    padding-left: 50.5px;
    margin-top: 35px;
    text-align: left;
    margin-left: 35%
  }
  #template-name{
    font-size: 10px;
  }
  #template-title{
    font-size: 24px;
    margin: 12.5px 0px;
  }
  #template-desc{
    font-size: 14px;
  }
  div.md-toolbar {
    justify-content: flex-end;
    align-items: center;
  }
  .toolbar-input {
    background-color: white;
    margin: 10px;
  }
  .overview-wrapper{
    text-align: center;
    max-width: 1060px;
    margin: 0 auto;
  }
  .auswahlmenü{
    text-align: right;
    float: right;
  }
</style>
