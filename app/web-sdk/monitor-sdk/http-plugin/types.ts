export interface HttpPayload {
  url: string;
  method: string;
  requestHeaders: Record<string, string>;
  responseHeaders?: Record<string, string>;
  requestBody?: string;
  responseBody?: string;
  httpStatus: number;
  httpStatusText: string;
  timing?: PerformanceResourceTiming;
}
