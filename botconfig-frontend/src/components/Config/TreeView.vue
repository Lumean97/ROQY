<template>
  <div id="list-container" >
    <div @click="select(index)" class="block-container" :class="{'selected' : isSelected(index), 'primary' : isPrimarySelection(index)}" v-for="(block, index) in group" :key="block.id">
      <span>{{blocks[block.block].title}}</span>
    </div>
    <div v-if="hasNewButton()" @click="addNew()" class="block-container">
      <span class="newText">New block</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['group', 'row', 'blocks', 'selected', 'rowSelect'],
  methods: {
    isSelected (index) {
      return this.$props.selected === index
    },
    select (index) {
      this.$emit('selection-changed', index)
    },
    isPrimarySelection (index) {
      return this.rowSelect === this.row
    },
    hasNewButton () {
      return this.rowSelect === this.row || this.rowSelect + 1 === this.row
    },
    addNew () {
      this.$emit('addNew')
    }
  }
}
</script>

<style scoped>
  #list-container {
    height: 500px;
    width: 200px;
    display: inline-block;
    vertical-align: top;
  }
  .block-container {
    height: 40px;
    padding: 7px;
    font-family: Roboto;
    border-bottom: 1px #E0E0E0 solid;
  }

  .block-container:hover {
    background-color: #f5f5f5;
  }

  .selected {
     background-color: #eeeeee;
  }

  .selected.primary {
    background-color: #cccccc;
  }

  .newText {
    color: orange;
  }
</style>
