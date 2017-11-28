<template>
  <div id="conf-wrapper">
    <div id="leftside">
      <div id="group-wrapper">
        <group-view :group="groups" :blocks="blocks" :selected="rootSelect" class="wrapper"></group-view>
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
      rootSelect: 1,
      blocks: [
        {
          id: 0,
          title: 'Geschenkbestellung'
        },
        {
          id: 1,
          title: 'Rechtzeitige Lieferung'
        },
        {
          id: 2,
          title: 'Rückgabe & Reklamation'
        }
      ],
      groups: [
        {
          block: 1,
          children: [
            {
              block: 0,
              children: []
            }
          ]
        },
        {
          block: 2,
          children: []
        }
      ]
    }
  },
  components: {
    blockConfig, blockView, groupView
  }
}
</script>

<style scoped>
#conf-wrapper {
  display: flex;
  height: 830px;
}
#group-wrapper {
  height: 80%;
  padding: 25px;
}

.block-wrapper {
  height: 20%;
}

#leftside {
  width: 60%;
  height: 100%;
}

.wrapper {
  background-color: white;
  box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)
}

.block-config-wrapper {
  height: 100%;
  flex: 1;
}
</style>