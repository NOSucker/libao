import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { config } from "../axios";

// This sets the mock adapter on the default instance
const mock = new MockAdapter(axios);

// Mock any GET request to /users
// arguments for reply are (status, data, headers)
mock.onPost(axios.defaults.baseURL + config.businessDataQuery).reply(() => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        200,
        {
          table: [
            {
              comCode: "110000",
              comName: "财险公司北京分公司",
              personCode: "110000001",
              personName: "操作员1"
            },
            {
              comCode: "110000",
              comName: "财险公司北京分公司",
              personCode: "110000002",
              personName: "操作员2"
            },
            {
              comCode: "210000",
              comName: "财险公司上海分公司",
              personCode: "210000001",
              personName: "操作员1"
            }
          ],
          status: 0,
          statusText: "Success"
        }
      ]);
    }, 1000);
  });
});

mock.onGet(new RegExp(config.sdd.baseURL + config.sdd.baseCode.substr(0, config.sdd.baseCode.indexOf("{")))).reply(request => {
  console.log("Mock: " + request.url);
  let params = new URLSearchParams(request.url.substr(request.url.indexOf("?")).slice(1));
  let listData = [];
  let total = 36;
  for (let i = 1; i <= total; i++) {
    listData.push({ code: i.toString(), value: `基础代码${i}` });
  }
  if (params.get("value")) {
    listData = [{ code: params.get("value"), value: "基础代码" + params.get("value") }];
  } else if (params.get("pageNo") && params.get("pageSize")) {
    if (params.get("search")) {
      let searchList = [];
      listData.forEach(item => {
        if (item.value.indexOf(params.get("search")) > -1) {
          searchList.push(item);
        }
      });
      total = searchList.length;
      listData = searchList.splice((parseInt(params.get("pageNo")) - 1) * parseInt(params.get("pageSize")), parseInt(params.get("pageSize")));
    } else {
      listData = listData.splice((parseInt(params.get("pageNo")) - 1) * parseInt(params.get("pageSize")), parseInt(params.get("pageSize")));
    }
  } else {
    listData = listData.splice(0, 3);
  }
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        200,
        {
          list: listData,
          total,
          status: 0,
          statusText: "Success"
        }
      ]);
    }, 100);
  });
});

mock.onGet(new RegExp(config.saa.baseURL + config.saa.companyQuery.substr(0, config.saa.companyQuery.indexOf("{")))).reply(request => {
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
            comCName: "北京东城分公司"
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
  if (comCode == "210000") {
    companyData = {
      comCode: "210000",
      comCName: "上海分公司",
      subCompanyList: []
    };
  }
  if (comCode == "110000") {
    companyData = {
      comCode: "110000",
      comCName: "北京分公司",
      subCompanyList: [
        {
          comCode: "110100",
          comCName: "北京东城分公司"
        },
        {
          comCode: "110200",
          comCName: "北京西城分公司"
        }
      ]
    };
  }
  companyData.status = 0;
  companyData.statusText = "Success";
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([200, companyData]);
    }, 1000);
  });
});

mock.onAny().passThrough();
export default mock;
