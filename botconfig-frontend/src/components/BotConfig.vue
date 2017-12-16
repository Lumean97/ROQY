<template>
<div>
  <div id="config-header" class="wrapper">
    <div style="margin-right:20px;">
      <button v-on:click="testBot()" class="button-top">{{$lang.translate.config.test}}</button>
      <button v-on:click="saveData()" class="button-top">{{$lang.translate.config.save}}</button>
    </div>
  </div>
  <div id="conf-wrapper">
    <div id="content-wrapper" v-if="loaded">
      <div id="leftside">
        <div id="group-wrapper">
          <tree-view 
          :row="index" 
          v-for="(group,index) in subGroups" 
          :rowSelect="rowSelect" 
          :key="group.block" 
          v-on:selection-changed="selectSubTree(index,$event)" 
          v-on:addNew="addNewBlock(index)" 
          :group="group.children" 
          :blocks="blocks" 
          :selected="group.selection" 
          @drop="favDrop(index)" 
          class="wrapper default-shadow"></tree-view>
        </div>
        <div class="block-wrapper ">
          <block-view 
          v-on:favDrag="favStartDrag($event)" 
          :blocks="favorites">
          </block-view>
        </div>
      </div>
      <div class="block-config-wrapper ">
        <block-config 
        v-on:setTitle="setBlockTitle(selectedBlock.id, $event)" 
        v-on:newQuestion="blockAddQuestion(selectedBlock.id, $event)" 
        v-on:setAnswer="setAnswer(selectedBlock.id,$event)" 
        v-on:deleteQuestion="blockRemoveQuestion(selectedBlock.id,$event)" 
        v-on:favorite="blockToggleFavorite(selectedBlock.id)" 
        v-on:delete="deleteSelected()" 
        v-on:saveData="saveData()" 
        v-on:testBot="testBot()" 
        :block="selectedBlock"></block-config>
      </div>
    </div>
    <div v-else>
      <p>LOADING</p>
    </div>
  </div>
  </div>
</template>

<script>
import 'vue-material/dist/vue-material.css'
import blockConfig from './Config/BlockConfig.vue'
import blockView from './Config/BlockView.vue'
import treeView from './Config/TreeView.vue'
import api from '../api/botData'
import axios from 'axios'
import templates from './Config/templates'

export default {
  props: ['id'],
  data: function () {
    return {
      rowSelect: -1,
      rootSelect: -1,
      blockIDCount: 0,
      blocks: [ ],
      groups: [ ],
      favDrag: null,
      loaded: false
    }
  },
  components: {
    blockConfig, blockView, treeView
  },
  created () {
    this.loadBot()
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
      let block = {title: this.$lang.translate.config.unnamedBlock, id: this.blockIDCount++, isFavorite: false, questions: [], answer: ''}
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
    blockToggleFavorite (blockID) {
      let block = this.getBlock(blockID)
      if (block !== null) {
        block.isFavorite = !block.isFavorite
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
    loadConfig (json) {
      if (json === undefined || json === null) {
        return
      }
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

      this.blockIDCount = highestID + 1
    },
    /**
     * Save the config to json string. Routes to bot overview or test if gotoTest is true.
     */
    saveConfig (gotoTest = false) {
      let saveObj =
        {
          rowSelect: this.rowSelect,
          rootSelect: this.rootSelect,
          blocks: this.blocks,
          groups: this.groups
        }

      axios.put(
        '/bot/' + this.id + '/config/',
        saveObj,
        {
          headers: {Authorization: 'ed2ff1a97f924b8e8a1402e6700a8bf4'}
        })
        .then(() => {
          if (gotoTest) {
            this.$router.push({name: 'test', params: {id: this.id}})
          } else {
            this.$router.push('/bots')
          }
          this.$store.commit('resetBot')
        })
        .catch(() => {
          alert('Failed to upload your bot. Please try again.')
        })
    },
    /**
     * Save config button event handler
     */
    saveData () {
      this.saveConfig()
    },
    /**
     * Test bot button event handler
     */
    testBot () {
      this.saveConfig(true)
    },
    favStartDrag (id) {
      this.favDrag = id
      console.log('start drag : ' + id)
    },
    favDrop (row) {
      console.log('complete drag : ' + this.favDrag)
      this.subGroups[this.rowSelect].children.push(this.favDrag)
      this.favDrag = null
    },
    loadBot () {
      api.getBot(this.id)
      .then((data) => {
        this.loaded = true
        if (data.config !== null) {
          this.loadConfig(data.config)
        } else {
          // TODO : Templates should be loaded from backend instead
          console.log(templates.faq)
          if (data.botType === 'welcome') {
            this.loadConfig(templates.welcome)
          } else if (data.botType === 'faq') {
            this.loadConfig(templates.faq)
          }
        }
      })
      .catch((err) => {
        console.error(err)
        alert('Could not load bot from server please try again.')
      })
    }
  }
}
</script>

<style scoped>
#config-header {
  width: 100%;
  padding: 3px;
  display: flex;
  flex-direction: row-reverse;
}
.button-top {
  background-color: orange;
  color: white;
  padding: 4px 12px;
  border-radius: 15px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
  margin-top: 2px;
  margin-right: 3px;
}
#conf-wrapper {
  display: flex;
  height: 830px;
}

#content-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
}

#group-wrapper {
  height: 80%;
  padding: 25px;
  overflow-x: auto;
  white-space: nowrap;
}

.block-wrapper {
  height: auto;
}

#leftside {
  width: 66%;
  height: 100%;
}

.wrapper {
  background-color: white;
}

.group-wrapper {
  height: 80%;
}
#group-wrapper {
  height: 80%;
  padding: 25px;
}

.block-config-wrapper {
  height: 100%;
  flex: 1;
  border-left: .5px solid #d4d6d8;
}

.block-wrapper {
  height: 19.4%;
  border-top: 2px solid #d4d6d8;
}

#leftside {
  width: 66%;
  height: 100%;
}
</style>