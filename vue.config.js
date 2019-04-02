process.env.VUE_APP_VERSION = require("./package.json").version;

// 基础路径 注意如果需要，发布之前要先修改这里
let publicPath = "";

module.exports = {
  lintOnSave: false,
  publicPath: publicPath,
  devServer: {
    publicPath
  }
};
