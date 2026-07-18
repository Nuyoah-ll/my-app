"use client";

import { Form, Input, Modal, Button, message } from "antd";
import { useRequest } from "ahooks";
import { useState } from "react";
import {
  CopywritingRecord,
  ModifyContentFieldType,
  GetCopywritingScoreResponse,
  GenerateCopywritingByModelResponse,
  CopywritingUpdateType,
} from "../../types";
import { request } from "../../../utils/request";

interface EditCopywritingModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
  record: CopywritingRecord | null;
}

const formStyle: React.CSSProperties = {
  maxWidth: "none",
};

export default function EditCopywritingModal({
  visible,
  onCancel,
  onSuccess,
  record,
}: EditCopywritingModalProps) {
  const [form] = Form.useForm<ModifyContentFieldType>();
  const [modifiedInfo, setModifiedInfo] = useState<
    GenerateCopywritingByModelResponse["modified_contents"][0] | undefined
  >();

  const handleContentChange = () => {
    setModifiedInfo(undefined);
  };

  const { runAsync: getContentScore, loading: getContentScoreLoading } = useRequest(
    async () => {
      const params = await form?.validateFields();
      const res = await request<GetCopywritingScoreResponse | undefined>(
        `http://localhost:3001/copywriting/get_copywriting_score`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({ contents: [params.modified_content] }),
        },
      );
      const result = res?.contents?.[0];
      if (result && typeof result.score === "number") {
        setModifiedInfo({
          modified_content: result.content,
          modified_score: result.score,
          modified_reason: result.reason || "",
          modified_dimension_scores: result.dimension_scores || [],
        });
        message.success("获取分数信息成功");
      } else {
        setModifiedInfo(undefined);
        message.error("获取分数信息失败");
      }
    },
    { manual: true },
  );

  const { runAsync: updateCopywriting, loading: updateCopywritingLoading } =
    useRequest(
      async () => {
        if (!record || !modifiedInfo) return;
        await request(
          `http://localhost:3001/copywriting/update`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
              id: record.id,
              ...modifiedInfo,
            }),
          },
        );
      },
      {
        manual: true,
        onSuccess: () => {
          message.success("修改文案成功，你可前往文案修改记录页面查看");
          onSuccess?.();
          onCancel();
        },
      },
    );

  const handleOk = async () => {
    if (record && modifiedInfo) {
      await updateCopywriting();
    }
  };

  return (
    <Modal
      title="修改文案"
      width={600}
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      okButtonProps={{ disabled: !modifiedInfo, loading: updateCopywritingLoading }}
    >
      <div>
        <Form
          form={form}
          colon={false}
          labelCol={{ span: 4 }}
          style={formStyle}
        >
          <Form.Item<ModifyContentFieldType> label="原始文案">
            <p style={{ lineHeight: "20px" }}>{record?.cluster_content}</p>
          </Form.Item>
          <Form.Item<ModifyContentFieldType>
            label="修改文案"
            name="modified_content"
            rules={[{ required: true, message: "请输入修改文案" }]}
            extra={
              <Button
                style={{ padding: 0 }}
                type="link"
                onClick={getContentScore}
                loading={getContentScoreLoading}
              >
                获取分数信息
              </Button>
            }
          >
            <Input.TextArea
              style={{ width: "100%" }}
              rows={4}
              onChange={handleContentChange}
            />
          </Form.Item>
          {typeof modifiedInfo?.modified_score === "number" && (
            <Form.Item label="文案分数">
              <p style={{ lineHeight: "20px" }}>
                {modifiedInfo?.modified_score}
              </p>
            </Form.Item>
          )}
          {modifiedInfo?.modified_reason && (
            <Form.Item label="打分原因">
              <p style={{ paddingTop: "6px", lineHeight: "20px" }}>
                {modifiedInfo?.modified_reason}
              </p>
            </Form.Item>
          )}
        </Form>
      </div>
    </Modal>
  );
}
