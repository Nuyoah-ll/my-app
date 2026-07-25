import { getCommon, recordEvent } from "..";
import { EventType, RuntimeOptions } from "../types";
import { onCLS, onINP } from "web-vitals";

export class PerformancePlugin {
  runtimeOptions: RuntimeOptions;
  constructor(runtimeOptions: RuntimeOptions) {
    console.log("init PerformancePlugin");
    this.runtimeOptions = runtimeOptions;
    this.collectPerformanceTiming();
  }

  collectPerformanceTiming() {
    const list = performance.getEntriesByType("paint");
    list.entries().forEach(([_, item]) => {
      if (item.name === "first-paint") {
        recordEvent({
          ev_type: EventType.Performance,
          common: getCommon(this.runtimeOptions),
          payload: {
            type: "fp",
            timing: item,
          },
        });
      }
      if (item.name === "first-contentful-paint") {
        recordEvent({
          ev_type: EventType.Performance,
          common: getCommon(this.runtimeOptions),
          payload: {
            type: "fcp",
            timing: item,
          },
        });
      }
    });
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === "largest-contentful-paint") {
          recordEvent({
            ev_type: EventType.Performance,
            common: getCommon(this.runtimeOptions),
            payload: {
              type: "lcp",
              timing: entry,
            },
          });
        }
        if (entry.entryType === "navigation") {
          recordEvent({
            ev_type: EventType.PerformanceNavigationTiming,
            common: getCommon(this.runtimeOptions),
            payload: {
              type: "navigation",
              timing: entry,
            },
          });
        }
      });
    });
    observer.observe({ type: "largest-contentful-paint", buffered: true });
    observer.observe({ type: "navigation", buffered: true });

    // 可以通过observer来观察type为layout-shift的性能事件来自己计算，但是比较麻烦，这里就不实现了
    onCLS((cls) => {
      recordEvent({
        ev_type: EventType.Performance,
        common: getCommon(this.runtimeOptions),
        payload: {
          type: "cls",
          timing: cls,
        },
      });
    });
    onINP((inp) => {
      recordEvent({
        ev_type: EventType.Performance,
        common: getCommon(this.runtimeOptions),
        payload: {
          type: "inp",
          timing: inp,
        },
      });
    });
  }
}
