import Vue from "vue";
import Vuex from "vuex";
import axios from "../axios";
import app from "./app";

Vue.use(Vuex);

let store = null;

store = new Vuex.Store({
  modules: {
    app
  },
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
      return axios.get(axios.config.sdd.baseURL + axios.config.sdd.baseCode.format({ codeType })).then(response => {
        commit("SET_BASE_CODE", { type: codeType, list: response.data.data });
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