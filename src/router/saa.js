export default [
  {
    path: "/user",
    name: "user",
    meta: { icon: "users", title: "用户管理" },
    component: () => import("../views/saa/user")
  }
];
