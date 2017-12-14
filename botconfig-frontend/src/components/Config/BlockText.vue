<template>
  <div contenteditable="true" @input="update"></div>
</template>

<script>
export default {
  name: 'blocktext',
  props: ['content'],
  mounted () {
    this.$el.innerText = this.content
  },
  methods: {
    update (event) {
      this.$emit('update', event.target.innerText)
    }
  }
}
</script>
<style scoped>
div {
  min-height: 260px;
  padding: 5px;
}
</style>