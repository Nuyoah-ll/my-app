import { EventType, RuntimeOptions } from "../types";
import { getCommon, recordEvent } from "..";
import ErrorStackParser from "error-stack-parser";

export class JsErrorPlugin {
  private runtimeOptions: RuntimeOptions;

  constructor(options: RuntimeOptions) {
    console.log("init JsErrorPlugin");
    this.runtimeOptions = options;
    this.init();
  }

  async init() {
    window.addEventListener("error", (event) => {
      recordEvent({
        ev_type: EventType.JsError,
        common: getCommon(this.runtimeOptions),
        payload: {
          type: event.type,
          message: event.error.message,
          stack: ErrorStackParser.parse(event.error),
        },
      });
    });

    window.addEventListener("unhandledrejection", (event) => {
      recordEvent({
        ev_type: EventType.JsError,
        common: getCommon(this.runtimeOptions),
        payload: {
          type: event.type,
          message: event.reason.message,
          stack: ErrorStackParser.parse(event.reason),
        },
      });
    });
  }
}
