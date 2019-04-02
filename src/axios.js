import axios from "axios";
// import { Message } from 'element-ui'

const config = {};
axios.config = config;

// // http request 拦截器
// axios.interceptors.request.use(
//     config => {
//         let headers = config.headers.common
//         if (!headers) {
//             headers = {}
//         }
//         let headToken = localStorage.getItem('loginToken')
//         if (!headToken) {
//             headToken = getCookie('theToken')
//             if (!headToken) {
//                 // 需要跳转到登陆页面
//             }
//         }
//         headers['TOKEN'] = headToken || ''
//         config.headers.common = headers
//         return config
//     },
//     error => {
//         return Promise.reject(error)
//     })
// // http response 拦截器
// axios.interceptors.response.use(
//     response => {
//         if (!response.data) {
//             return response
//         } else {
//             if (response.data.status === 0) {
//                 return response
//             } else {
//                 if (response.data.status === -1 || response.data.status === -2) {
//                     const MSG = response.data.statusText ? response.data.statusText : '操作失败,系统发生错误！'
//                     Message.error(MSG)
//                 }
//                 return response
//             }
//         }
//     },
//     error => {
//         if (error.response) {
//             switch (error.response.status) {
//                 case 401:
//                     break
//                 case 403:
//                     break
//             }
//         }
//         Message.error({message: error.message})
//         return Promise.reject(error)
//     })

export default axios;
export { config };
