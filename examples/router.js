import "./assets/css/common.css"

export default [
  {
    path: "/tree-select",
    name: "treeSelect",
    component: () => import("./components/tree-select.vue")
  },
  {
    path: "/pager-select",
    name: "pagerSelect",
    component: () => import("./components/pager-select.vue")
  },
  {
    path: "/form-track",
    name: "formTrack",
    component: () => import("./components/form-track.vue")
  }
]
