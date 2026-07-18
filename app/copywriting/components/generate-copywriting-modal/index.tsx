"use client";

import { Modal, message } from "antd";
import { useRequest } from "ahooks";
import {
  CopywritingRecord,
  GenerateCopywritingByModelResponse,
} from "../../types";
import { request } from "../../../utils/request";

interface GenerateCopywritingModalProps {
  visible: boolean;
  onCancel: () => void;
  record: CopywritingRecord | null;
  onSuccess?: () => void;
}

export default function GenerateCopywritingModal({
  visible,
  onCancel,
  record,
  onSuccess,
}: GenerateCopywritingModalProps) {
  const {
    runAsync: generateCopywritingByModel,
    loading: generateCopywritingByModelLoading,
  } = useRequest(
    async () => {
      if (!record) return;
      const res = await request<GenerateCopywritingByModelResponse | undefined>(
        `http://localhost:3001/copywriting/update_by_model`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({ ids: [record.id] }),
        },
      );
      const score = res?.modified_contents?.[0]?.modified_score || 0;
      if (typeof score !== "number") {
        message.error("大模型生成文案失败");
      } else {
        message.success("大模型生成文案成功，当前修改文案分数为：" + score);
      }
    },
    {
      manual: true,
      onSuccess: () => {
        onSuccess?.();
        onCancel();
      },
    },
  );

  const handleOk = async () => {
    await generateCopywritingByModel();
  };

  return (
    <Modal
      title="大模型生成文案"
      width={400}
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      okButtonProps={{ loading: generateCopywritingByModelLoading }}
    >
      <div>
        <p style={{ marginBottom: 12 }}>确定要使用大模型生成文案吗？</p>
        {record && (
          <div
            style={{ padding: 12, backgroundColor: "#f5f5f5", borderRadius: 4 }}
          >
            <p style={{ fontSize: 12, color: "#999", marginBottom: 8 }}>
              原始文案：
            </p>
            <p style={{ fontSize: 13, lineHeight: "1.6" }}>
              {record.cluster_content}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
