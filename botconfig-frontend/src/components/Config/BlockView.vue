<template>
  <div>
    <div class="button-wrapper">
      <md-button class="md-raised md-primary rounded">new block</md-button>
      <md-button class="md-raised md-primary rounded">new group</md-button>
    </div>
    <div class="blockBubble" v-for="(block, blocks) in blocks" :key="block.id">
      <span>{{block.title}}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['blocks']
}
</script>

<style scoped>
  .blockBubble {
    line-height: 30px;
    border-radius: 15px;
    box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12);
    display: inline;
    padding: 7px;
    margin: 5px;
  }

  .rounded {
    border-radius: 15px;
    padding: 0;
  }

  .button-wrapper {
    width: 100%;
    display: flex;
    flex-direction: row-reverse;
  }
</style>
