"use client";

import { Form, Input, Modal, message, InputNumber } from "antd";
import { useRequest } from "ahooks";
import { GetApproveCopywritingFieldType } from "../../types";
import { request } from "../../../utils/request";
import qs from "qs";
import { useEffect } from "react";

interface SearchApproveCopywritingModalProps {
  visible: boolean;
  onCancel: () => void;
}

const formStyle: React.CSSProperties = {
  maxWidth: "none",
};

export default function SearchApproveCopywritingModal({
  visible,
  onCancel,
}: SearchApproveCopywritingModalProps) {
  const [form] = Form.useForm<GetApproveCopywritingFieldType>();

  const { runAsync: handleOk, loading: okLoading } = useRequest(
    async () => {
      const values = await form.validateFields();
      localStorage.setItem(
        "lastSearchApproveCopywritingParams",
        JSON.stringify(values),
      );
      const res = await request<string | undefined>(
        `http://localhost:3001/copywriting/get_approve_copywriting?${qs.stringify(values)}`,
        {
          method: "GET",
        },
      );
      if (res) {
        message.success(`查询成功, 替换后的文案为：${res}`);
      } else {
        message.error("查询失败");
      }
    },
    { manual: true },
  );

  useEffect(() => {
    const lastParams = localStorage.getItem(
      "lastSearchApproveCopywritingParams",
    );
    if (lastParams && visible) {
      form.setFieldsValue(JSON.parse(lastParams));
    }
  }, [visible, form]);

  return (
    <Modal
      title="查询替换文案"
      width={600}
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      okButtonProps={{
        loading: okLoading,
      }}
    >
      <div>
        <Form
          form={form}
          colon={false}
          labelCol={{ span: 4 }}
          style={formStyle}
        >
          <Form.Item<GetApproveCopywritingFieldType>
            label="体验平台ID"
            name="sif_app_id"
            rules={[{ required: true, message: "请输入体验平台ID" }]}
          >
            <InputNumber placeholder="请输入体验平台ID" />
          </Form.Item>
          <Form.Item<GetApproveCopywritingFieldType>
            label="子应用ID"
            name="sub_app_id"
            rules={[{ required: true, message: "请输入子应用ID" }]}
          >
            <InputNumber placeholder="请输入子应用ID" />
          </Form.Item>
          <Form.Item<GetApproveCopywritingFieldType>
            label="pid"
            name="pid"
            rules={[{ required: true, message: "请输入pid" }]}
          >
            <Input placeholder="请输入pid" />
          </Form.Item>
          <Form.Item<GetApproveCopywritingFieldType>
            label="原始文案"
            name="conetent"
            rules={[{ required: true, message: "请输入原始文案" }]}
          >
            <Input.TextArea placeholder="请输入原始文案" />
          </Form.Item>
          <Form.Item<GetApproveCopywritingFieldType>
            label="请求API URL"
            name="req_api"
            rules={[{ required: true, message: "请输入请求API URL" }]}
          >
            <Input placeholder="请输入请求API URL" />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
