import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { config } from "../axios";

// This sets the mock adapter on the default instance
var mock = new MockAdapter(axios);

// Mock any GET request to /users
// arguments for reply are (status, data, headers)
mock
  .onPost(axios.defaults.baseURL + config.businessDataQuery)
  .reply(function() {
    return new Promise(function(resolve) {
      setTimeout(function() {
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

mock
  .onGet(
    new RegExp(
      config.sdd.baseURL +
        config.sdd.baseCode.substr(0, config.sdd.baseCode.indexOf("{"))
    )
  )
  .reply(function(request) {
    let params = new URLSearchParams(
      request.url.substr(request.url.indexOf("?")).slice(1)
    );
    let listData = [
      { code: "1", value: "基础代码1" },
      { code: "2", value: "基础代码2" },
      { code: "3", value: "基础代码3" }
    ];
    let total = undefined;
    if (params.get("pageNo") && params.get("pageSize")) {
      total = 36;
      listData = [];
      for (let i = 1; i <= parseInt(params.get("pageSize")); i++) {
        let n =
          i +
          (parseInt(params.get("pageNo")) - 1) *
            parseInt(params.get("pageSize"));
        if (n <= total) {
          listData.push({ code: n.toString(), value: "基础代码" + n });
        }
      }
    }
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve([
          200,
          {
            list: listData,
            total: total,
            status: 0,
            statusText: "Success"
          }
        ]);
      }, 100);
    });
  });

mock
  .onGet(
    new RegExp(
      config.sdd.baseURL +
        config.sdd.baseCode.substr(0, config.sdd.baseCode.indexOf("{"))
    )
  )
  .reply(function(request) {
    let params = new URLSearchParams(
      request.url.substr(request.url.indexOf("?")).slice(1)
    );
    let listData = [
      { code: "1", value: "基础代码1" },
      { code: "2", value: "基础代码2" },
      { code: "3", value: "基础代码3" }
    ];
    let total = undefined;
    if (params.get("pageNo") && params.get("pageSize")) {
      total = 36;
      listData = [];
      for (let i = 1; i <= parseInt(params.get("pageSize")); i++) {
        let n =
          i +
          (parseInt(params.get("pageNo")) - 1) *
            parseInt(params.get("pageSize"));
        if (n <= total) {
          listData.push({ code: n.toString(), value: "基础代码" + n });
        }
      }
    }
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve([
          200,
          {
            list: listData,
            total: total,
            status: 0,
            statusText: "Success"
          }
        ]);
      }, 100);
    });
  });
mock.onGet(config.sdd.baseURL + config.treeQuery).reply(function() {
  return new Promise(function(resolve) {
    setTimeout(function() {
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
  });
});
mock
  .onGet(
    new RegExp(
      config.sdd.baseURL +
        config.sdd.baseCode.substr(0, config.sdd.baseCode.indexOf("/"))
    )
  )
  .reply(function(request) {
    return new Promise(function(resolve) {
      let params = parseInt(
        request.url.substr(request.url.charAt(1)).slice(request.url.length - 1)
      );
      setTimeout(function() {
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
    });
  });
mock.onAny().passThrough();
export default mock;
