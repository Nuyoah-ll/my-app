import { getCommon, MonitorSDK } from "..";
import { EventType, ReportedEvent, RuntimeOptions } from "../types";

export class BlankScreenPlugin {
  private sdkInstance: MonitorSDK;
  private runtimeOptions: RuntimeOptions;
  private idleCallbackId: number | null = null;
  private backTestTimerId: NodeJS.Timeout | null = null;
  private relatedEvents: ReportedEvent[] = [];
  private reported = false;
  constructor(runtimeOptions: RuntimeOptions, sdkInstance: MonitorSDK) {
    console.log("init BlankScreenPlugin");
    this.runtimeOptions = runtimeOptions;
    this.sdkInstance = sdkInstance;
    this.init();
  }

  private IGNORE_ELEMENTS: string[] = ["SCRIPT", "STYLE", "META", "HEAD"]; // 忽略的元素类型
  private MAX_DEPTH = 4; // 最大递归深度，超过该深度不计算
  private THRESHOLD = 1.5; // 打分阈值，小于该值认为是白屏
  private MAX_RENDER_TIME = 10000; // 最大渲染时间，当渲染时间超过该值后，认为页面进入了一个稳定的运行阶段
  private INIT_DETECTION_TIME = 8000; // 首屏回测任务检测时间窗口
  private RUN_DETECTION_TIME = 4000; // 非首屏回测任务检测窗口时间
  private MAX_RELATED_EVENTS_TIME = 10000; // 关联事件的最大时间间隔
  private EVENT_WHITE_LIST: EventType[] = [
    EventType.PerformanceNavigationTiming,
    EventType.Performance,
  ]; // 回测任务期间检测的事件上报
  private EVENT_BLACK_LIST: EventType[] = [
    EventType.JsError,
    EventType.Http,
    EventType.ResourceError,
  ]; // 回测任务期间检测的事件上报

  public addRelatedEvent(event: ReportedEvent) {
    this.relatedEvents.push(event);
  }

  private removeAllRelatedEvents() {
    this.relatedEvents = [];
  }

  // 从根节点DFS，计算每个节点的得分，累加，最多判断4层，当节点得分超过阈值时，不再计算，直接返回阈值对应的得分
  private measure(
    element: Element,
    depth = 0,
    sum = 0,
    threshold = this.THRESHOLD,
    maxDepth = this.MAX_DEPTH,
    ignoreElements = this.IGNORE_ELEMENTS,
  ) {
    if (
      !element ||
      ignoreElements.includes(element.tagName) ||
      depth > maxDepth ||
      sum >= threshold
    ) {
      return sum;
    }
    let score = 0;
    const { top, height } = element.getBoundingClientRect();
    // 1. 元素不在视野内；2.元素的高度为0时；3.根节点 得分为0
    if (top > innerHeight || height <= 0 || depth === 0) {
      score = 0;
    } else {
      // 第一层元素得分是1，第二层元素得分是0.5，第三层元素得分是0.25，第四层元素得分是0.125
      score = 1 / Math.pow(2, depth - 1);
    }
    sum += score;
    for (const child of [...element.children].reverse()) {
      if (sum >= threshold) {
        return sum;
      }
      sum = this.measure(
        child,
        depth + 1,
        sum,
        threshold,
        maxDepth,
        ignoreElements,
      );
    }
    return sum;
  }

  init() {
    this.startObserver();
  }

  destroy() {
    if (this.idleCallbackId) {
      cancelIdleCallback(this.idleCallbackId);
      this.idleCallbackId = null;
    }
    if (this.backTestTimerId) {
      clearTimeout(this.backTestTimerId);
      this.backTestTimerId = null;
    }
    this.reported = false;
    this.removeAllRelatedEvents();
  }

  checkIfAllowedReport(delta: number, score: number) {
    const currentTimestamp = Date.now();
    const isInCheckWindow = (item: ReportedEvent) =>
      currentTimestamp - item.common.timestamp <= delta;
    const isInRelativeWindow = (item: ReportedEvent) =>
      currentTimestamp - item.common.timestamp <= this.MAX_RELATED_EVENTS_TIME;

    // 在检测窗口内有非白名单事件上报，则属于白屏误报，继续调度打分任务，如果没有，则属于正常白屏，需要上报白屏事件
    if (
      this.relatedEvents.length > 0 &&
      this.relatedEvents
        .filter(isInCheckWindow)
        .some((item) => !this.EVENT_WHITE_LIST.includes(item.ev_type))
    ) {
      console.log("白屏误报，继续调度打分任务");
      this.schedule();
    } else {
      console.log("白屏检测成功，关联其他异常事件一起上报");
      // 白屏检测成功，关联其他异常事件一起上报
      this.sdkInstance.recordEvent(
        {
          ev_type: EventType.BlankScreen,
          common: getCommon(this.runtimeOptions),
          payload: {
            score: score,
            screenshot: "", // TODO: 上报截图
            relatedEvents: this.relatedEvents
              .filter(isInRelativeWindow)
              .filter((item) => this.EVENT_BLACK_LIST.includes(item.ev_type)),
          },
        },
        false,
      );
      this.destroy();
    }
  }

  startBackTest(score: number) {
    console.log("开始回测任务");
    const start = performance.now();
    const delta =
      start > this.MAX_RENDER_TIME
        ? this.RUN_DETECTION_TIME
        : this.INIT_DETECTION_TIME;
    this.backTestTimerId = setTimeout(() => {
      this.checkIfAllowedReport(delta, score);
    }, delta);
  }

  startScoring() {
    console.log("开始白屏打分任务");
    const score = this.measure(document.body);
    if (score < this.THRESHOLD) {
      console.log("初步检测到白屏了，开始执行回测任务");
      this.startBackTest(score);
    } else {
      // 页面非空屏，等待下一次打分任务即可
      console.log("当前页面非白屏，等待下一次打分任务");
    }
  }

  schedule() {
    console.log("开始调度打分任务");
    // 如果有已经存在的打分任务，则取消它
    if (this.idleCallbackId) {
      cancelIdleCallback(this.idleCallbackId);
      this.idleCallbackId = null;
    }
    // 如果有已经存在的回测任务，则取消它
    if (this.backTestTimerId) {
      clearTimeout(this.backTestTimerId);
      this.backTestTimerId = null;
    }
    // 开启一个新的打分任务
    this.idleCallbackId = requestIdleCallback(() => {
      this.startScoring();
    });
  }

  startObserver() {
    console.log("初始化监听器");
    // 监听页面变更，每次变更后都检测是否存在已经有的打分任务，如果有，则重新调度一次打分任务，如果没有，则调度一次打分任务
    // 1. 监听DOM变更；2.监听资源加载；3.监听长任务；4.监听页面可见性变化；5.请求发送等

    // DOM变更
    const mutationObserver = new MutationObserver(() => {
      this.schedule();
    });
    mutationObserver.observe(document.body, { subtree: true, childList: true });

    const performanceObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach(() => {
        this.schedule();
      });
    });
    // 资源加载和请求发送
    performanceObserver.observe({ type: "resource", buffered: true });
    // 长任务
    performanceObserver.observe({ type: "longtask", buffered: true });

    // 页面可见性变化
    document.addEventListener("visibilitychange", () => {
      this.schedule();
    });
  }
}
