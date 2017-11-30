<template>
<div id="blockConfig">
  <div id="header">
    <h2>{{block.name}}</h2>
  </div>
  <div class='wrapper'>
    <div class='question margin'>
    <div>
      <h4>{{$lang.translate.config.question}}</h4>
    </div>
    
    <div class='block-wrapper'>
      <div class='block' v-for="(question,block) in block.questions">
        <span>{{question}}</span>
      </div>
    </div>
   
  </div>
  <div class='answer margin'>
        <div>
            <h4 >{{$lang.translate.config.answer}}</h4>
        </div>
        
        <div class='block-wrapper'>
            <ul  v-for="(answer,block) in block.answers">
                <li>{{answer}}</li>
            </ul>
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
          'I have a question'
        ],
        answers: [
          'Weihnachteinkäufe',
          'Versand & Zustellung',
          'Rückgabe & Reklamation',
          'Bezahlung & Rechnung'
        ]
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
    padding: 5%;
    background-color: gray;
    margin: 0;
}
#header>h2 {
    margin-left: 10%;
}
.wrapper {
    padding: 2% 10%;
}
.block {
    
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
}
ul {
    padding-left: 30px;
}
</style>
