import { MonitorSDKOptions } from "./types";

export const USER_ID_LOCAL_STORAGE_KEY = "monitor-sdk-userId";
export const SESSION_ID_SESSION_STORAGE_KEY = "monitor-sdk-sessionId";


export const RELEASE_VERSION = "1.0.0";

export const DEFAULT_ENABLE_OPTIONS: MonitorSDKOptions["enable"] = {
  jsError: true,
  http: true,
  resource: true,
  performance: true,
  blankScreen: true,
}