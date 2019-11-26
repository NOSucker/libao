import axios from "axios";
import { Message } from "element-ui";
import store from "./store/index";

const config = {
  sdd: {
    baseURL: "/sdd",
    baseCode: "/baseCode/search/{codeType}"
  },
  saa: {
    baseURL: process.env.VUE_APP_SAA_BASE_URL,
    login: "/auth/token",
    loginInfo: "/saa/login_info",
    companyQuery: "/syscompany/listsub/{comCode}",
    userQuery: "/sysuser/list",
    userCreate: "/sysuser/create",
    userEdit: "/sysuser/update",
    userDelete: "/sysuser/delete",
    // saa 角色相关
    roleListAll: "/saa/role/list?_pageNo={_pageNo}&_pageSize={_pageSize}",
    taskTreeWithUser: "/saa/task/tree/{userCode}",
    createRole: "/saa/role/create",
    deleteRole: "/saa/role/delete",
    updateRole: "/saa/role/update",
    outsideRoleCode: "/saa/outside/{roleCode}", // 查找不在某角色下的所有用户
    deleteUsersFromRole: "/saa/delete/{roleCode}",
    existingUserQuery: "/saa/user-grants/{roleCode}", //在指定的角色下已经添加的用户
    addUserToRole: "/saa/adduser/{roleCode}", //在指定的角色下添加用户
    // saa 机构相关
    getSubCompany: "/syscompany/sub/{comCode}",
    //getAllOrgan:"/platform/serivce/QueryAllOrgan",
    createOrganization: "/syscompany/create", //新增
    deleteOrganization: "/syscompany/delete", //删除
    updateOrganization: "/syscompany/update", //更新
    availableOrganization: "/syscompany/available", // 根据用户userCode查看有效的机构
    dragOrganization: "/syscompany/drag", //拖拽
    // saa 菜单相关
    getMenuWithUser: "/saa/task/tree/{userCode}", //根据用户userCode查看菜单信息
    getSubMenu: "/saa/task/sub/{taskCode}", // 获取菜单的子节点
    deleteMenu: "/saa/task/delete",
    createMenu: "/saa/task/create",
    updateMenu: "/saa/task/update"
  },
  permissionConfig: {
    baseURL: process.env.VUE_APP_DEV_BASE_XUANBIRD_URL,
    // policyPermissionConfig 保单规则校验配置
    getpolicyPermissionConfigById: "/vipValidateRole/{id}",
    deletepolicyPermissionConfig: "/vipValidateRole/delete/{id}",
    createpolicyPermissionConfig: "/vipValidateRole/save",
    updatepolicyPermissionConfig: "/vipValidateRole/update",
    copypolicyPermissionConfig: "/vipValidateRole/copy",
    getAllpolicyPermissionConfig: "/vipValidateRole/queryAll",
    getAllBypolicyPermissionConfig: "/vipValidateRole/queryAllByParams",
    deleteLists: "/vipValidateRole/delete",
    findInitInfo: "/vipValidateRole/findInitInfo",
    findAll: "/vipValidateRole/queryAllByParamsNew"
  },
  rightsAndInterests: {
    baseURL: process.env.VUE_APP_DEV_BASE_XUANBIRD_URL,
    // rightsAndInterests 客户权益查询配置
    getRightsAndInterestsById: "/rightsAndInterests/{id}", //根据主键查找权益信息
    deleteRightsAndInterestsById: "/rightsAndInterests/delete/{id}", //根据主键删除客户权益信息
    queryAll: "/rightsAndInterests/queryAll", //查找所有权益信息
    queryAllByParamsNew: "/rightsAndInterests/queryAllByParamsNew", //分页查询
    saveRightsAndInterests: "/rightsAndInterests/save", //新增一条数据
    modifyRightsAndInterests: "/rightsAndInterests/update", //根据主键修改客户权益信息
    deleteInBatch: "/rightsAndInterests/deleteInBatch" //批量删除客户权益信息
  },
  contactInfo: {
    baseURL: process.env.VUE_APP_DEV_BASE_XUANBIRD_URL,
    //常用联系人增删改查
    contactInfoInsert: "/platform/serivce/phoneNumberInsert", //常用联系人新增
    contactInfoQuery: "/platform/serivce/phoneNumberSelect", //常用联系人查询
    //queryAllByParamsNew: "/rightsAndInterests/queryAllByParamsNew", //分页查询
    contactInfoUpdate: "/platform/serivce/phoneNumberUpdate", //常用联系人修改
    // modifyRightsAndInterests: "/rightsAndInterests/update", //根据主键修改客户权益信息
    contactInfoDelete: "/platform/serivce/phoneNumberDelete", //常用联系人删除
    contactInfoDeleteList: "/platform/serivce/deleteList", //批量删除常用联系人
    contactInfoQueryPage: "/platform/serivce/phoneNumberQueryPage" //分页查询
  },
  user: {
    baseURL: process.env.VUE_APP_DEV_BASE_XUANBIRD_URL,
    //用户增删查
    userAdd: "/platform/serivce/userAdd", //用户新增
    userQuery: "/platform/serivce/userQuery", //用户根据条件查询
    // contactInfoUpdate: "/platform/serivce/phoneNumberUpdate", //常用联系人修改
    // modifyRightsAndInterests: "/rightsAndInterests/update", //根据主键修改客户权益信息
    userDelete: "/platform/serivce/userDelete", //用户删除
    // contactInfoDeleteList:"/platform/serivce/deleteList",//批量删除常用联系人
    // contactInfoQueryPage:"/platform/serivce/phoneNumberQueryPage"//分页查询
    userQueryAll: "/platform/serivce/userQueryAll", //进来就会查询全部
    userUpdate: "/platform/serivce/userUpdate", //修改用户信息
    //新增的4个查询路径
    userQuerySkillsGroup: "/platform/serivce/querySkillsGroup", //查询用户技能组
    userqueryUserSource: "/platform/serivce/queryUserSource", //查询用户来源
    userqueryUserSex: "/platform/serivce/queryUserSex", //查询用户性别
    userqueryUserVain: "/platform/serivce/queryUserVain", //查询用户是否有效以及是否是班长
    login: "/platform/serivce/login", //用户登录,
    userRoleQuery: "/platform/serivce/userRoleQuery", //根据用户查询所属角色
    queryAllRole: "/platform/serivce/allRoleQuery", //查找所有角色
    insertUserRole: "/platform/serivce/userRoleAdd", //新增用户角色
    deleteSelectUserRole: "/platform/serivce/userRoleDelete", //批量删除当前用户的角色信息
    upPriority: "/platform/serivce/upPriority", //提高当前角色优先级
    lowPriority: "/platform/serivce/lowPriority", //降低当前角色优先级
    setUserRoleDate: "/platform/serivce/setDate", //设置过期日期
    getValidateCode: "/validateCode/validateCode",  //获取验证码
    logout: "/platform/serivce/logout",   //用户登出
    queryAllUserIsOnline:"/platform/serivce/userOutLoginQuery",//查询所有在线的用户
    setUserLoginStatus:"/platform/serivce/setUserLoginStatus",//清除登陆用户状态
    IsTheUserOutLogin:"/platform/serivce/isOutLogin"//判断该用户是否已经被剔除下线
  },
  organ: {
    baseURL: process.env.VUE_APP_DEV_BASE_XUANBIRD_URL,
    //getSubCompany: "/syscompany/sub/{comCode}",
    getAllOrgan: "/platform/serivce/QueryAllOrgan", //查找所有机构信息
    createOrUpdateOrganization: "/platform/serivce/saveOrUpdate", //新增或者更新
    deleteOrgan: "/platform/serivce/delete", //删除
    queryOrganByParentId: "/platform/serivce/QueryOrganDetail", //跟据父id查询子节点
    //dragOrganization: "/syscompany/drag", //拖拽
    queryRootOrgan: "/platform/serivce/QueryRootOrgan", //查找根节点
    queryParentName: "/platform/serivce/QueryParentName", //把父id作为id查询父id名称
    queryManngerGroup: "/platform/serivce/QueryManngerGroup", //查询可管理组
    queryConsultationGroup: "/platform/serivce/QueryConsultationGroup", //查询可咨询组
    queryIsChild: "/platform/serivce/QueryIsChild", //查询当前节点是否有子节点
    queryUserCount: "/platform/serivce/QueryUserCount", //查询当前节点的用户数量
    updatUserOrgan: "/platform/serivce/updateUserOrgan", //引入用户(改变当前用户的机构)
    queryOrganName: "/platform/serivce/QueryOrganById/{Id}" //根据主键查找机构名称
  },

  supplier: {
    baseURL: process.env.VUE_APP_DEV_BASE_XUANBIRD_URL,
    // supplier 查询代理商
    queryAllSupplier: "/supplier/findAll" //根据主键查找权益信息
  },
  service: {
    baseURL: process.env.VUE_APP_DEV_BASE_URL,
    //统一桥接接口
    /*transitInterface: "/platform/transitInterface/transitInterface/transit",
    insertsNewByXuanBird: "/platform/transitInterface/transitInterface/insertsNewByXuanBird",
    uploadFile: "/platform/transitInterface/transitInterface/uploadFile",
    downloadFile: "/platform/transitInterface/transitInterface/downloadFile"*/
    transitInterface: "/demo/transit",
    uploadFile: "/demo/uploadFile",
    downloadFile: "/demo/downloadFile"
  },
  sms: {
    baseUrl: process.env.VUE_APP_DEV_BASE_XUANBIRD_URL,
    queryCarInsuranceList: "/sms/queryCarInsuranceList", //查询车险险种
    querySmsLevelList: "/sms/querySmsLevelList", //查询客户等级
    querySmsBranchList: "/sms/querySmsBranchList", //查询分公司
    querySmsSubList: "/sms/querySmsSubList", //根据areaCode查询子公司
    querySendingSesCounts: "/sms/querySendingSesCounts", //查询发送信息条数
    querySmsTypeList: "/sms/querySmsTypeList", //查询短信类型
    querySmsTemplateList: "/sms/querySmsTemplateList", //根据类型查询短信模板
    queryOtherData: "/sms/queryOtherData", //查询其他关键信息
    sendSmsMass: "/sms/sendSmsMass"  //群发短信
  },
  menu: {
    baseUrl: process.env.VUE_APP_DEV_BASE_XUANBIRD_URL,
    //菜单接口相关
    queryAll: "/menu/queryAll", //查询全部菜单
    selectAllMenuByUser: "/menu/selectAllMenuByUser", //根据用户查询其权限菜单
    queryAllLevel1Menu: "/menu/queryAllLevel1Menu", //查询全部一级菜单
    queryMenuByParentId: "/menu/queryMenuByParentId", //根据parentId查询菜单
    saveOrUpdate: "/menu/saveOrUpdate", //保存or更新菜单
    deleteMenu: "/menu/delete", //删除菜单
    queryMenuNodeList: "/menu/queryMenuNodeList" //查询菜单节点类型
  },
  role: {
    baseURL: process.env.VUE_APP_DEV_BASE_XUANBIRD_URL,
    //角色接口相关
    queryByPage: "/role/queryByPage", //分页查询角色列表
    deletById: "/role/deleteByRoleId", //通过id删除角色
    queryOrganFilterList: "/role/queryOrganFilterByType", //查询修改页面需要的默认机构权限列表
    saveOrUpdate: "/role/saveOrUpdate", //新增/修改角色及其菜单权限
    queryUserRoleByPage: "/role/queryUserRoleByPage", //分页查询用户角色
    deleteUserRole: "/role/deleteUserRole", //批量删除用户角色
    saveUserRole: "/role/saveUserRole" //保存用户角色
  },
  smsTemplates: {
    baseURL: process.env.VUE_APP_DEV_BASE_XUANBIRD_URL,
    queryAll: "/smsTemplates/queryAll", //分页查询
    findInitInfo: "/smsTemplates/findInitInfo", //初始化信息
    saveSmsTemplates: "/smsTemplates/save", //新增一条数据
    modifySmsTemplates: "/smsTemplates/modify", //修改一条数据
    deleteInBatch: "/smsTemplates/deleteInBatch" //批量删除客户权益信息
  },
  couponCodeManage: {
    baseURL: process.env.VUE_APP_DEV_BASE_XUANBIRD_URL,
    queryCouponCodeType: "/platform/serivce/queryCouponCodeType",//查询券码类型
    queryAgent: "/platform/serivce/queryAgent",//查询代理商
    queryBranch: "/platform/serivce/queryBranch",//查询适用分公司
    queryAllCouponCode:"/platform/serivce/couponCodeQuery",//券码管理分页查询
    updateCouponCode:"/platform/serivce/couponCodeUpdate"//根据主键更新券码
  },
  file: {
    baseURL: process.env.VUE_APP_DEV_BASE_XUANBIRD_URL,
    queryCouponBatchByPage: "/file/couponBatch",   //分页查询券码导入批次
    queryCouponCodeFailedBypage: "/file/couponCodeFailed",   //分页查询券码导入失败记录
    downloadFile: "/file/download",   //下载模板文件
    fileUpload: "/file/fileUpload",   //上传文件
    multifileUpload: "/file/multifileUpload",   //多文件上传
  }
};
axios.config = config;
axios.defaults.timeout = 180000; // 请求超时时间
axios.defaults.baseURL = process.env.VUE_APP_BASE_URL; // 根据环境变量设置默认请求后台地址

