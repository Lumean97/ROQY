<template>
  <div class="card-wrapper">
    <md-card style="border-radius:6px;" class="md-with-hover" >
      <div>
        <div class="header">
          <md-switch style="margin: 10px 0 0 0" class="md-primary"></md-switch>
          <md-menu  md-direction="bottom left">
            <md-button style="padding:0;margin-top:-10px;color: 7F7F7F" class="md-icon-button header-menu-btn" md-menu-trigger>
              <md-icon>more_vert</md-icon>
            </md-button>

            <md-menu-content>
                <md-menu-item v-on:click="openDialog(confirm.ref3)">
                <span >{{$lang.translate.info.upload}}</span>
              </md-menu-item>
              <md-menu-item id="#renameconfirm"  v-on:click="openDialog(confirm.ref2)">
                <span >{{$lang.translate.info.rename}}</span>
              </md-menu-item>
              <md-menu-item id="confirm" v-on:click="openDialog(confirm.ref1)">
                <span >{{$lang.translate.info.delete}}</span>            
              </md-menu-item>
              <router-link v-if="botData.id" tag="md-menu-item" :to="{ name: 'config', params: {id: botData.id}}">
                <span>{{$lang.translate.info.setting}}</span>
              </router-link>
            </md-menu-content>
          </md-menu>
        </div>
      </div>
      <div id="imgwrapper">
        <img src="../assets/bot.png" :alt="botData.name">
      </div>

      <div class="info-wrapper">
        <h6 style="font-size:16px;font-weight:400;">{{botData.name}}</h6>
        <span style="font-size:10px;color: purple;display: block;">!!Placeholder!! {{botData.template}}</span>
        <span>
          {{botData.description}}
        </span>
      </div>
    </md-card>

    <md-dialog md-open-from="#confirm" md-close-to="#confirm" ref='dialog3'>
      <md-dialog-title>{{$lang.translate.info.marketplaceInnerBubble}}</md-dialog-title>

      <md-dialog-actions>
        <md-button class="md-primary" v-on:click="closeDialog(confirm.ref3)"> {{$lang.translate.info.cancel}}</md-button>
        <md-button class="md-primary" v-on:click="uploadBot(botData)">{{$lang.translate.info.upload}}</md-button>
      </md-dialog-actions>
    </md-dialog>
    
    <md-dialog md-open-from="#confirm" md-close-to="#confirm" ref='dialog1'>
      <md-dialog-title>{{$lang.translate.info.title}}</md-dialog-title>

      <md-dialog-content>{{$lang.translate.info.contentHtml}}</md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" v-on:click="closeDialog(confirm.ref1)"> {{$lang.translate.info.cancel}}</md-button>
        <md-button class="md-primary" v-on:click="deleteItem(botData)">{{$lang.translate.info.ok}}</md-button>
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
        <md-button class="md-primary" :disabled='!isValid' v-on:click="renameItem(botData)">{{$lang.translate.info.rename}}</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
      
</template>

<script>
import 'vue-material/dist/vue-material.css'

export default {
  props: ['botData'],
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
        ref3: 'dialog3'
      },
      isValid: false,
      aktiv: false
    }
  },
  watch: {
    newName () {
      if (this.newName.length !== 0) {
        this.isValid = true
      }
    }
  },
  methods: {
    deleteItem (item) {
      this.$store.dispatch('deleteBot', item)
      this.closeDialog(this.confirm.ref1)
    },
    changeBot (item) {
      this.$store.dispatch('changeStatus', item)
    },
    renameItem (item) {
      this.$store.dispatch('renameBot', [item, {
        name: this.newName}])
      this.closeDialog(this.confirm.ref2)
      this.newName = ''
      this.isValid = false
    },
    openDialog (ref) {
      this.$refs[ref].open()
    },
    closeDialog (ref) {
      this.$refs[ref].close()
    },
    uploadBot (item) {
      this.$store.dispatch('addNewMarketplace', {
        name: this.botname,
        image: '../assets/bot.png',
        status: 'offline',
        description: this.description
      })
      this.$router.push('/marketplace')
      this.closeDialog(this.confirm.ref3)
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
</style>
