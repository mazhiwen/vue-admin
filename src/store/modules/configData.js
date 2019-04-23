
import * as types from '../mutation-types'

const state = {
  data: {
    checkItemInfo:{
      checkItemInfoListValid:[],
      businessType:{},
      businessTypeColor:{},
      businessValue:[],
      checkItemInfoList:[],
      productIdTypeMap:{}
    }
  },
}

const getters = {
}


const actions = {

}

const mutations = {

  [types.SetConfigData] (state,value) {
    state.data = value;
  },

}

export default {
  state,
  getters,
  actions,
  mutations
}
