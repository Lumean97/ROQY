<template>
  <div>
    <div class="header-wrapper">
      <h2>{{$lang.translate.config.favoriteBlocks}}</h2>
      <h4>{{$lang.translate.config.favoriteHint}}</h4>
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
    display: inline-block;
    padding: 7px;
    margin: 5px;
    cursor: grab;
  }

  .rounded {
    border-radius: 15px;
    padding: 0;
  }

  .header-wrapper {
    width: 100%;
    padding: 5px;
    margin: 5px;
  }

  .default-btn {
    background-color: orange;
    border-radius: 16px;
    padding: 5px;
    margin: 10px;
    color: white;
    font-family: Roboto;
    font-size: 14px;
  }

  .default-btn {
    background-color: orange;
    border-radius: 16px;
    padding: 5px;
    margin: 10px;
    color: white;
    font-family: Roboto;
    font-size: 14px;
  }
</style>
