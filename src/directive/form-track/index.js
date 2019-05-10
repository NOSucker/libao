import formTrack from "./formTrack";
import "./formTrack.css";

const install = function(Vue) {
  Vue.directive("formTrack", formTrack);
};

if (window.Vue) {
  window["formTrack"] = formTrack;
  Vue.use(install); // eslint-disable-line
}

formTrack.install = install;
export default formTrack;
