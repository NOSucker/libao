const state = {
  loginData: localStorage.getItem("loginData") ? JSON.parse(localStorage.getItem("loginData")) : null,
  sidebar: {
    // opened: localStorage.getItem("sidebarStatus")
    //   ? !!+localStorage.getItem("sidebarStatus")
    //   : true,
    opened: false,
    withoutAnimation: false
  },
  device: "desktop",
  size: localStorage.getItem("size") || "medium"
};

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened;
    state.sidebar.withoutAnimation = false;
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
  },
  SET_LOGIN_DATA: (state, loginData) => {
    if (!loginData) {
      localStorage.removeItem("loginData");
    } else {
      localStorage.setItem("loginData", JSON.stringify(loginData));
    }
    state.loginData = loginData;
  }
};

const actions = {
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
  },
  login({ commit }, userInfo) {
    let params = new URLSearchParams();
    params.append("userCode", userInfo.userCode);
    params.append("password", userInfo.password);
    return this._vm.$axios.post(this._vm.$axios.config.saa.baseURL + this._vm.$axios.config.saa.login + "?" + params.toString()).then(() => {
      commit("SET_LOGIN_DATA", {});
    });
  },
  logout({ commit }) {
    commit("SET_LOGIN_DATA", null);
  }
};

const getters = {
  sidebar: state => state.sidebar,
  size: state => state.size,
  device: state => state.device,
  loginData: state => state.loginData
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
