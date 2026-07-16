import { ColumnsType } from "antd/es/table";
import { CopywritingLogRecord } from "../types";
import { Tag } from "antd";

const operateTypeMap: Record<number, { label: string; color: string }> = {
  0: { label: "初始化", color: "gray" },
  1: { label: "修改文案 - AI", color: "blue" },
  2: { label: "修改文案 - 人工", color: "green" },
  3: { label: "采纳", color: "purple" },
  4: { label: "取消采纳", color: "red" },
};

export const getColumns = (): ColumnsType<CopywritingLogRecord> => [
  { title: "主键ID", dataIndex: "id", key: "id", width: 120 },
  { title: "文案主表ID", dataIndex: "content_id", key: "content_id", width: 150 },
  {
    title: "操作类型",
    dataIndex: "operate_type",
    key: "operate_type",
    width: 150,
    render: (val) => {
      const typeInfo = operateTypeMap[val] || { label: "未知", color: "gray" };
      return <Tag color={typeInfo.color}>{typeInfo.label}</Tag>;
    },
  },
  { title: "操作信息", dataIndex: "operate_info", key: "operate_info", width: 300 },
  { title: "操作人", dataIndex: "create_by", key: "create_by", width: 120 },
  { title: "操作时间", dataIndex: "create_at", key: "create_at", width: 180 },
];