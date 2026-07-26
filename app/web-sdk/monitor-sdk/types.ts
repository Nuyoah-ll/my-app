import { HttpPayload } from "./http-plugin/types";
import { JsErrorPayload } from "./js-error-plugin/types";
import {
  PerformancePayload,
  NavigationPerformancePayload,
} from "./performance-plugin/type";
import {
  ResourceErrorPayload,
  ResourceTimingPayload,
} from "./resource-plugin/types";
import { BlankScreenPayload } from "./blank-screen-plugin/types";

export interface MonitorSDKOptions {
  bid: string;
  userId?: string;
  enable?: {
    jsError?: boolean;
    http?: boolean;
    resource?: boolean;
    performance?: boolean;
    blankScreen?: boolean;
  };
}

export interface RuntimeOptions extends MonitorSDKOptions {
  userId: string;
  sessionId: string;
  viewId: string;
}

export enum EventType {
  PageView = "pageView",
  JsError = "jsError",
  Http = "http",
  ResourceError = "resourceError",
  ResourcePerformance = "resourcePerformance",
  Performance = "performance",
  PerformanceNavigationTiming = "performanceNavigationTiming",
  BlankScreen = "blankScreen",
}

export interface Common {
  release: string;
  bid: string;
  pid: string;
  sessionId: string;
  viewId: string;
  userId: string;
  timestamp: number;
  url: string;
  userAgent?: string;
}

export interface PageViewPayload {
  source: string; // 触发原因，例如：切换路由、初始化加载
}

export interface ReportedEvent {
  ev_type: EventType;
  common: Common;
  payload:
    | PageViewPayload
    | JsErrorPayload
    | HttpPayload
    | ResourceErrorPayload
    | ResourceTimingPayload
    | PerformancePayload
    | NavigationPerformancePayload
    | BlankScreenPayload;
}
