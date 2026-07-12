/* eslint-disable @typescript-eslint/no-explicit-any */
import { message } from "antd";

export interface CustomRequestOptions {
  returnBody?: boolean;
}

export async function request<T>(
  url: string,
  options: RequestInit & CustomRequestOptions,
): Promise<Awaited<T> | undefined> {
  try {
    const jsonRes = await fetch(url, options);
    const res = await jsonRes.json();
    if (res?.code === 0) {
      return options.returnBody ? res : res?.data;
    } else {
      message.error(res?.msg || "error");
    }
  } catch (error: any) {
    message.error(error?.message || "error");
  }
}
