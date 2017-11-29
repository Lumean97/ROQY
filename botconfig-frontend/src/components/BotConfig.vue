<template>
  <div id="conf-wrapper">
    <div id="leftside">
      <div id="group-wrapper">
        <tree-view :row="index" v-for="(group,index) in subGroups" :rowSelect="rowSelect" :key="group.block" v-on:selection-changed="selectSubTree(index,$event)" :group="group.children" :blocks="blocks" :selected="group.selection" class="wrapper"></tree-view>
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
import treeView from './Config/TreeView.vue'

export default {
  data: function () {
    return {
      rowSelect: -1,
      rootSelect: 2,
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
          selection: 0,
          block: 1,
          children: [
            {
              selection: 0,
              block: 0,
              children: [
                {
                  selection: 0,
                  block: 2,
                  children: []
                }
              ]
            }
          ]
        },
        {
          selection: 0,
          block: 2,
          children: [
            {
              selection: 0,
              block: 1,
              children: []
            },
            {
              selection: 0,
              block: 2,
              children: []
            }
          ]
        },
        {
          selection: -1,
          block: 2,
          children: [
            {
              selection: 0,
              block: 1,
              children: []
            },
            {
              selection: 0,
              block: 2,
              children: []
            }
          ]
        }
      ]
    }
  },
  components: {
    blockConfig, blockView, treeView
  },
  computed: {
    /**
     * Returns all groups that are currently selected in the tree
     */
    subGroups () {
      if (this.groups.length === 0) {
        return []
      }

      var groups = []
      var current = {'block': -1, 'selection': this.rootSelect, 'children': this.groups}
      while (current !== undefined && current.children.length !== 0) {
        groups.push(current)
        current = current.children[current.selection]
      }

      return groups
    }
  },
  methods: {
    selectSubTree (groupID, blockID) {
      this.rowSelect = groupID
      if (groupID === 0) {
        console.log('set root selection : ' + groupID)
        this.rootSelect = blockID
      } else {
        this.subGroups[groupID].selection = blockID
      }
    }
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