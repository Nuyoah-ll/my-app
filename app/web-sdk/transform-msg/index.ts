/**
 * @description 文案转换sdk是用来将文案转换为符合体验平台要求的文案，这里透出获取转换后文案的方法，业务方在axios、fetch等请求拦截器里调用这个方法做替换即可
 */

import qs from "qs";

declare global {
  interface Window {
    __sif_app_id__: number;
    __sub_app_id__: number;
  }
}

const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    promise
      .then((result) => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
};

const fetchTransformText = async (
  text: string,
  reqApi: string,
): Promise<string> => {
  const jsonRes = await fetch(
    `http://localhost:3001/copywriting/get_approve_copywriting?${qs.stringify({
      text,
      sif_app_id: window.__sif_app_id__,
      sub_app_id: window.__sub_app_id__,
      pid: location.pathname,
      req_api: reqApi,
    })}`,
    { method: "GET" },
  );
  const res = await jsonRes.json();
  return res?.data || text;
};

// 在请求拦截器里可以通过 response.config?.url 拿到 reqApi
export async function getTransformText(
  text: string,
  reqApi = "",
  timeout = 200,
): Promise<string> {
  try {
    const transformedText = await withTimeout(
      fetchTransformText(text, reqApi),
      timeout,
    );
    return transformedText;
  } catch {
    return text;
  }
}
