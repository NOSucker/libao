import Vue from "vue";
import Vuex from "vuex";
import axios from "../axios";
import app from "./app";
import router from "../router/index";

Vue.use(Vuex);

let store = null;

store = new Vuex.Store({
  modules: {
    app
  },
  state: {
    baseCodeCache: {},
    user: true,
    usercode: ''
  },
  mutations: {
    SET_BASE_CODE: (state, data) => {
      Vue.set(state.baseCodeCache, data.type, data.list);
    },
    login: (state, user) => {
      state.user = user;
    },
    logout: (state, user) => {
      state.user = false;
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
