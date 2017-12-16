<template>
  <div class="card-wrapper">
    <md-card style="border-radius:6px;" class="md-with-hover">
      <div>
        <div class="header">
          <md-switch v-if="parent === 'overview'" style="margin: 10px 0 0 0" class="md-primary" v-on:change="changeBot(botData)" v-model="isRunning"></md-switch>
          <md-menu  md-direction="bottom left">
            <md-button v-if="parent === 'overview'" style="padding:0;margin-top:-10px;color: 7F7F7F" class="md-icon-button header-menu-btn" md-menu-trigger>
              <md-icon>more_vert</md-icon>
            </md-button>
            <md-button v-if="parent === 'marketplace'" style="padding:0;margin-top:10px;color: 7F7F7F" class="md-icon-button header-menu-btn" md-menu-trigger>
              <md-icon>more_vert</md-icon>
            </md-button>

            <md-menu-content  v-if="parent === 'overview'">
                <md-menu-item v-on:click="openDialog(confirm.ref3)">
                <span >{{$lang.translate.info.upload}}</span>
              </md-menu-item>
              <md-menu-item id="#renameconfirm" v-on:click="openDialog(confirm.ref2)">
                <span >{{$lang.translate.info.rename}}</span>
              </md-menu-item>
              <md-menu-item id="confirm" v-on:click="openDialog(confirm.ref1)">
                <span >{{$lang.translate.info.delete}}</span>            
              </md-menu-item>
              <md-menu-item v-if="isConfigurable">
                <router-link :to="{ name: 'config', params: {id: botData.id}}">
                  <span>{{$lang.translate.info.setting}}</span>
                </router-link>
              </md-menu-item>
            </md-menu-content>
            <md-menu-content v-if="parent === 'marketplace'">
              <md-menu-item id="confirm" v-on:click="openDialog(confirm.ref4)">
                <span >{{$lang.translate.marketplace.download}}</span>            
              </md-menu-item>
            </md-menu-content>
          </md-menu>
        </div>
      </div>
      <div id="imgwrapper">
        <img style="width:180px" :src="botImage" :alt="botData.name">
      </div>

      <div class="info-wrapper">
        <h6 style="font-size:16px;font-weight:400;">{{botData.name}}</h6>
        <span :style="{ color: typeColor}" class="typeText" >{{botData.botType}}</span>
        <span>
          {{botData.description}}
        </span>
      </div>
    </md-card>
    
    <md-dialog md-open-from="#confirm" md-close-to="#confirm" ref='dialog1'>
      <md-dialog-title>{{$lang.translate.info.title}}</md-dialog-title>

      <md-dialog-content>{{$lang.translate.info.contentHtml}}</md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" v-on:click="closeDialog(confirm.ref1)"> {{$lang.translate.info.cancel}}</md-button>
        <md-button class="md-primary" v-on:click="deleteItem()">{{$lang.translate.info.ok}}</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-dialog md-open-from="#renameconfirm" md-close-to="#renameconfirm" ref='dialog2'>
      <md-dialog-title>{{$lang.translate.info.renameTitle}}</md-dialog-title>

      <md-dialog-content><md-input-container>
        <label{{$lang.translate.creater.new_name}}</label>
          <md-input v-model="newName" placeholder="New Name"   required></md-input>
        </md-input-container>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" v-on:click="closeDialog(confirm.ref2)">{{$lang.translate.info.cancel}}</md-button>
        <md-button class="md-primary" :disabled='!isValid' v-on:click="renameItem()">{{$lang.translate.info.rename}}</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-dialog md-open-from="#marketplace" md-close-to="#marketplace" ref='dialog3'>
      <md-dialog-title>{{$lang.translate.info.marketplaceInnerBubble}}</md-dialog-title>

      <md-dialog-actions>
        <md-button class="md-primary" v-on:click="closeDialog(confirm.ref3)">{{$lang.translate.info.cancel}}</md-button>
        <md-button class="md-primary" v-on:click="uploadBot()">{{$lang.translate.info.upload}}</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-dialog md-open-from="#marketplace" md-close-to="#marketplace" ref='dialog4'>
      <md-dialog-title>{{$lang.translate.marketplace.title}}</md-dialog-title>

      <md-dialog-actions>
        <md-button class="md-primary" v-on:click="closeDialog(confirm.ref4)">{{$lang.translate.info.cancel}}</md-button>
        <md-button class="md-primary" v-on:click="downloadBot()">{{$lang.translate.marketplace.download}}</md-button>
      </md-dialog-actions>
    </md-dialog>

  </div>
      
