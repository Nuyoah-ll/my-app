// app/components/SDKInitializer.tsx
"use client";

import { useEffect } from "react";
import { MonitorSDK } from "@/app/web-sdk/monitor-sdk";

export function SDKInitializer() {
  useEffect(() => {
    new MonitorSDK({
      bid: "123456",
    });
  }, []); // 空依赖确保只执行一次

  return null; // 不渲染任何 UI
}
