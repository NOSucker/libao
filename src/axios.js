import axios from "axios";
import { Message } from "element-ui";

const config = {
  sdd: {
    baseURL: "/sdd",
    baseCode: "/baseCode/search/{codeType}"
  },
  saa: {
    // baseURL: process.env.VUE_APP_SAA_BASE_URL,
    baseURL: "http://192.168.1.105:18020",
    login: "/auth/token",
    loginInfo: "/saa/login_info",
    companyQuery: "/syscompany/listsub/{comCode}",
    userQuery: "/sysuser/list",
    userCreate: "/sysuser/create",
    userEdit: "/sysuser/edit",
    userDelete: "/sysuser/delete",
    // saa 角色相关
    roleListAll: "/saa/role/list?_pageNo={_pageNo}&_pageSize={_pageSize}",
    taskTreeWithUser: "/saa/task/tree/{userCode}",
    createRole: "/saa/role/create",
    deleteRole: "/saa/role/delete",
    updateRole: "/saa/role/update",
    // saa 机构相关
    getSubCompany: "/syscompany/sub/{comCode}",
    createOrganization: "/syscompany/create",
    deleteOrganization: "/syscompany/delete",
    updateOrganization: "/syscompany/update",
    availableOrganization: "/syscompany/available", // 根据用户userCode查看有效的机构
    // saa 菜单相关
    getMenuWithUser: "/saa/task/tree/{userCode}", //根据用户userCode查看菜单信息
    getSubMenu: "/saa/task/sub/{taskCode}", // 获取菜单的子节点
    deleteMenu: "/saa/task/delete",
    createMenu: "/saa/task/create",
    updateMenu: "/saa/task/update"
  }
};
axios.config = config;
axios.defaults.timeout = 20000; // 请求超时时间
axios.defaults.baseURL = process.env.VUE_APP_BASE_URL; // 根据环境变量设置默认请求后台地址

/**
 * 请求拦截器
 */
axios.interceptors.request.use(
  config => {
    // 在请求发送之前做一些处理，让每个请求携带JWT token-- ['Authorization'] 请根据实际情况自行修改
    config.headers["Authorization"] = "Bearer " + (localStorage.getItem("loginData") ? JSON.parse(localStorage.getItem("loginData")).accessToken : "");
    return config;
  },
  error => {
    // 发送失败
    console.log(error);
    Promise.reject(error);
  }
);

/**
 * 响应拦截器
 */
axios.interceptors.response.use(
  response =>
    // 这个“status状态码”和“statusText状态信息”是和后端约定的，需前后端严格按照规范来处理
    // if(response.data && response.data.status !== 0){
    //     Message({
    //         message: response.data.statusText ? response.data.statusText : '请求后台服务出错，请重试或者联系管理员！',
    //         type: "error",
    //         duration: 5000
    //     });
    // }
    response,
  error => {
    // 后台请求错误处理，这里可以埋点
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = "请求错误";
          break;
        case 401:
          error.message = "未授权，请登录";
          break;
        case 403:
          error.message = "拒绝访问";
          break;
        case 404:
          error.message = `请求地址出错: ${error.response.config.url}`;
          break;
        case 408:
          error.message = "请求超时";
          break;
        case 500:
          error.message = "服务器内部错误";
          break;
        case 501:
          error.message = "服务未实现";
          break;
        case 502:
          error.message = "网关错误";
          break;
        case 503:
          error.message = "服务不可用";
          break;
        case 504:
          error.message = "网关超时";
          break;
        case 505:
          error.message = "HTTP版本不受支持";
          break;
        default:
          break;
      }
    }
    Message({
      message: error.message,
      type: "error",
      duration: 5000
    });
    return Promise.reject(error);
  }
);

export default axios;
export { config }; // 后台接口配置信息导出，方便配置Mock使用
