
import actions from './actions'
import mutations from './mutations'
/* eslint-disable */
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    titleName: { name: '' }
  },
  mutations,
  actions
})

export default store
