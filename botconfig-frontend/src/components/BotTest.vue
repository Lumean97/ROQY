<template>
  <div id="test">
    <div id="test-header">
      <div style="margin-right:20px;">
        <button class="button-top" @click="goback()">{{$lang.translate.test.back}}</button>
        <button class="button-top" @click="goforward()">{{$lang.translate.test.forward}}</button>
      </div>
    </div>

    <div id="test-title">
      <h2>{{$lang.translate.test.title}}</h2>
    </div>

    <div v-if="loaded" id="test-card" class="default-shadow">
      <div class="card-header">
            <img src="../assets/bot_orange.svg">
            <h3 id="title">{{bot.name}}</h3>
      </div>
      <div id="card-content">
        <div 
        v-for="(message, messages) in messages" 
        :key="message.message"
        :class="{'message-right': isUser(message.sender), 'message-left': !isUser(message.sender)}">
          <span>{{message.message}}</span>
        </div>
      </div>
      <div class="card-footer">
        <div class="footer-content">
          <input type="message" placeholder="write a message" v-model="message" @keyup.enter="addMessage()"/>
          <button class="button-buttom" @click="addMessage()">send</button>
        </div>
        <div style="clear:both"></div>
      </div>
    </div>    
  </div>
</template>

<script>
import api from '../api/botData'

export default {
  name: 'test',
  props: ['id'],
  data () {
    return {
      message: null,
      messages: [],
      bot: null,
      currentNode: null,
      loaded: false
    }
  },
  created () {
    this.loadBot()
  },
  methods: {
    addMessage () {
      if (this.message !== null) {
        let mess = {
          sender: 'user',
          message: this.message
        }
        this.messages.push(mess)
        this.message = null
        this.scrollToEnd()
        this.getmessage(mess.message)
      }
    },
    scrollToEnd () {
      var container = this.$el.querySelector('#card-content')
      container.scrollTop = container.clientHeight
    },
    getmessage (userMsg) {
      let mess = {
        sender: 'agent',
        message: ''
      }

      let config = this.bot.config
      if (this.currentNode === null) {
        this.currentNode = config.groups
      }

      mess.message = this.selectNextNode(userMsg)

      this.messages.push(mess)
      this.scrollToEnd()
    },
    isUser (sender) {
      return sender === 'user'
    },
    getBlockById (id) {
      for (const block of this.bot.config.blocks) {
        if (block.id === id) {
          return block
        }
      }

      return null
    },
    selectNextNode (usrMsg) {
      for (const child of this.currentNode) {
        let block = this.getBlockById(child.block)
        for (const question of block.questions) {
          if (question.toLowerCase() === usrMsg.toLowerCase()) {
            this.currentNode = child.children
            return block.answer
          }
        }
      }
    },
    goback () {
      this.$router.push({name: 'config', params: {id: this.id}})
    },
    goforward () {
      this.$router.push('/bots')
    },
    loadBot () {
      api.getBot(this.id)
      .then((data) => {
        this.loaded = true
        this.bot = data
      })
      .catch((err) => {
        console.error(err)
        alert('Could not load bot from server please try again.')
      })
    }
  }
}
</script>

<style scoped>
#test {
  min-width: 463px;
}
#test-header {
  padding: 3px;
  display: flex;
  flex-direction: row-reverse;
}
#test-title {
  text-align: center;
  font-size: 25px;
}
#test-card {
  width: 40%;
  min-height: 560px;
  max-height: 560px;
  margin: 3% auto;
  border: 2px solid grey;
  border-radius: 3px;
}
.card-header {
  width: 100%;
  background-color: white;
  height: 60px;
  padding: 10px;
  border-bottom: 2px solid grey;
}
img {
  width : 40px;
  height: 40px;
  margin-left: 4px;
}
#title {
  display: inline;
  margin-left: 10px;
}
#card-content {
  width: 100%;
  background-color: white;
  height: 435.5px;
  text-align: center;
  padding: 10px;
  overflow-x: auto;
}
.card-footer {
  width: 100%;
  background-color: white;
  height: 60px;
  text-align: center;
  padding: 10px;
  border-top: 1.5px solid grey;
}
input {
  border: 1.5px solid grey;
  padding: 5px 14px;
  margin-top: 2px;
  margin-right: 2px;
  border-radius: 4px;
  max-width: 70%;
  min-width: 70%;
  overflow-wrap: break-word
}
.button-top {
  background-color: orange;
  border: 1.5px solid grey;
  color: white;
  padding: 5px 14px;
  border-radius: 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
  margin-top: 2px;
  margin-right: 3px;
}
.button-buttom {
  background-color: orange;
  border: 1.5px solid grey;
  color: white;
  padding: 5px 14px;
  border-radius: 7px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
  float:right;
  margin-top: 2px;
  margin-right: 3%;
}
.message-right {
  background-color: ##58B8DD;
  max-width: 45%;
  border-radius: 10px;
  padding: 6px 7px;
  margin-bottom: 6px;
  margin-left: auto;
  overflow-wrap: break-word;
}
.message-left {
  background-color: #F8BC16;
  max-width: 45%;
  border-radius: 20px;
  padding: 6px 7px;
  margin-bottom: 6px;
  overflow-wrap: break-word;
}
@media only screen and (max-width: 800px){
  #test-card {
    width: 70%;
  }
  .message-right, .message-left {
    max-width: 70%;
  }
}
</style>