</template>

<script>
import 'vue-material/dist/vue-material.css'
import botWelcome from '../assets/bot_orange.svg'
import botFaq from '../assets/bot_violett.svg'
import api from '../api/botData'

export default {
  props: ['botData', 'parent'],
  data () {
    return {
      newName: '',
      confirm: {
        title: 'Do you want to delete this Bot ?',
        renameTitle: 'Write the new name of your bot !',
        contentHtml: 'This bot will be on database deleted, if you confirm it, there is no way to back it up.',
        ok: 'Delete',
        rename: 'Rename',
        cancel: 'Cancel',
        ref1: 'dialog1',
        ref2: 'dialog2',
        ref3: 'dialog3',
        ref4: 'dialog4'
      },
      isValid: false,
      aktiv: false
    }
  },
  computed: {
    /**
    * change bot.status text to uppercase
    */
    isRunning () {
      return this.botData.status.toUpperCase() === 'RUNNING'
    },
    /**
    * If selected Bot is welcome then use Welcome-Bot Image else Faq-Bot image
    */
    botImage () {
      return this.botData.botType === 'welcome' ? botWelcome : botFaq
    },
    /**
    * If selected Bot is welcome then use orange color for botType else purple
    */
    typeColor () {
      return this.botData.botType === 'welcome' ? 'orange' : 'purple'
    },
    isConfigurable () {
      if (this.botData.id !== undefined && this.botData.status !== 'running') {
        return true
      }
      return false
    }
  },
  watch: {
    /**
    * Method to check if newName input is filled
    * @param newName input field from Rename Dialog, check if input is not empty
    */
    newName () {
      if (this.newName.length !== 0) {
        this.isValid = true
      }
    }
  },
  methods: {
    /**
    * Method to delete the selected Bot
    */
    deleteItem () {
      this.$store.dispatch('deleteBot', this.botData)
      this.closeDialog(this.confirm.ref1)
    },
    /**
    * Method to turn on/off the selected Bot
    */
    changeBot () {
      this.$store.dispatch('changeStatus', this.botData)
    },
    /**
    * Method to rename the selected Bot
    */
    renameItem () {
      this.$store.dispatch('renameBot', [this.botData, {
        name: this.newName}])
      this.closeDialog(this.confirm.ref2)
      this.newName = ''
      this.isValid = false
    },
    /**
    * Method to open pop up window
    * @param ref dialog that should be open
    */
    openDialog (ref) {
      this.$refs[ref].open()
    },
    /**
    * Method to close open pop up window
    * @param ref dialog that should be open
    */
    closeDialog (ref) {
      this.$refs[ref].close()
    },
    /**
    * Method to upload the selected Bot to the marketplace by
    * changing current privacy to public
    */
    uploadBot () {
      this.closeDialog(this.confirm.ref3)
      api.uploadBot(this.botData)
      .then((response) => {
        this.$router.push('/marketplace')
      })
      .catch((error) => {
        alert(error.message)
      })
    },
    downloadBot () {
      api.addNewBot(
        this.botData
      )
      .then((response) => {
        this.$router.push('/bots')
      })
      .catch((err) => {
        console.log(err.message)
        alert('dont ask me why')
      })
      this.closeDialog(this.confirm.ref4)
    }
  }
}
</script>

<style scoped>
  .card-wrapper{
    display: inline;
    margin: 14px;
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
    font-size:11px;
    display: block;
    text-transform: uppercase;
  }
  .md-dialog {
    padding: 20px;
  }
  
</style>
