import { nanoid } from "nanoid";
import {
  DEFAULT_ENABLE_OPTIONS,
  RELEASE_VERSION,
  SESSION_ID_SESSION_STORAGE_KEY,
  USER_ID_LOCAL_STORAGE_KEY,
} from "./contants";
import {
  Common,
  ReportedEvent,
  EventType,
  MonitorSDKOptions,
  RuntimeOptions,
} from "./types";
import { hookObjectProperty } from "./utils";
import { JsErrorPlugin } from "./js-error-plugin";
import { HttpPlugin } from "./http-plugin";
import { ResourcePlugin } from "./resource-plugin";
import { PerformancePlugin } from "./performance-plugin";

export const getCommon = (options: RuntimeOptions): Common => {
  return {
    release: RELEASE_VERSION,
    bid: options.bid,
    pid: location.pathname,
    sessionId: options.sessionId,
    viewId: options.viewId,
    userId: options.userId,
    timestamp: Date.now(),
    url: location.href,
    userAgent: navigator.userAgent,
  };
};

export const eventList: ReportedEvent[] = [];

export const recordEvent = (event: ReportedEvent) => {
  eventList.push(event);
  console.log(event);
};

export class MonitorSDK {
  private currentPath: string | URL | undefined | null = location.pathname;
  private viewId: string;
  private sessionId: string;
  private options: MonitorSDKOptions;
  private jsErrorPlugin: JsErrorPlugin | null = null;
  private httpPlugin: HttpPlugin | null = null;
  private resourcePlugin: ResourcePlugin | null = null;
  private performancePlugin: PerformancePlugin | null = null;
  constructor(options: MonitorSDKOptions) {
    console.log(">>>>>>>>>>>>>>InitMonitorSDK");
    options.userId = this.initUserId(options);
    this.sessionId = this.initSessionId();
    this.viewId = this.initViewId();
    this.options = options;
    const runtimeOptions: RuntimeOptions = {
      ...options,
      userId: options.userId,
      sessionId: this.sessionId,
      viewId: this.viewId,
    };
    this.options.enable = {
      ...DEFAULT_ENABLE_OPTIONS,
      ...(this.options.enable || {}),
    };
    this.initPlugins(runtimeOptions);
  }

  initUserId(options: MonitorSDKOptions): string {
    const userId =
      options.userId ||
      localStorage.getItem(USER_ID_LOCAL_STORAGE_KEY) ||
      nanoid();
    localStorage.setItem(USER_ID_LOCAL_STORAGE_KEY, userId);
    return userId;
  }

  initSessionId(): string {
    const sessionId =
      sessionStorage.getItem(SESSION_ID_SESSION_STORAGE_KEY) || nanoid();
    sessionStorage.setItem(SESSION_ID_SESSION_STORAGE_KEY, sessionId);
    return sessionId;
  }

  initViewId(): string {
    hookObjectProperty(history, "pushState", (originPushState) => {
      return (...originPushStateParams) => {
        const [, , newPath] = originPushStateParams;
        if (newPath !== this.currentPath) {
          this.currentPath = newPath;
          this.viewId = nanoid();
        }
        originPushState(...originPushStateParams);
      };
    })();
    hookObjectProperty(history, "replaceState", (originReplaceState) => {
      return (...originReplaceStateParams) => {
        const [, , newPath] = originReplaceStateParams;
        if (newPath !== this.currentPath) {
          this.currentPath = newPath;
          this.viewId = nanoid();
        }
        originReplaceState(...originReplaceStateParams);
      };
    })();
    window.addEventListener("popstate", () => {
      const newPath = location.pathname;
      if (newPath !== this.currentPath) {
        this.currentPath = newPath;
        this.viewId = nanoid();
      }
    });
    return nanoid();
  }

  initPlugins(runtimeOptions: RuntimeOptions) {
    if (this.options.enable?.jsError) {
      this.jsErrorPlugin = new JsErrorPlugin(runtimeOptions);
    }
    if (this.options.enable?.http) {
      this.httpPlugin = new HttpPlugin(runtimeOptions);
    }
    if (this.options.enable?.resource) {
      this.resourcePlugin = new ResourcePlugin(runtimeOptions);
    }
    if (this.options.enable?.performance) {
      this.performancePlugin = new PerformancePlugin(runtimeOptions);
    }
  }
}
