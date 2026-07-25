import { getCommon, recordEvent } from "..";
import { EventType, RuntimeOptions } from "../types";

export class ResourcePlugin {
  private runtimeOptions: RuntimeOptions;

  constructor(runtimeOptions: RuntimeOptions) {
    console.log("init ResourcePlugin");
    this.runtimeOptions = runtimeOptions;
    this.init();
  }

  init() {
    this.collectResourceError();
    this.collectResourceTiming();
  }

  collectResourceError() {
    // 采集通过如下方式加载的静态资源错误，这类错误只能在捕获阶段采集
    // 1. script、link、img、video、audio等标签
    // 2. 通过Image、Audio等加载的资源
    window.addEventListener(
      "error",
      (event) => {
        console.log(event);
        const { target } = event;
        if (!(target instanceof HTMLElement)) {
          return;
        }
        const url = this.getUrlByTagName(target);
        const enties = performance.getEntriesByType(
          "resource",
        ) as PerformanceResourceTiming[];
        const timing = enties.find((item) => item.name === url);
        recordEvent({
          ev_type: EventType.ResourceError,
          common: getCommon(this.runtimeOptions),
          payload: {
            initiatorType: target.tagName.toLowerCase(),
            url,
            timing,
          },
        });
      },
      true,
    );
  }

  collectResourceTiming() {
    // 采集资源加载时间
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((item) => {
        recordEvent({
          ev_type: EventType.ResourcePerformance,
          common: getCommon(this.runtimeOptions),
          payload: {
            initiatorType: item.name,
            url: item.name,
            timing: item as PerformanceResourceTiming,
          },
        });
      });
    });
    observer.observe({ type: "resource", buffered: true });
  }

  private getUrlByTagName(target: HTMLElement) {
    const { tagName } = target;
    const upperTagName = tagName.toUpperCase();
    if (upperTagName === "SCRIPT") {
      return (target as HTMLScriptElement)?.src || "";
    }
    if (upperTagName === "LINK") {
      return (target as HTMLLinkElement)?.href || "";
    }
    if (upperTagName === "IMG") {
      return (target as HTMLImageElement)?.src || "";
    }
    if (upperTagName === "VIDEO") {
      return (target as HTMLVideoElement)?.src || "";
    }
    if (upperTagName === "AUDIO") {
      return (target as HTMLAudioElement)?.src || "";
    }
    return "";
  }
}
