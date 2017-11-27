<template>
  <div class="conf-wrapper">
    <div class="leftside">
      <div class="group-wrapper">
        <group-view class="wrapper"></group-view>
      </div>
      <div class="block-wrapper wrapper">
        <block-view :blocks="blocks"></block-view>
      </div>
    </div>
    <div class="block-config-wrapper wrapper">
      <block-config></block-config>
      <p>Test</p>
    </div>
  </div>
</template>

<script>
import 'vue-material/dist/vue-material.css'
import blockConfig from './Config/BlockConfig.vue'
import blockView from './Config/BlockView.vue'
import groupView from './Config/GroupView.vue'

export default {
  data: function () {
    return {
      blocks: [
        {
          id: 0,
          title: 'Geschenkbestellung'
        },
        {
          id: 1,
          title: 'Rechtzeitige Lieferung'
        }
      ]
    }
  },
  computed: {
    groups () {
      let groups = []
      this.blocks.forEach((block, index, a) => {
        groups.push(block)
      })

      return groups
    }
  },
  components: {
    blockConfig, blockView, groupView
  }
}
</script>

<style scoped>
.conf-wrapper {
  display: block;
  width: 100%;
  height: 700px;
  overflow: hidden;
}
.group-wrapper {
  height: 80%;
}

.block-wrapper {
  height: 20%;
}

.leftside {
  width: 60%;
  height: 100%;
  display: inline-block;
}

.wrapper {
  background-color: white;
  box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)
}

.block-config-wrapper {
  width: 25%;
  height: 100%;
  display: inline-block;
}
</style>