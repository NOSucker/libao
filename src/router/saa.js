export default [
  {
    path: "/user",
    name: "user",
    meta: { icon: "proposal", title: "用户管理" },
    component: () => import("../views/saa/user")
  }
];
