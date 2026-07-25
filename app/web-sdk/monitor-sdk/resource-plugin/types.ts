export interface ResourceErrorPayload {
  url: string;
  initiatorType: string;
  timing?: PerformanceResourceTiming;
}

export interface ResourceTimingPayload {
  url: string;
  initiatorType: string;
  timing?: PerformanceResourceTiming;
}
