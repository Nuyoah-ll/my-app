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
  content: string,
  reqApi: string,
): Promise<string> => {
  const jsonRes = await fetch(
    `http://localhost:3001/copywriting/get_approve_copywriting?${qs.stringify({
      content, // 文案
      sif_app_id: window.__sif_app_id__, // 来自于sif-sdk注入的体验平台ID
      sub_app_id: window.__sub_app_id__, // 来自于sif-sdk注入的子应用ID
      pid: location.pathname, // 当前页面的路径
      req_api: reqApi, // 拦截器里通过config获取到请求url的路径
    })}`,
    { method: "GET" },
  );
  const res = await jsonRes.json();
  return res?.data || content;
};

// 在请求拦截器里可以通过 response.config?.url 拿到 reqApi
export async function getTransformText(
  content: string,
  reqApi = "",
  timeout = 200,
): Promise<string> {
  try {
    const transformedText = await withTimeout(
      fetchTransformText(content, reqApi),
      timeout,
    );
    return transformedText;
  } catch {
    return content;
  }
}
