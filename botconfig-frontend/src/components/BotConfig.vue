<template>
  <div id="conf-wrapper">
    <div id="leftside">
      <div id="group-wrapper">
        <tree-view :row="index" v-for="(group,index) in subGroups" :rowSelect="rowSelect" :key="group.block" v-on:selection-changed="selectSubTree(index,$event)" v-on:addNew="addNewBlock(index)" :group="group.children" :blocks="blocks" :selected="group.selection" class="wrapper"></tree-view>
      </div>
      <div class="block-wrapper wrapper">
        <block-view :blocks="favorites"></block-view>
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
      rootSelect: -1,
      blockIDCount: 0,
      blocks: [ ],
      groups: [ ]
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
      let groups = []
      let current = {'block': -1, 'selection': this.rootSelect, 'children': this.groups}

      while (current !== undefined && current.children.length !== 0) {
        groups.push(current)
        if (current.selection === -1) {
          break
        }
        current = current.children[current.selection]
      }

      if (current.children.length === 0) {
        groups.push({'block': -1, 'selection': -1, 'children': []})
      }

      return groups
    },
    /**
    * Return all blocks that are marked as favorites
    */
    favorites () {
      let favs = []
      this.blocks.forEach(block => {
        if (block.isFavorite === true) {
          favs.push(block)
        }
      })

      return favs
    }
  },
  methods: {

    /**
    * Selects a node in the tree where groupID is the row and blockID the column
    */
    selectSubTree (groupID, blockID) {
      this.rowSelect = groupID
      var selection = null
      if (groupID === 0) {
        this.rootSelect = blockID
        selection = this.groups[this.rootSelect]
      } else {
        var group = this.subGroups[groupID]
        group.selection = blockID
        if (group.selection !== -1 && group.children.length !== 0) {
          selection = group.children[group.selection]
        }
      }

      // Clear selection of child node
      if (selection !== null) {
        selection.selection = -1
      }
    },
    /**
    * Adds a new block to row defined by groupID
    */
    addNewBlock (groupID) {
      let block = {title: this.$lang.translate.config.unnamedBlock, id: this.blockIDCount++, isFavorite: false}
      this.blocks.push(block)
      if (groupID === 0) {
        this.groups.push({'block': block.id, 'selection': -1, 'children': []})
      } else {
        let grandparent = this.subGroups[groupID - 1]
        let parent = grandparent.children[grandparent.selection]
        parent.children.push({'block': block.id, 'selection': -1, 'children': []})
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