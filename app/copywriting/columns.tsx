import { ColumnsType } from "antd/es/table";
import { CopywritingRecord } from "./types";
import { Button, Space, Tag } from "antd";

export const getColumns = ({
  handleToOperateLog,
  handleToModifyLog,
  handleEditCopywriting,
  handleGenerateCopywritingByModel,
}: {
  handleToOperateLog: (record: CopywritingRecord) => void;
  handleToModifyLog: (record: CopywritingRecord) => void;
  handleEditCopywriting: (record: CopywritingRecord) => void;
  handleGenerateCopywritingByModel: (record: CopywritingRecord) => void;
}): ColumnsType<CopywritingRecord> => [
  { title: "主键ID", dataIndex: "id", key: "id", width: 120 },
  {
    title: "上次透出时间",
    dataIndex: "last_date",
    key: "last_date",
    width: 120,
  },
  {
    title: "原始文案",
    dataIndex: "cluster_content",
    key: "cluster_content",
    width: 300,
  },
  { title: "文案得分", dataIndex: "score", key: "score", width: 200 },
  { title: "评分原因", dataIndex: "reason", key: "reason", width: 200 },
  {
    title: "评分维度",
    dataIndex: "dimension_scores",
    key: "dimension_scores",
    width: 200,
    render: (_, record) => {
      return (
        record?.dimension_scores?.map((item) => {
          return (
            <Space key={item?.type}>
              <Tag>{item.type}</Tag>
              <span>{item.score}</span>
              <span>{item.weight}</span>
            </Space>
          );
        }) || []
      );
    },
  },
  {
    title: "采纳文案",
    dataIndex: "approve_content",
    key: "approve_content",
    width: 300,
    render: (val) => val || "-",
  },
  { title: "PV", dataIndex: "last_pv", key: "last_pv", width: 100 },
  { title: "UV", dataIndex: "last_uv", key: "last_uv", width: 100 },
  {
    title: "文案类型",
    dataIndex: "type_list",
    key: "type_list",
    width: 150,
    render: (val) =>
      val?.map?.((item: string, idx: number) => <Tag key={idx}>{item}</Tag>) ||
      [],
  },
  {
    title: "组件列表",
    dataIndex: "component_list",
    key: "component_list",
    width: 150,
    render: (val) =>
      val?.map?.((item: string, idx: number) => <Tag key={idx}>{item}</Tag>) ||
      [],
  },
  {
    title: "体验平台应用ID",
    dataIndex: "sif_app_id",
    key: "sif_app_id",
    width: 150,
  },
  {
    title: "体验平台应用名称",
    dataIndex: "sif_app_name",
    key: "sif_app_name",
    width: 150,
  },
  { title: "子应用ID", dataIndex: "sub_app_id", key: "sub_app_id", width: 120 },
  { title: "子应用名称", dataIndex: "app_name", key: "app_name", width: 150 },
  { title: "子应用描述", dataIndex: "app_desc", key: "app_desc", width: 150 },
  { title: "页面地址", dataIndex: "pid", key: "pid", width: 200 },
  { title: "页面ID", dataIndex: "page_id", key: "page_id", width: 100 },
  { title: "页面名称", dataIndex: "page_name", key: "page_name", width: 150 },
  {
    title: "监控平台项目ID",
    dataIndex: "monitor_platform_bid",
    key: "monitor_platform_bid",
    width: 180,
  },
  {
    title: "是否来源于后端",
    dataIndex: "is_from_req",
    key: "is_from_req",
    width: 140,
    render: (val) => (
      <Tag color={val === 1 ? "green" : "gray"}>{val === 1 ? "是" : "否"}</Tag>
    ),
  },
  { title: "请求API", dataIndex: "req_api", key: "req_api", width: 250 },
  { title: "业务状态码", dataIndex: "res_code", key: "res_code", width: 120 },
  {
    title: "请求log_id",
    dataIndex: "res_log_id",
    key: "res_log_id",
    width: 150,
  },
  { title: "PSM", dataIndex: "psm", key: "psm", width: 180 },
  { title: "PSM名称", dataIndex: "name", key: "name", width: 120 },
  { title: "PSM路径", dataIndex: "path", key: "path", width: 180 },
  {
    title: "PSM Owners",
    dataIndex: "owners",
    key: "owners",
    width: 150,
    render: (val) =>
      val.map((item: string, idx: number) => <Tag key={idx}>{item}</Tag>),
  },
  {
    title: "一级部门",
    dataIndex: "parent1_name",
    key: "parent1_name",
    width: 120,
  },
  {
    title: "二级部门",
    dataIndex: "parent2_name",
    key: "parent2_name",
    width: 120,
  },
  {
    title: "三级部门",
    dataIndex: "parent3_name",
    key: "parent3_name",
    width: 120,
  },
  { title: "创建时间", dataIndex: "create_at", key: "create_at", width: 180 },
  { title: "创建者", dataIndex: "create_by", key: "create_by", width: 100 },
  { title: "更新时间", dataIndex: "update_at", key: "update_at", width: 180 },
  { title: "更新者", dataIndex: "update_by", key: "update_by", width: 100 },
  {
    title: "原始文案hash",
    dataIndex: "cluster_content_hash",
    key: "cluster_content_hash",
    width: 120,
  },
  {
    title: "请求API hash",
    dataIndex: "req_api_hash",
    key: "req_api_hash",
    width: 120,
  },
  {
    title: "操作",
    key: "action",
    fixed: "right",
    width: 400,
    render: (_, record) => (
      <span>
        <Button type="link" onClick={() => handleToOperateLog(record)}>
          操作记录
        </Button>
        <Button type="link" onClick={() => handleToModifyLog(record)}>
          文案修改记录
        </Button>
        <Button type="link" onClick={() => handleEditCopywriting(record)}>
          人工修改文案
        </Button>
        <Button
          type="link"
          onClick={() => handleGenerateCopywritingByModel(record)}
        >
          大模型修改文案
        </Button>
      </span>
    ),
  },
];
