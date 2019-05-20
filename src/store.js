import Vue from "vue";
import Vuex from "vuex";
import axios from "./axios";

Vue.use(Vuex);

let store = null;

store = new Vuex.Store({
  state: {
    baseCodeCache: {},
    sidebar: {
      // opened: localStorage.getItem("sidebarStatus")
      //   ? !!+localStorage.getItem("sidebarStatus")
      //   : true,
      opened: false,
      withoutAnimation: false
    },
    device: "desktop",
    size: localStorage.getItem("size") || "medium"
  },
  mutations: {
    SET_BASE_CODE: (state, data) => {
      Vue.set(state.baseCodeCache, data.type, data.list);
    },
    TOGGLE_SIDEBAR: state => {
      state.sidebar.opened = !state.sidebar.opened;
      state.sidebar.withoutAnimation = false;
      // if (state.sidebar.opened) {
      //   localStorage.setItem("sidebarStatus", 1);
      // } else {
      //   localStorage.setItem("sidebarStatus", 0);
      // }
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      localStorage.setItem("sidebarStatus", 0);
      state.sidebar.opened = false;
      state.sidebar.withoutAnimation = withoutAnimation;
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device;
    },
    SET_SIZE: (state, size) => {
      state.size = size;
      localStorage.setItem("size", size);
    }
  },
  actions: {
    GetBaseCode({ commit }, codeType) {
      return axios.get(axios.config.sdd.baseURL + axios.config.sdd.baseCode.format({ codeType })).then(response => {
        commit("SET_BASE_CODE", { type: codeType, list: response.data.data });
      });
    },
    toggleSideBar({ commit }) {
      commit("TOGGLE_SIDEBAR");
    },
    closeSideBar({ commit }, { withoutAnimation }) {
      commit("CLOSE_SIDEBAR", withoutAnimation);
    },
    toggleDevice({ commit }, device) {
      commit("TOGGLE_DEVICE", device);
    },
    setSize({ commit }, size) {
      commit("SET_SIZE", size);
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
