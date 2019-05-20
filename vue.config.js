process.env.VUE_APP_VERSION = require("./package.json").version;
const path = require("path");

// 基础路径 注意如果需要，发布之前要先修改这里
const publicPath = "";

module.exports = {
  lintOnSave: false,
  publicPath,
  devServer: {
    publicPath
  },
  chainWebpack(config) {
    // set svg-sprite-loader
    config.module
      .rule("svg")
      .exclude.add(path.join(__dirname, "src/icons"))
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(path.join(__dirname, "src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      });
  }
};
