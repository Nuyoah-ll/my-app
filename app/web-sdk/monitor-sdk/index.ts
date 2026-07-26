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
  MonitorSDKOptions,
  RuntimeOptions,
  EventType,
} from "./types";
import { hookObjectProperty } from "./utils";
import { JsErrorPlugin } from "./js-error-plugin";
import { HttpPlugin } from "./http-plugin";
import { ResourcePlugin } from "./resource-plugin";
import { PerformancePlugin } from "./performance-plugin";
import { BlankScreenPlugin } from "./blank-screen-plugin";

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

export class MonitorSDK {
  private currentPath: string | URL | undefined | null = location.pathname;
  private userId: string;
  private viewId: string;
  private sessionId: string;
  private options: MonitorSDKOptions;
  private jsErrorPlugin: JsErrorPlugin | null = null;
  private httpPlugin: HttpPlugin | null = null;
  private resourcePlugin: ResourcePlugin | null = null;
  private performancePlugin: PerformancePlugin | null = null;
  private blankScreenPlugin: BlankScreenPlugin | null = null;
  private eventList: ReportedEvent[] = [];
  constructor(options: MonitorSDKOptions) {
    console.log(">>>>>>>>>>>>>>InitMonitorSDK");
    this.options = options;
    this.userId = options.userId = this.initUserId(options);
    this.sessionId = this.initSessionId();
    this.viewId = this.initViewId();
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

  public recordEvent(event: ReportedEvent, relateToBlankScreen = true) {
    if (relateToBlankScreen) {
      this.blankScreenPlugin?.addRelatedEvent(event);
    }
    this.eventList.push(event);
    console.log(event);
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
          this.recordEvent({
            ev_type: EventType.PageView,
            common: getCommon({
              ...this.options,
              viewId: this.viewId,
              sessionId: this.sessionId,
              userId: this.userId,
            }),
            payload: {
              source: "pushState",
            },
          });
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
          this.recordEvent({
            ev_type: EventType.PageView,
            common: getCommon({
              ...this.options,
              viewId: this.viewId,
              sessionId: this.sessionId,
              userId: this.userId,
            }),
            payload: {
              source: "replaceState",
            },
          });
        }
        originReplaceState(...originReplaceStateParams);
      };
    })();
    window.addEventListener("popstate", () => {
      const newPath = location.pathname;
      if (newPath !== this.currentPath) {
        this.currentPath = newPath;
        this.viewId = nanoid();
        this.recordEvent({
          ev_type: EventType.PageView,
          common: getCommon({
            ...this.options,
            viewId: this.viewId,
            sessionId: this.sessionId,
            userId: this.userId,
          }),
          payload: {
            source: "popstate",
          },
        });
      }
    });
    const viewId = nanoid();
    this.recordEvent({
      ev_type: EventType.PageView,
      common: getCommon({
        ...this.options,
        viewId: viewId,
        sessionId: this.sessionId,
        userId: this.userId,
      }),
      payload: {
        source: "initViewId",
      },
    });
    return viewId;
  }

  initPlugins(runtimeOptions: RuntimeOptions) {
    if (this.options.enable?.jsError) {
      this.jsErrorPlugin = new JsErrorPlugin(runtimeOptions, this);
    }
    if (this.options.enable?.http) {
      this.httpPlugin = new HttpPlugin(runtimeOptions, this);
    }
    if (this.options.enable?.blankScreen) {
      this.blankScreenPlugin = new BlankScreenPlugin(runtimeOptions, this);
    }
    if (this.options.enable?.resource) {
      this.resourcePlugin = new ResourcePlugin(runtimeOptions, this);
    }
    if (this.options.enable?.performance) {
      this.performancePlugin = new PerformancePlugin(runtimeOptions, this);
    }
  }
}
