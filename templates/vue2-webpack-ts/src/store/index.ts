import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export interface State {
  count: number;
}

export default new Vuex.Store<State>({
  state: {
    count: 0
  },
  getters: {
    doubleCount: (state) => state.count * 2
  },
  mutations: {
    increment(state) {
      state.count++
    }
  },
  actions: {
    incrementAsync({ commit }) {
      setTimeout(() => {
        commit('increment')
      }, 1000)
    }
  },
  modules: {
  }
})
