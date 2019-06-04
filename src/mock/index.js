import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { config } from "../axios";

// This sets the mock adapter on the default instance
const mock = new MockAdapter(axios);

function defaultResponse(request, status, statusText) {
  console.log("Mock: " + request.url);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        200,
        {
          status: status,
          statusText: statusText
        }
      ]);
    }, 1000);
  });
}

function defaultSuccessResponse(request) {
  return defaultResponse(request, 0, "Success");
}

function defaultErrorResponse(request) {
  return defaultResponse(request, 1, "操作失败");
}

// Mock any GET request to /users
// arguments for reply are (status, data, headers)
mock.onPost(new RegExp(config.saa.baseURL + config.saa.userQuery)).reply(request => {
  console.log("Mock: " + request.url);
  let params = new URLSearchParams(request.url.substr(request.url.indexOf("?")).slice(1));
  let pagerData = {
    pageNo: parseInt(params.get("_pageNo")),
    pageSize: parseInt(params.get("_pageSize")),
    data: [],
    totalCount: 25
  };
  for (let i = 1; i <= pagerData.pageSize; i++) {
    let n = i + (pagerData.pageNo - 1) * pagerData.pageSize;
    if (n <= pagerData.totalCount) {
      pagerData.data.push({
        userCode:
          "01000" +
          Math.random()
            .toFixed(4)
            .replace(".", ""),
        userName: "姓名" + n,
        email: null,
        mobilePhone: "11111111111",
        password: "5037394F1146CF12C11E88AFC34D320C",
        salt: "0",
        secondValidate: null,
        gaCode: null,
        question: null,
        answer: null,
        sex: null,
        birthday: "9999-10-09T16:00:00.000+0000",
        comCode: "15100001008888888",
        comCName: "营业部",
        regTime: "2019-01-01",
        lastLoginFailed: null,
        lastTime: null,
        lastIp: null,
        type: null,
        qq: null,
        accountId: "2",
        officePhone: null,
        homePhone: "021-50722882",
        checked: "0",
        age: null,
        operators: null,
        passwordSetDate: null,
        passwordExpireDate: null,
        address: null,
        postCode: null,
        validStatus: "1",
        version: 5,
        insertTimeForHis: "2018-04-03T03:07:57.000+0000",
        operateTimeForHis: "2018-04-03T03:07:57.000+0000",
        versionId: "598"
      });
    }
  }
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        200,
        {
          ...pagerData,
          status: 0,
          statusText: "Success"
        }
      ]);
    }, 1500);
  });
});

mock.onPost(config.saa.baseURL + config.saa.userCreate).reply(defaultSuccessResponse);
mock.onPut(config.saa.baseURL + config.saa.userEdit).reply(defaultErrorResponse);
mock.onDelete(config.saa.baseURL + config.saa.userDelete).reply(defaultSuccessResponse);

