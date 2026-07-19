export interface InitSifSdkParams {
  sifAppId: number;
  subAppId: number;
}

// TODO: 有空研究下体验平台提供的各种能力，没空就算了
/**
 * sif sdk是用来接入到体验平台的，提供了收集体验分、文案分等各种功能，这里就先只在全局存一下 sif_app_id 和 sub_app_id
 */
export function initSifSdk({ sifAppId, subAppId }: InitSifSdkParams): void {
  // 初始化 sif sdk
  window.__sif_app_id__ = sifAppId;
  window.__sub_app_id__ = subAppId;

  // TODO: 初始化 sif sdk 后续逻辑
}
