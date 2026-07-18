export type FieldType = {
  cluster_content?: string;
  score_min?: number;
  score_max?: number;
  sif_app_id?: number;
  sif_app_name?: string;
  sub_app_id?: number;
  app_name?: string;
  pid?: string;
  monitor_platform_bid?: string;
  is_from_req?: number;
  req_api?: string;
  res_code?: number;
  res_log_id?: string;
  psm?: string;
};

export type OperateType = 0 | 1 | 2 | 3 | 4;

export interface OperateLogFieldType {
  operate_type?: OperateType;
  create_by?: string;
}

export interface CopywritingLogRecord {
  id: number;
  content_id: number;
  operate_type: OperateType;
  operate_info: string;
  create_by: string;
  create_at: string;
}

export type HistoryType = 1 | 2;

export interface ModifyLogFieldType {
  is_approved?: boolean;
  type?: HistoryType;
  create_by?: string;
  modified_content?: string;
  modified_score_min?: number;
  modified_score_max?: number;
}

export interface CopywritingHistoryRecord {
  id: number;
  content_id: number;
  modified_content: string;
  modified_score: number;
  modified_reason: string;
  modified_dimension_scores: { score: number; weight: number; type: string }[];
  create_by: string;
  create_at: string;
  type: HistoryType;
  is_approved: boolean;
}

export interface CopywritingRecord {
  id: number;
  last_date: string;
  cluster_content: string;
  score: number;
  reason: string;
  dimension_scores: { score: number; weight: number; type: string }[];
  approve_content?: string;
  last_pv: number;
  last_uv: number;
  type_list: string[];
  component_list: string[];
  sif_app_id: number;
  sif_app_name: string;
  sub_app_id: number;
  app_name: string;
  app_desc: string;
  pid: string;
  page_id: number;
  page_name: string;
  monitor_platform_bid: string;
  is_from_req: number;
  req_api: string;
  res_code: number;
  res_log_id: string;
  psm: string;
  name: string;
  path: string;
  owners: string[];
  parent1_name: string;
  parent2_name: string;
  parent3_name: string;
  create_at: string;
  create_by: string;
  update_at: string;
  update_by: string;
  cluster_content_hash: string;
  req_api_hash: string;
}

export interface ModifyContentFieldType {
  modified_content: string;
}

export interface DimensionScore {
  score: number;
  weight: number;
  type: string;
}

export interface GetCopywritingScoreResponse {
  contents: {
    content: string;
    score: number;
    reason: string;
    dimension_scores: DimensionScore[];
  }[];
}

export interface GenerateCopywritingByModelResponse {
  modified_contents: {
    modified_content: string;
    modified_score: number;
    modified_reason: string;
    modified_dimension_scores: {
      score: number;
      weight: number;
      type: string;
    }[];
  }[];
}

export interface UpdateCopywritingRequest {
  id: number;
  type: number; // 1 人工 2 大模型
  model_info?: string; // 大模型相关的信息，json字符串
  modified_content: string;
  modified_score: number;
  modified_reason: string;
  modified_dimension_scores: DimensionScore[];
}


export enum CopywritingUpdateType {
  Model = 1,
  Human = 2,
}

export enum CopywritingOperateType {
  Init = 0,
  ModifyByModel = 1,
  ModifyByHuman = 2,
  Accept = 3,
  Reject = 4,
}