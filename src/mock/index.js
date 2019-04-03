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
  .reply(function() {
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve([
          200,
          {
            list: [
              { code: "1", value: "基础代码1" },
              { code: "2", value: "基础代码2" },
              { code: "3", value: "基础代码3" }
            ],
            status: 0,
            statusText: "Success"
          }
        ]);
      }, 100);
    });
  });

mock.onAny().passThrough();
export default mock;
