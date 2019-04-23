
import * as types from '../mutation-types'

const state = {
  menus: {},
}

const getters = {
}


const actions = {

}

const mutations = {

  [types.SetMenus] (state,menus) {
    state.menus = JSON.parse(JSON.stringify(menus));
  },

}

export default {
  state,
  getters,
  actions,
  mutations
}
