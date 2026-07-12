"use client";

import { Form, Input, Table, Modal } from "antd";
import { useAntdTable } from "ahooks";
import { CopywritingRecord, FieldType } from "./types";
import { getColumns } from "./columns";
import { getFields } from "./fields";
import { useRouter } from "next/navigation";

import { request } from "../utils/request";

const formStyle: React.CSSProperties = {
  maxWidth: "none",
};

export default function CopywritingPage() {
  const [form] = Form.useForm<FieldType>();
  const router = useRouter();

  const getTableData = async ({
    current,
    pageSize,
  }: {
    current: number;
    pageSize: number;
  }): Promise<{
    total: number;
    list: CopywritingRecord[];
  }> => {
    const params = await form?.validateFields();
    console.log({ ...params, current, pageSize }, "params");
    const res = await request<
      { total: number; list: CopywritingRecord[] } | undefined
    >(`http://localhost:3001/copywriting/list`, {
      method: "POST",
      body: JSON.stringify({ ...params, current, pageSize }),
    });
    console.log(res, "res");
    return {
      total: res?.total || 0,
      list: res?.list || [],
    };
  };

  const { tableProps, search } = useAntdTable(getTableData, { form: form });
  console.log(tableProps, "tableProps");

  const handleToOperateLog = (record: CopywritingRecord) => {
    router.push(`/copywriting/operate-log?id=${record.id}`);
  };

  const handleToModifyLog = (record: CopywritingRecord) => {
    router.push(`/copywriting/modify-log?id=${record.id}`);
  };

  const handleEditCopywriting = (record: CopywritingRecord) => {
    Modal.confirm({
      title: "修改文案",
      content: (
        <div>
          <label style={{ display: "block", marginBottom: 8 }}>原始文案</label>
          <Input.TextArea
            defaultValue={record.cluster_content}
            style={{ width: "100%" }}
            rows={4}
          />
        </div>
      ),
      onOk: () => {
        console.log("确认修改文案:", record.id);
      },
    });
  };

  return (
    <div>
      <Form form={form} colon={false} style={formStyle}>
        {getFields({ onSearch: search.submit, onReset: search.reset })}
      </Form>
      <div style={{ padding: 24 }}>
        <Table
          {...tableProps}
          pagination={{
            ...tableProps.pagination,
            showTotal: (t) => `共 ${t}条`,
          }}
          columns={getColumns({
            handleToOperateLog,
            handleToModifyLog,
            handleEditCopywriting,
          })}
          rowKey="id"
          scroll={{ x: "max-content" }}
        />
      </div>
    </div>
  );
}
