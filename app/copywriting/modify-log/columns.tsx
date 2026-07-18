import { ColumnsType } from "antd/es/table";
import { CopywritingHistoryRecord, CopywritingUpdateType } from "../types";
import { Tag, Button, Space } from "antd";

const typeMap: Record<number, { label: string; color: string }> = {
  [CopywritingUpdateType.Model]: { label: "大模型", color: "blue" },
  [CopywritingUpdateType.Human]: { label: "人工", color: "green" },
};

export const getColumns = (
  onChangeApproveStatus: (id: number, isApproved: boolean) => void,
  handleChangeApproveStatusLoading: boolean
): ColumnsType<CopywritingHistoryRecord> => [
  { title: "主键ID", dataIndex: "id", key: "id", width: 120 },
  { title: "文案主表ID", dataIndex: "content_id", key: "content_id", width: 150 },
  {
    title: "生成方式",
    dataIndex: "type",
    key: "type",
    width: 120,
    render: (val) => {
      const typeInfo = typeMap[val] || { label: "未知", color: "gray" };
      return <Tag color={typeInfo.color}>{typeInfo.label}</Tag>;
    },
  },
  {
    title: "修改后文案",
    dataIndex: "modified_content",
    key: "modified_content",
    width: 300,
    ellipsis: true,
  },
  {
    title: "修改后得分",
    dataIndex: "modified_score",
    key: "modified_score",
    width: 120,
  },
  {
    title: "修改后评分原因",
    dataIndex: "modified_reason",
    key: "modified_reason",
    width: 200,
    ellipsis: true,
  },
  { title: "操作人", dataIndex: "create_by", key: "create_by", width: 120 },
  { title: "创建时间", dataIndex: "create_at", key: "create_at", width: 180 },
  {
    title: "是否采纳",
    dataIndex: "is_approved",
    key: "is_approved",
    fixed: "right",
    width: 120,
    render: (val: boolean) => {
      return <Tag color={val ? "green" : "red"}>{val ? "已采纳" : "未采纳"}</Tag>;
    },
  },
  {
    title: "操作",
    key: "action",
    width: 200,
    fixed: "right",
    render: (_val, record: CopywritingHistoryRecord) => {
      return (
        <Space>
          <Button
            type="primary"
            size="small"
            disabled={record.is_approved}
            loading={handleChangeApproveStatusLoading}
            onClick={() => onChangeApproveStatus(record.id, true)}
          >
            采纳
          </Button>
          <Button
            size="small"
            disabled={!record.is_approved}
            loading={handleChangeApproveStatusLoading}
            onClick={() => onChangeApproveStatus(record.id, false)}
          >
            取消采纳
          </Button>
        </Space>
      );
    },
  },
];