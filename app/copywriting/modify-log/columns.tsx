import { ColumnsType } from "antd/es/table";
import { CopywritingHistoryRecord } from "../types";
import { Tag, Button, Space } from "antd";

const typeMap: Record<number, { label: string; color: string }> = {
  1: { label: "人工", color: "green" },
  2: { label: "大模型", color: "blue" },
};

export const getColumns = (
  onApprove: (id: number) => void,
  onCancelApprove: (id: number) => void
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
    title: "原始文案",
    dataIndex: "cluster_content",
    key: "cluster_content",
    width: 300,
    ellipsis: true,
  },
  {
    title: "修改后文案",
    dataIndex: "modified_content",
    key: "modified_content",
    width: 300,
    ellipsis: true,
  },
  {
    title: "原始得分",
    dataIndex: "score",
    key: "score",
    width: 100,
  },
  {
    title: "修改后得分",
    dataIndex: "modified_score",
    key: "modified_score",
    width: 120,
    render: (val: number, record: CopywritingHistoryRecord) => {
      const diff = val - record.score;
      let color = "#666";
      if (diff > 0) color = "#52c41a";
      else if (diff < 0) color = "#ff4d4f";
      return <span style={{ color }}>{val}</span>;
    },
  },
  {
    title: "原始评分原因",
    dataIndex: "reason",
    key: "reason",
    width: 200,
    ellipsis: true,
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
            onClick={() => onApprove(record.id)}
          >
            采纳
          </Button>
          <Button
            size="small"
            disabled={!record.is_approved}
            onClick={() => onCancelApprove(record.id)}
          >
            取消采纳
          </Button>
        </Space>
      );
    },
  },
];

export const renderExpandRow = (record: CopywritingHistoryRecord) => {
  return (
    <div style={{ padding: 16 }}>
      <h4 style={{ marginBottom: 12 }}>维度评分对比</h4>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #e8e8e8", padding: 8, textAlign: "left" }}>维度类型</th>
            <th style={{ border: "1px solid #e8e8e8", padding: 8, textAlign: "left" }}>原始得分</th>
            <th style={{ border: "1px solid #e8e8e8", padding: 8, textAlign: "left" }}>原始权重</th>
            <th style={{ border: "1px solid #e8e8e8", padding: 8, textAlign: "left" }}>修改后得分</th>
            <th style={{ border: "1px solid #e8e8e8", padding: 8, textAlign: "left" }}>修改后权重</th>
          </tr>
        </thead>
        <tbody>
          {record.dimension_scores.map((dim, index) => {
            const modifiedDim = record.modified_dimension_scores[index];
            const scoreDiff = modifiedDim ? modifiedDim.score - dim.score : 0;
            const scoreColor = scoreDiff > 0 ? "#52c41a" : scoreDiff < 0 ? "#ff4d4f" : "#666";
            return (
              <tr key={dim.type || index}>
                <td style={{ border: "1px solid #e8e8e8", padding: 8 }}>{dim.type}</td>
                <td style={{ border: "1px solid #e8e8e8", padding: 8 }}>{dim.score}</td>
                <td style={{ border: "1px solid #e8e8e8", padding: 8 }}>{dim.weight}</td>
                <td style={{ border: "1px solid #e8e8e8", padding: 8, color: scoreColor }}>
                  {modifiedDim?.score || "-"}
                </td>
                <td style={{ border: "1px solid #e8e8e8", padding: 8 }}>
                  {modifiedDim?.weight || "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {record.type === 2 && record.model_info && Object.keys(record.model_info).length > 0 && (
        <>
          <h4 style={{ marginBottom: 12, marginTop: 16 }}>大模型信息</h4>
          <pre style={{ padding: 12, backgroundColor: "#f5f5f5", borderRadius: 4, maxHeight: 200, overflow: "auto" }}>
            {JSON.stringify(record.model_info, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
};