import { getCommon, recordEvent } from "..";
import { EventType, RuntimeOptions } from "../types";
import { hookObjectProperty } from "../utils";

export class HttpPlugin {
  private runtimeOptions: RuntimeOptions;

  constructor(runtimeOptions: RuntimeOptions) {
    console.log("init HttpPlugin");
    this.runtimeOptions = runtimeOptions;
    this.init();
  }

  init() {
    // 拦截fetch请求，获取：1.请求相关的参数；2.响应相关的参数；3.性能指标（在请求完成后获取）
    hookObjectProperty(window, "fetch", (originFecth) => {
      return async (request: RequestInfo | URL, init?: RequestInit) => {
        const clonedRequest = new Request(request, init);
        const url = clonedRequest.url;
        const method = clonedRequest.method;
        const requestHeaders = Object.fromEntries(clonedRequest.headers);
        const requestBody = await clonedRequest.text();
        return originFecth(request, init)
          .then(async (response) => {
            const clonedResponse = await response.clone();
            const httpStatus = clonedResponse.status;
            const httpStatusText = clonedResponse.statusText;
            const responseHeaders = Object.fromEntries(clonedResponse.headers);
            const responseBody = await clonedResponse.text();
            const entries = performance.getEntriesByType(
              "resource",
            ) as PerformanceResourceTiming[];
            const timing = entries.find((entry) => entry.name === url);
            recordEvent({
              ev_type: EventType.Http,
              common: getCommon(this.runtimeOptions),
              payload: {
                url,
                method,
                requestHeaders,
                responseHeaders,
                requestBody,
                responseBody,
                httpStatus,
                httpStatusText,
                timing,
              },
            });
            return response;
          })
          .catch((error) => {
            recordEvent({
              ev_type: EventType.Http,
              common: getCommon(this.runtimeOptions),
              payload: {
                url,
                method,
                requestHeaders,
                responseHeaders: {},
                requestBody,
                responseBody: "",
                httpStatus: 0,
                httpStatusText: "",
                timing: undefined,
              },
            });
            return Promise.reject(error);
          });
      };
    })();
  }
}
