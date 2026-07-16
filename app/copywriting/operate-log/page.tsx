"use client";

import { Table, Form } from "antd";
import { useAntdTable } from "ahooks";
import { CopywritingLogRecord, OperateLogFieldType } from "../types";
import { getColumns } from "./columns";
import { getFields } from "./fields";
import { useSearchParams } from "next/navigation";

import { request } from "../../utils/request";

const formStyle: React.CSSProperties = {
  maxWidth: "none",
};

export default function OperateLogPage() {
  const [form] = Form.useForm<OperateLogFieldType>();
  const searchParams = useSearchParams();
  const contentId = searchParams.get("id");

  const getTableData = async ({
    current,
    pageSize,
  }: {
    current: number;
    pageSize: number;
  }): Promise<{
    total: number;
    list: CopywritingLogRecord[];
  }> => {
    const params = await form?.validateFields();
    const res = await request<
      { total: number; list: CopywritingLogRecord[] } | undefined
    >(`http://localhost:3001/copywriting/operate_log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({ content_id: contentId, ...params, current, pageSize }),
    });
    return {
      total: res?.total || 0,
      list: res?.list || [],
    };
  };

  const { tableProps, search } = useAntdTable(getTableData, { form: form });

  return (
    <div>
      <Form form={form} colon={false} style={formStyle}>
        {getFields({ onSearch: search.submit, onReset: search.reset })}
      </Form>
      <div>
        <Table
          {...tableProps}
          pagination={{
            ...tableProps.pagination,
            showTotal: (t) => `共 ${t}条`,
          }}
          columns={getColumns()}
          rowKey="id"
          scroll={{ x: "max-content" }}
        />
      </div>
    </div>
  );
}