mock.onGet(new RegExp(config.sdd.baseURL + config.sdd.baseCode.substr(0, config.sdd.baseCode.indexOf("{")))).reply(request => {
  console.log("Mock: " + request.url);
  let params = new URLSearchParams(request.url.substr(request.url.indexOf("?")).slice(1));
  let pagerData = {
    pageNo: params.get("pageNo"),
    pageSize: params.get("pageSize"),
    data: [],
    totalCount: 36
  };
  for (let i = 1; i <= pagerData.totalCount; i++) {
    pagerData.data.push({ code: i.toString(), value: `基础代码${i}` });
  }
  if (params.get("value")) {
    pagerData.data = [{ code: params.get("value"), value: "基础代码" + params.get("value") }];
  } else if (params.get("pageNo") && params.get("pageSize")) {
    if (params.get("search")) {
      let searchList = [];
      pagerData.data.forEach(item => {
        if (item.value.indexOf(params.get("search")) > -1) {
          searchList.push(item);
        }
      });
      pagerData.totalCount = searchList.length;
      pagerData.data = searchList.splice((parseInt(params.get("pageNo")) - 1) * parseInt(params.get("pageSize")), parseInt(params.get("pageSize")));
    } else {
      pagerData.data = pagerData.data.splice((parseInt(params.get("pageNo")) - 1) * parseInt(params.get("pageSize")), parseInt(params.get("pageSize")));
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
    comCode: "15100000000000000",
    comCName: "四川分",
    subList: [
      {
        comCode: "15100000001040000",
        comCName: "财务会计部"
      },
      {
        comCode: "15100000003080000",
        comCName: "业务管理部"
      },
      {
        comCode: "15100001008888888",
        comCName: "营业部",
        subList: [
          {
            comCode: "15100001308888888",
            comCName: "四川分公司营业部业务团队"
          },
          {
            comCode: "15100001108888888",
            comCName: "四川分公司营业部第一业务团队"
          },
          {
            comCode: "15100001208888888",
            comCName: "四川分公司营业部第二业务团队"
          },
          {
            comCode: "15100001508888888",
            comCName: "四川分公司营业部第五业务团队"
          },
          {
            comCode: "15100008008888888",
            comCName: "四川分公司营业部互联网渠道团队（Ｖ）"
          }
        ]
      },
      {
        comCode: "15100000002020000",
        comCName: "理赔服务部"
      },
      {
        comCode: "15100000003050000",
        comCName: "销售管理部"
      },
      {
        comCode: "15100000001100000",
        comCName: "综合行政部＆内控合规部"
      }
    ]
  };
  switch (comCode) {
    case "":
      break;
    case "15100001008888888":
      companyData = companyData.subList[2];
      break;
    case "15100001308888888":
      companyData = companyData.subList[2].subList[0];
      break;
    default:
      companyData = null;
      break;
  }
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        200,
        {
          data: [companyData],
          status: 0,
          statusText: "Success"
        }
      ]);
    }, 500);
  });
});
// mock.onPost(config.saa.baseURL + config.saa.roleListAll).reply( request =>{
//   console.log("Mock: " + request.url);
//   return new Promise(resolve => {
//     setTimeout(() => {
//       resolve([
//         200,
//         {
//           data: {
//             roles: [
//               {
//                 "roleCode": "3",
//                 "roleName": "3",
//                 "validInd": "1",
//                 "remark": null,
//                 "flag": null,
//                 "version": 1
//               },
//               {
//                 "roleCode": "111111",
//                 "roleName": "营业员",
//                 "validInd": "1",
//                 "remark": null,
//                 "flag": null,
//                 "version": 1
//               },
//               {
//                 "roleCode": "111112",
//                 "roleName": "业务员",
//                 "validInd": "1",
//                 "remark": null,
//                 "flag": null,
//                 "version": 1
//               },
//               {
//                 "roleCode": "111113",
//                 "roleName": "饲养员",
//                 "validInd": "1",
//                 "remark": null,
//                 "flag": null,
//                 "version": 1
//               },
//               {
//                 "roleCode": "1",
//                 "roleName": "1",
//                 "validInd": "1",
//                 "remark": null,
//                 "flag": null,
//                 "version": 1
//               },
//               {
//                 "roleCode": "2",
//                 "roleName": "清洁",
//                 "validInd": "1",
//                 "remark": null,
//                 "flag": null,
//                 "version": 1
//               },
//               {
//                 "roleCode": "6",
//                 "roleName": "快递",
//                 "validInd": "1",
//                 "remark": "2",
//                 "flag": null,
//                 "version": 1
//               },
//               {
//                 "roleCode": "111114",
//                 "roleName": "测试",
//                 "validInd": "1",
//                 "remark": null,
//                 "flag": null,
//                 "version": 1
//               }
//             ]
//           },
//           totalCount: 8,
//           status: 0,
//           statusText: "Success"
//         }
//       ]);
//     }, 100);
//   });
// });

mock.onAny().passThrough();
export default mock;
