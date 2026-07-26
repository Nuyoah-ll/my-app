export interface ResourceErrorPayload {
  url: string;
  type: string;
  timing?: PerformanceResourceTiming;
}

export interface ResourceTimingPayload {
  url: string;
  timing?: PerformanceResourceTiming;
}