/**
 * 请求拦截器
 */
axios.interceptors.request.use(
  config => {
    // 在请求发送之前做一些处理，让每个请求携带JWT token-- ['Authorization'] 请根据实际情况自行修改
   // console.log(6336325555,store.state.usercode);
   /* if(store.state.usercode){
    //  config.headers['Authorization'] = store.state.usercode;
      isTheUserOutLogin:{
        let loginStatusParams = {
          requestUrl: axios.config.user.baseURL + axios.config.user.IsTheUserOutLogin,
          requestType: "POST",
          requestBody: JSON.stringify(store.state.usercode)
        };
      //  console.log(5252555514,loginStatusParams.requestBody);
      //  this.queryLoading = true;
        axios
          .post(axios.config.service.baseURL + axios.config.service.transitInterface, loginStatusParams)
          .then(response => {
            if (JSON.parse(response.data.responseStr).result.dataList=0) {
              this.$message.success("调用成功");
              console.log(666552566,JSON.parse(response.data.responseStr).result.dataList);
            } else {
              this.$message.error(JSON.parse(response.data.responseStr).msg);
            }
          })
      }
    /!*  var param={
           userData:store.state.usercode
        }
        axios({
            url:'http://127.0.0.1:9001/platform/serivce/isOutLogin',
            method:'post',
            data:{serchParam:JSON.stringify(param)},
            callback:(result)=>{
              console.log(result);
            }

         })*!/

    }*/
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
  response => {



    // 这个“status状态码”和“statusText状态信息”是和后端约定的，需前后端严格按照规范来处理
    // if(response.data && response.data.status !== 0){
    //     Message({
    //         message: response.data.statusText ? response.data.statusText : '请求后台服务出错，请重试或者联系管理员！',
    //         type: "error",
    //         duration: 5000
    //        });
    // }
    if(store.state.usercode) {
      console.log(63367777777, store.state.usercode);
    }
   return response;
  },
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
