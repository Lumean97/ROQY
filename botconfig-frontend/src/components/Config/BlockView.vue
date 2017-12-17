<template>
  <div>
    <div class="header-wrapper">
      <h2>{{$lang.translate.config.favoriteBlocks}}</h2>
      <h4>{{$lang.translate.config.favoriteHint}}</h4>
    </div>
    <div class="default-shadow blockBubble" v-for="(block, blocks) in blocks" :key="block.id">
      <span>{{block.title}}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['blocks'],
  methods: {
  }
}
</script>

<style scoped>
  .blockBubble {
    line-height: 30px;
    border-radius: 15px;
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
