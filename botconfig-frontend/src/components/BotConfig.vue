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
      <block-config v-on:setTitle="setBlockTitle(selectedBlock.id, $event)" v-on:newQuestion="blockAddQuestion(selectedBlock.id, $event)" v-on:setAnswer="setAnswer(selectedBlock.id,$event)" v-on:deleteQuestion="blockRemoveQuestion(selectedBlock.id,$event)" v-on:favorite="favoriteBlock(selectedBlock.id)" v-on:delete="deleteSelected()" v-on:saveData="saveData()" v-on:testBot="testBot()" :block="selectedBlock"></block-config>
    </div>
  </div>
</template>

<script>
import 'vue-material/dist/vue-material.css'
import blockConfig from './Config/BlockConfig.vue'
import blockView from './Config/BlockView.vue'
import treeView from './Config/TreeView.vue'
import axios from 'axios'

export default {
  props: ['id'],
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
    },
    /**
     * Workaround for translate not working in tests. Used to stub the translation.
     */
    defaultTitle () {
      return this.$lang.translate.config.unnamedBlock
    },
    /**
     * Return the currently selected block or null if there is no selected block
     */
    selectedBlock () {
      if (this.rowSelect === -1 || this.subGroups[this.rowSelect].selection === -1) {
        return null
      }

      let select = this.subGroups[this.rowSelect].selection
      return this.getBlock(this.subGroups[this.rowSelect].children[select].block)
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
    * Adds a new block to row defined by groupID and returns its new id
    */
    addNewBlock (groupID) {
      let block = {title: this.defaultTitle, id: this.blockIDCount++, isFavorite: false, questions: [], answer: ''}
      this.blocks.push(block)
      if (groupID === 0) {
        this.groups.push({'block': block.id, 'selection': -1, 'children': []})
      } else {
        let grandparent = this.subGroups[groupID - 1]
        let parent = grandparent.children[grandparent.selection]
        parent.children.push({'block': block.id, 'selection': -1, 'children': []})
      }

      return block.id
    },
    /**
     * Removes a block
     */
    removeBlock (groupID, index) {
      // TODO : Destroy all Orphans (or just delete them)
      if (groupID === 0) {
        this.rootSelect = Math.min(this.rootSelect, index - 1)
        this.groups.splice(index, 1)
      } else {
        this.subGroups[groupID].selection = Math.min(this.subGroups[groupID].selection, index - 1)
        this.subGroups[groupID].children.splice(index, 1)
      }
    },
    /**
     * Removes the currently select block
     */
    deleteSelected () {
      let select = this.subGroups[this.rowSelect].selection
      this.removeBlock(this.rowSelect, select)
    },
    /**
     * Returns the block with the given blockID or null if not found
     */
    getBlock (blockID) {
      for (const block of this.blocks) {
        if (block.id === blockID) {
          return block
        }
      }

      return null
    },
    /*
     * Adds the block to favorites
     */
    favoriteBlock (blockID, setFavorite = true) {
      let block = this.getBlock(blockID)
      if (block !== null) {
        block.isFavorite = setFavorite
      }
    },
    /**
     * Changes a blocks title
     */
    setBlockTitle (blockID, title) {
      let block = this.getBlock(blockID)
      if (block !== null) {
        block.title = title
      }
    },
    /**
     * Adds a new question to the block
     */
    blockAddQuestion (blockID, question) {
      let block = this.getBlock(blockID)
      if (block !== null) {
        for (const q of block.questions) {
          if (q === question) {
            return
          }
        }
        block.questions.push(question)
      }
    },
    /**
     * Remove a question from the block
     */
    blockRemoveQuestion (blockID, question) {
      let block = this.getBlock(blockID)
      if (block !== null) {
        let i = block.questions.indexOf(question)
        if (i !== -1) {
          block.questions.splice(i, 1)
        }
      }
    },
    /**
     * Changes the answer of the current block
     */
    setAnswer (blockID, answer) {
      let block = this.getBlock(blockID)
      if (block !== null) {
        block.answer = answer
      }
    },
    /**
     * Load the config data from a json string
     */
    loadConfig (string) {
      let json = JSON.parse(string)
      this.rowSelect = json.rowSelect
      this.rootSelect = json.rootSelect
      this.blocks = json.blocks
      this.groups = json.groups

      let highestID = 0
      for (const block of json.blocks) {
        if (block.id > highestID) {
          highestID = block.id
        }
      }
    },
    /**
     * Save the config to json string. Routes to bot overview or test if gotoTest is true.
     */
    saveConfig (gotoTest = false) {
      let saveObj =
        {
          rowSelect: this.rowSelect,
          rootSelect: this.rootSelect,
          block: this.blocks,
          groups: this.groups
        }

      let conf = JSON.stringify(saveObj)
      console.log(conf)
      axios.put(
        '/bot/' + this.id + '/config/',
        conf,
        {
          headers: {Authorization: 'ed2ff1a97f924b8e8a1402e6700a8bf4'}
        })
        .then(() => {
          if (gotoTest) {
            this.$router.push('/bots')
          } else {
            this.$router.push({name: 'test', params: {id: this.id}})
          }
        })
        .catch(() => {
          alert('Failed to upload your bot. Please try again.')
        })
    },
    /**
     * Save config event handler
     */
    saveData () {
      this.saveConfig()
    },
    /**
     * Test bot event handler
     */
    testBot () {
      this.saveConfig(true)
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
  overflow: auto;
}

.block-wrapper {
  height: 20%;
}

#leftside {
  width: 66%;
  height: 100%;
}

.wrapper {
  background-color: white;
  box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)
}
.group-wrapper {
  height: 80%;
}

.block-config-wrapper {
  height: 100%;
  flex: 1;
}
</style>