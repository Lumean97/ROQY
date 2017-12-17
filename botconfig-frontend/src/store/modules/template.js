import data from '../../api/templateData'
import * as types from '../mutation-types'

// initial state
const state = {
  templates: [
    {
      name: 'welcome',
      description: 'Ich leite nur weiter...'
    },
    {
      name: 'faq',
      description: '58% Frage 42% Antwort'
    }
  ]
}

const getters = {
  getTemplates: state => state.templates,
  getTemplate: (state, template) => state.templates[state.templates.indexOf(template)]
}

const mutations = {
  [types.ADD_NEW_TEMPALTE] (state, template) {
    state.templates.push(template)
  },

  [types.RECEIVE_TEMPLATES] (state, { templates }) {
    state.templates = templates
  },
  [types.DELETE_TEMPLATE] (state, { template }) {
    state.templates.splice(state.templates.indexOf(template), 1)
  }
}

const actions = {
  getAllTemplate ({commit}) {
    data.getTemplates(templates => {
      commit(types.RECEIVE_TEMPLATES, { templates })
    })
  },
  addTemplate ({commit}, template) {
    data.addNewTemplate(teamplate => {
      commit(types.ADD_NEW_TEMPALTE, { template })
    }, template)
  },
  deleteTemplate ({commit}, template) {
    commit(types.DELETE_TEMPLATE, { template })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
