<template>
  <div v-if="isBlockSelected" id="blockConfig">

    <div id="header">
      <div>
        <button v-on:click="favoriteBot()" class="default-btn">{{$lang.translate.config.favorite}}</button>
         <button v-on:click="deleteBot()" class="default-btn">{{$lang.translate.config.delete}}</button>
      </div>
      <div class='rightSite'>
        <button v-on:click="testBot()" class="default-btn">{{$lang.translate.config.test}}</button>
        <button v-on:click="saveData()" class="default-btn">{{$lang.translate.config.save}}</button>
      </div>
      <input v-model="title"></input>
    </div>

    <div class='wrapper'>
      <div class='question margin'>
      <div>
        <h4>{{$lang.translate.config.question}}</h4>
      </div>
      
      <div class='row'>
        <div class='block-wrapper'>
          <div class='block' v-for="(question,index) in block.questions" :key="index">
              <span>{{question}}</span>
              <md-button  class="md-icon-button  md-mini md-dense" v-on:click='deleteQuestion(question)'>
                <md-icon>delete</md-icon>
              </md-button>
          </div>
          <div>
              <input v-model='question' :placeholder='$lang.translate.config.add' name='newBlock' @keyup.enter='addNewQuestion()'/>
          </div>
        </div>
      </div>
      
    </div>
    <div class='answer margin'>
      <div>
        <h4 >{{$lang.translate.config.answer}}</h4>
      </div>
      
      <div class='block-wrapper'>
        <textarea v-model="answer"></textarea>
      </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: 'blockConfig',
  props: ['block'],
  data () {
    return {
      question: ''
    }
  },
  methods: {
    addNewQuestion () {
      if (this.question !== '') {
        this.$emit('newQuestion', this.question)
        this.question = ''
      }
    },
    deleteQuestion (question) {
      this.$emit('deleteQuestion', question)
    },
    addNewAnswer () {
      if (this.answer.length !== 0) {
        this.$emit('newAnswer', this.answer)
        this.answer = ''
      }
    },
    saveData () {
      this.$emit('saveData')
    },
    testBot () {
      this.$emit('testBot')
    },
    favoriteBot () {
      this.$emit('favorite')
    },
    deleteBot () {
      this.$emit('delete')
    }
  },
  computed: {
    isBlockSelected () {
      return this.block !== undefined && this.block !== null
    },
    answer: {
      get () {
        return this.block.answer
      },
      set (answer) {
        this.$emit('setAnswer', answer)
      }
    },
    title: {
      get () {
        return this.block.title
      },
      set (title) {
        this.$emit('setTitle', title)
      }
    }
  }
}
</script>

<style scoped>
#blockConfig {
  width: 100%;
  height: 100%;
}
#header {
  width: 100%;
  padding: 2%;
  background-color: gray;
  margin: 0;
  display: flex;
  flex-direction: row-reverse;
}
#header>h2 {
  margin-top: 2.5%;
  margin-left: 10%;
  margin-right: 40%;
}
.row {
  width: 100%;
}
.wrapper {
  padding: 2% 10%;
}
.block {
  text-align: center;
  line-height: 30px;
  border-radius: 15px;
  max-width: 100%;
  display: inline-block;
  padding: .9%;
  margin: .5%;
  cursor: pointer;
  background-color: #76bbed;
  color: white;
}
.question {
  width: 100%;
}
.answer {
  width: 100%;
}
.margin {
  margin-top: 6%;
}
.block-wrapper {
  border: 2px solid gray;
  border-radius: 4px;
  padding: 2%;
  margin-top: 1.5%;
  min-height: 300px;
  max-height: 300px;
  overflow: auto;
}
ol {
  padding-left: 10%;
}
input {
  border-bottom: 2px solid #76bbed;
  min-width: 40%;
  max-width: 100%;
  margin-top: 5%;
}
input :focus {
  border: none;
}
.innerQuestion {
  margin: 3% 2%;
}
.innerQuestion>span {
  font-weight: bold;
}
.rightSite {
  display: block;
}
.default-btn {
  background-color: orange;
  border-radius: 16px;
  padding: 2% 6%;
  margin-bottom:1%;
  color: white;
  font-family: Roboto;
  font-size: 14px;
  text-align: center;
  min-width: 80%;
}
</style>
