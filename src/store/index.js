import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import view from './modules/view'
import check from './modules/check'
import menus from './modules/menus'
import configData from './modules/configData'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const modules = {
  view,
  check,
  menus,
  configData
}

export default new Vuex.Store({
  modules,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
