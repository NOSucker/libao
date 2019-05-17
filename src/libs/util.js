/**
 * @date 2018/11/22
 * @Description: 常用的原型方法
 */
// eslint-disable-next-line
Date.prototype.format = function (format) {
  const o = {
    "M+": this.getMonth() + 1, // month
    "d+": this.getDate(), // day
    "h+": this.getHours(), // hour
    "m+": this.getMinutes(), // minute
    "s+": this.getSeconds(), // second
    "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
    S: this.getMilliseconds() // millisecond
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, `${this.getFullYear()}`.substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length));
    }
  }
  return format;
};

// eslint-disable-next-line
String.prototype.format = function (placeholders) {
  let s = this;
  for (const propertyName in placeholders) {
    const re = new RegExp(`{${propertyName}}`, "gm");
    s = s.replace(re, placeholders[propertyName]);
  }
  return s;
};
