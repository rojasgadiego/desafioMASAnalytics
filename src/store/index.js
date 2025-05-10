import { createStore } from 'vuex'
import auth from './modules/auth'

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
    init({ dispatch }) {
      return dispatch('auth/initAuth')
    }
  },
  modules: {
    auth
  }
})