import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate"

export default createStore({
  state: {
    asideVisible: false,
    sidebarVisible: '',
    sidebarUnfoldable: false,
    theme: 'default',
    lastNotificationTimestamp: null,
  },
  mutations: {
    toggleAside(state) {
      state.asideVisible = !state.asideVisible
    },
    toggleSidebar(state) {
      state.sidebarVisible = !state.sidebarVisible
    },
    toggleTheme(state, payload) {
      state.theme = payload.value
    },
    toggleUnfoldable(state) {
      state.sidebarUnfoldable = !state.sidebarUnfoldable
    },
    updateSidebarVisible(state, payload) {
      state.sidebarVisible = payload.value
    },
    updateNotificationTimestamp(state, value) {
      console.log("in mutation")
      state.lastNotificationTimestamp = value
    },
  },
  actions: {},
  modules: {},
  plugins: [createPersistedState()],
})
