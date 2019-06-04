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
    meta: { icon: "users", title: "角色管理" },
    component: () => import("../views/saa/role/role-query")
  },
  {
    path: "/organization",
    name: "organization",
    meta: { icon: "users", title: "机构管理" },
    component: () => import("../views/saa/organization")
  },
  {
    path: "/menu",
    name: "menu",
    meta: { icon: "users", title: "菜单管理" },
    component: () => import("../views/saa/menu")
  }
];
