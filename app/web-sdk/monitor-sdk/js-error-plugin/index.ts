import { EventType, RuntimeOptions } from "../types";
import { getCommon, MonitorSDK } from "..";
import ErrorStackParser from "error-stack-parser";

export class JsErrorPlugin {
  private runtimeOptions: RuntimeOptions;
  private sdkInstance: MonitorSDK;

  constructor(options: RuntimeOptions, sdkInstance: MonitorSDK) {
    console.log("init JsErrorPlugin");
    this.runtimeOptions = options;
    this.sdkInstance = sdkInstance;
    this.init();
  }

  async init() {
    window.addEventListener("error", (event) => {
      this.sdkInstance.recordEvent({
        ev_type: EventType.JsError,
        common: getCommon(this.runtimeOptions),
        payload: {
          type: event.type,
          name: event.error.stack.split(":")[0],
          message: event.error.message,
          stack: ErrorStackParser.parse(event.error),
        },
      });
    });

    window.addEventListener("unhandledrejection", (event) => {
      this.sdkInstance.recordEvent({
        ev_type: EventType.JsError,
        common: getCommon(this.runtimeOptions),
        payload: {
          type: event.type,
          name: event.reason.stack.split(":")[0],
          message: event.reason.message,
          stack: ErrorStackParser.parse(event.reason),
        },
      });
    });
  }
}
