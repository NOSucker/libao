import Vue from "vue";
import Vuex from "vuex";
import axios from "./axios";

Vue.use(Vuex);

var store = null;

store = new Vuex.Store({
  state: {
    baseCodeCache: {}
  },
  mutations: {
    SET_BASE_CODE: (state, data) => {
      Vue.set(state.baseCodeCache, data.type, data.list);
    }
  },
  actions: {
    GetBaseCode({ commit }, codeType) {
      return axios
        .get(
          axios.config.sdd.baseURL +
            axios.config.sdd.baseCode.format({ codeType: codeType })
        )
        .then(response => {
          commit("SET_BASE_CODE", { type: codeType, list: response.data.list });
        });
    }
  },
  getters: {
    baseCodeData: state => codeType => {
      if (!state.baseCodeCache[codeType]) {
        Vue.set(state.baseCodeCache, codeType, []);
        store.dispatch("GetBaseCode", codeType);
      }
      return state.baseCodeCache[codeType];
    }
  }
});

export default store;
