/* eslint-disable @typescript-eslint/no-explicit-any */
import { message } from "antd";

export interface CustomRequestOptions {
  returnBody?: boolean;
}

export async function request<T>(
  url: string,
  options: RequestInit & CustomRequestOptions,
): Promise<Awaited<T> | undefined> {
  const jsonRes = await fetch(url, options);
  const res = await jsonRes.json();
  if (res?.code === 0) {
    return options.returnBody ? res : res?.data;
  } else {
    message.error(res?.msg || "error");
    throw new Error(res?.msg || "error");
  }
}
