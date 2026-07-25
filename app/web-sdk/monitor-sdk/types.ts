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

export interface ReportedEvent {
  ev_type: EventType;
  common: Common;
  payload:
    | JsErrorPayload
    | HttpPayload
    | ResourceErrorPayload
    | ResourceTimingPayload
    | PerformancePayload
    | NavigationPerformancePayload;
}
