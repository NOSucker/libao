export default [
  {
    path: "/user",
    name: "user",
    meta: { icon: "users", title: "用户管理" },
    component: () => import("../views/saa/user")
  },
  {
    path: "/role",
    name: "role",
    meta: { icon: "role", title: "角色管理" },
    component: () => import("../views/saa/role/index")
  },
  {
    path: "/organization",
    name: "organization",
    meta: { icon: "organization", title: "机构管理" },
    component: () => import("../views/saa/organization")
  },
  {
    path: "/menu",
    name: "menu",
    meta: { icon: "menu", title: "菜单管理" },
    component: () => import("../views/saa/menu")
  },
  {
    path: "/policyPermissionConfig",
    name: "policyPermissionConfigAuth",
    meta: { icon: "vip-customer", title: "尊客会校验规则配置认证" },
    component: () => import("../views/permissionConfig/policyPermissionConfig")
  },
  {
    path: "/rightsAndInterests",
    name: "rightsAndInterestsAuth",
    meta: { icon: "client-rights", title: "客户权益查询认证" },
    component: () => import("../views/rightsAndInterests/rightsAndInterests")
  },
  {
    path: "/smsTemplates",
    name: "smsTemplatesAuth",
    meta: { icon: "clipboard-list-solid", title: "短信模板" },
    component: () => import("../views/sms/smsTemplates")
  },
  {
    path: "/smsMass",
    name: "smsMass",
    meta: { icon: "comment-solid", title: "短信群发" },
    component: () => import("../views/smsMass/smsMass")
  },
  {
    path: "/couponCodeManage",
    name: "couponCodeManage",
    meta: { icon: "couponCode-manage", title: "券码管理" },
    component: () => import("../views/couponCode/couponCodeManage")
  },
  {
    path: "/coupon",
    name: "coupon",
    meta: { icon: "coupon-import", title: "券码导入" },
    component: () => import("../views/coupon/upAndDown")
  },
  {
    path:"/outLogin",
    name:"outLogin",
    meta: { icon: "outLogin",title:"清除用户" },
    component: () => import("../views/saa/outLogin")
  }
];
