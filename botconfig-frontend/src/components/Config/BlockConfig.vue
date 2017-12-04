<template>
  <div id="blockConfig">

    <div id="header">
      <div class='rightSite'>
        <button @click='testBot()'class="default-btn">{{$lang.translate.config.test}}</button>
        <button v-on:click='saveData()' class="default-btn">{{$lang.translate.config.save}}</button>
      </div>
      <h2>{{block.name}}</h2>
    </div>

    <div class='wrapper'>
      <div class='question margin'>
      <div>
        <h4>{{$lang.translate.config.question}}</h4>
      </div>
      
      <div class='row'>
        <div class='block-wrapper'>
          <div class='block' v-for="(question,block) in block.questions">
              <span>{{question}}</span>
              <md-button  class="md-icon-button  md-mini md-dense" v-on:click='deleteQuestion(question)'>
                <md-icon>delete</md-icon>
              </md-button>
          </div>
          <div>
              <input v-model='question' :placeholder='$lang.translate.config.add' name='newBlock' @keyup.enter='addNewBlock()'/>
          </div>
        </div>
      </div>
      
    </div>
    <div class='answer margin'>
      <div>
        <h4 >{{$lang.translate.config.answer}}</h4>
      </div>
      
      <div class='block-wrapper'>
        <div class='innerQuestion'>
          <span>{{$lang.translate.config.innerBox}}</span>
        </div>
        <ol>
          <li v-for="(answer,block) in block.answers">{{answer}}</li>
        </ol>
        <div>
          <input v-model='answer' :placeholder='$lang.translate.config.add' name='newBlock' @keyup.enter='addNewAnswer()'/>
        </div>
      </div>
      </div>
    </div>


  </div>

</template>

<script>
export default {
  name: 'blockConfig',
  data () {
    return {
      block: {
        name: 'Question',
        questions: [
          'I have a problem',
          'I have a question',
          'I have a problem',
          'I have a question'
        ],
        answers: [
          'Weihnachteinkäufe',
          'Versand & Zustellung',
          'Rückgabe & Reklamation',
          'Bezahlung & Rechnung',
          'Weihnachteinkäufe',
          'Weihnachteinkäufe',
          'Versand & Zustellung',
          'Rückgabe & Reklamation',
          'Bezahlung & Rechnung',
          'Weihnachteinkäufe',
          'Weihnachteinkäufe',
          'Versand & Zustellung',
          'Rückgabe & Reklamation',
          'Bezahlung & Rechnung',
          'Weihnachteinkäufe',
          'Weihnachteinkäufe',
          'Versand & Zustellung',
          'Rückgabe & Reklamation',
          'Bezahlung & Rechnung',
          'Weihnachteinkäufe'
        ]
      },
      question: '',
      answer: ''
    }
  },
  methods: {
    addNewBlock () {
      if (this.question !== '') {
        this.block.questions.push(this.question)
        this.question = ''
      }
    },
    deleteQuestion (question) {
      this.block.questions.splice(this.block.questions.indexOf(question), 1)
    },
    addNewAnswer () {
      if (this.answer.length !== 0) {
        this.block.answers.push(this.answer)
        this.answer = ''
      }
    },
    saveData () {
      this.$emit('saveData')
    },
    testBot () {
      this.$emit('testBot')
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
  padding: 2px 4px;
  margin-bottom:3px;
  color: white;
  font-family: Roboto;
  font-size: 14px;
  text-align: center;
  min-width: 80%;
}
</style>
