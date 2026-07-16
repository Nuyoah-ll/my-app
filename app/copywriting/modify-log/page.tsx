"use client";

import { Table, Form, message } from "antd";
import { useAntdTable } from "ahooks";
import { CopywritingHistoryRecord, ModifyLogFieldType } from "../types";
import { getColumns, renderExpandRow } from "./columns";
import { getFields } from "./fields";
import { useSearchParams } from "next/navigation";

import { request } from "../../utils/request";

const formStyle: React.CSSProperties = {
  maxWidth: "none",
};

export default function ModifyLogPage() {
  const [form] = Form.useForm<ModifyLogFieldType>();
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
    list: CopywritingHistoryRecord[];
  }> => {
    const params = await form?.validateFields();
    const res = await request<
      { total: number; list: CopywritingHistoryRecord[] } | undefined
    >(`http://localhost:3001/copywriting/modify_log`, {
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

  const { tableProps, search, refresh } = useAntdTable(getTableData, { form: form });

  const handleApprove = async (id: number) => {
    try {
      await request(`http://localhost:3001/copywriting/approve_history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({ id }),
      });
      message.success("采纳成功");
      refresh();
    } catch (error) {
      message.error("采纳失败");
    }
  };

  const handleCancelApprove = async (id: number) => {
    try {
      await request(`http://localhost:3001/copywriting/cancel_approve_history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({ id }),
      });
      message.success("取消采纳成功");
      refresh();
    } catch (error) {
      message.error("取消采纳失败");
    }
  };

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
          columns={getColumns(handleApprove, handleCancelApprove)}
          rowKey="id"
          scroll={{ x: "max-content" }}
          expandable={{
            expandedRowRender: renderExpandRow,
          }}
        />
      </div>
    </div>
  );
}