import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { config } from "../axios";

// This sets the mock adapter on the default instance
const mock = new MockAdapter(axios);

// Mock any GET request to /users
// arguments for reply are (status, data, headers)
mock.onPost(config.saa.baseURL + config.saa.userQuery).reply(request => {
  console.log("Mock: " + request.url);
  let pagerData = JSON.parse(request.data);
  pagerData.data = [];
  pagerData.totalCount = 25;
  for (let i = 1; i <= pagerData.perPage; i++) {
    let n = i + (pagerData.pageNo - 1) * pagerData.perPage;
    if (n <= pagerData.totalCount) {
      pagerData.data.push({
        userCode:
          "010" +
          Math.random()
            .toFixed(4)
            .replace(".", ""),
        userName: "姓名" + n,
        comCode: "110000",
        comCName: "北京分公司",
        regTime: "2019-01-01"
      });
    }
  }
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        200,
        {
          data: pagerData,
          status: 0,
          statusText: "Success"
        }
      ]);
    }, 1500);
  });
});

mock.onGet(new RegExp(config.sdd.baseURL + config.sdd.baseCode.substr(0, config.sdd.baseCode.indexOf("{")))).reply(request => {
  console.log("Mock: " + request.url);
  let params = new URLSearchParams(request.url.substr(request.url.indexOf("?")).slice(1));
  let pagerData = {
    pageNo: params.get("pageNo"),
    perPage: params.get("perPage"),
    data: [],
    totalCount: 36
  };
  for (let i = 1; i <= pagerData.totalCount; i++) {
    pagerData.data.push({ code: i.toString(), value: `基础代码${i}` });
  }
  if (params.get("value")) {
    pagerData.data = [{ code: params.get("value"), value: "基础代码" + params.get("value") }];
  } else if (params.get("pageNo") && params.get("perPage")) {
    if (params.get("search")) {
      let searchList = [];
      pagerData.data.forEach(item => {
        if (item.value.indexOf(params.get("search")) > -1) {
          searchList.push(item);
        }
      });
      pagerData.totalCount = searchList.length;
      pagerData.data = searchList.splice((parseInt(params.get("pageNo")) - 1) * parseInt(params.get("perPage")), parseInt(params.get("perPage")));
    } else {
      pagerData.data = pagerData.data.splice((parseInt(params.get("pageNo")) - 1) * parseInt(params.get("perPage")), parseInt(params.get("perPage")));
    }
  } else {
    pagerData = pagerData.data.splice(0, 3);
  }
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        200,
        {
          data: pagerData,
          status: 0,
          statusText: "Success"
        }
      ]);
    }, 500);
  });
});

mock.onGet(new RegExp(config.saa.baseURL + config.saa.companyQuery.substr(0, config.saa.companyQuery.indexOf("{")))).reply(request => {
  console.log("Mock: " + request.url);
  let comCode = request.url.substr(request.url.lastIndexOf("/") + 1);
  let companyData = {
    comCode: "000000",
    comCName: "总公司",
    subCompanyList: [
      {
        comCode: "110000",
        comCName: "北京分公司",
        subCompanyList: [
          {
            comCode: "110100",
            comCName: "北京东城分公司",
            subCompanyList: []
          },
          {
            comCode: "110200",
            comCName: "北京西城分公司"
          }
        ]
      },
      {
        comCode: "210000",
        comCName: "上海分公司"
      }
    ]
  };
  switch (comCode) {
    case "":
      break;
    case "110000":
      companyData = companyData.subCompanyList[0];
      break;
    case "110100":
      companyData = companyData.subCompanyList[0].subCompanyList[0];
      break;
    case "110200":
      companyData = companyData.subCompanyList[0].subCompanyList[1];
      break;
    case "210000":
      companyData = companyData.subCompanyList[1];
      break;
    default:
      companyData = {};
  }
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        200,
        {
          data: companyData,
          status: 0,
          statusText: "Success"
        }
      ]);
    }, 500);
  });
});

mock.onAny().passThrough();
export default mock;
