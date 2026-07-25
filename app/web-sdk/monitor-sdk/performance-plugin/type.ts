import { CLSMetric, FCPMetric, INPMetric, LCPMetric } from "web-vitals";

export interface PerformancePayload {
  type: string; // fp, fcp, lcp, cls, inp
  timing: PerformancePaintTiming | INPMetric | CLSMetric;
}

export interface NavigationPerformancePayload {
  type: string; // navigation
  timing?: PerformanceNavigationTiming;
}
