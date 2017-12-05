import data from '../../api/account'
import * as types from '../mutation-types'

const state = {
  user: null,
  isSuccess: false
}

const getters = {
  getUser: () => state.user,
  checkout: () => state.isSuccess
}

const mutations = {
  [types.LOG_IN] (state, account) {
    state.user = account
    state.isSuccess = true
  },
  [types.LOG_OUT] (state) {
    state.isSuccess = false
    state.user = null
  }
}

const actions = {
  logIn ({commit}, account) {
    data.logIn(
      account,
      () => {
        commit(types.LOG_IN, { account })
      })
  },
  logOut ({commit}) {
    commit(types.LOG_OUT)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
