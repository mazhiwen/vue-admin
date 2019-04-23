
import * as types from '../mutation-types'

const state = {
  isShowResult: false,
  resultTxt:''
}

// getters: can be maped into a component, get the updated state
const getters = {
  // sidebarOpened: state => state.sidebarOpened,
}

// actions: can be maped into a component, commit action
const actions = {
  // toogleSidebar ({ state, commit, rootState }) {
  //   state.sidebarOpened
  //     ? commit(types.CLOSE_SIDEBAR)
  //     : commit(types.OPEN_SIDEBAR)
  // },
}

// mutations: logic of update state
const mutations = {
  [types.SHOW_CHECK_RESULT] (state) {
    state.isShowResult = true;
  },

  [types.HIDE_CHECK_RESULT] (state) {
    state.isShowResult = false;
  },
  [types.SET_RESULTTXT] (state,txt) {
    state.resultTxt = txt;
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
