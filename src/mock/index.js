import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { config } from "../axios";

// This sets the mock adapter on the default instance
const mock = new MockAdapter(axios);

// Mock any GET request to /users
// arguments for reply are (status, data, headers)
mock.onPost(axios.defaults.baseURL + config.businessDataQuery).reply(
  () =>
    new Promise(resolve => {
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
    })
);

mock.onGet(new RegExp(config.sdd.baseURL + config.sdd.baseCode.substr(0, config.sdd.baseCode.indexOf("{")))).reply(request => {
  const params = new URLSearchParams(request.url.substr(request.url.indexOf("?")).slice(1));
  let listData = [{ code: "1", value: "基础代码1" }, { code: "2", value: "基础代码2" }, { code: "3", value: "基础代码3" }];
  let total;
  if (params.get("pageNo") && params.get("pageSize")) {
    total = 36;
    listData = [];
    for (let i = 1; i <= parseInt(params.get("pageSize")); i++) {
      const n = i + (parseInt(params.get("pageNo")) - 1) * parseInt(params.get("pageSize"));
      if (n <= total) {
        listData.push({ code: n.toString(), value: `基础代码${n}` });
      }
    }
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

mock.onGet(new RegExp(config.sdd.baseURL + config.sdd.baseCode.substr(0, config.sdd.baseCode.indexOf("{")))).reply(request => {
  const params = new URLSearchParams(request.url.substr(request.url.indexOf("?")).slice(1));
  let listData = [{ code: "1", value: "基础代码1" }, { code: "2", value: "基础代码2" }, { code: "3", value: "基础代码3" }];
  let total;
  if (params.get("pageNo") && params.get("pageSize")) {
    total = 36;
    listData = [];
    for (let i = 1; i <= parseInt(params.get("pageSize")); i++) {
      const n = i + (parseInt(params.get("pageNo")) - 1) * parseInt(params.get("pageSize"));
      if (n <= total) {
        listData.push({ code: n.toString(), value: `基础代码${n}` });
      }
    }
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
mock.onGet(config.sdd.baseURL + config.treeQuery).reply(
  () =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve([
          200,
          {
            options: [
              {
                parentId: "0",
                value: "A",
                label: "label-A"
              },
              {
                parentId: "1",
                value: "B",
                label: "label-B"
              },
              {
                parentId: "2",
                value: "C",
                label: "label-C"
              }
            ],
            status: 0,
            statusText: "Success"
          }
        ]);
      }, 1000);
    })
);
mock.onGet(new RegExp(config.sdd.baseURL + config.sdd.baseCode.substr(0, config.sdd.baseCode.indexOf("/")))).reply(
  request =>
    new Promise(resolve => {
      const params = parseInt(request.url.substr(request.url.charAt(1)).slice(request.url.length - 1));
      setTimeout(() => {
        resolve([
          200,
          {
            options: [
              {
                parentId: `${params + 1}`,
                value: `sub-${params}`,
                label: `sub-label-${params}`
              }
            ],
            status: 0,
            statusText: "Success"
          }
        ]);
      }, 1000);
    })
);
mock.onAny().passThrough();
export default mock;
