"use client";

import { Table, Form, message } from "antd";
import { useAntdTable, useRequest } from "ahooks";
import { CopywritingHistoryRecord, ModifyLogFieldType } from "../types";
import { getColumns } from "./columns";
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
      body: JSON.stringify({
        content_id: contentId,
        ...params,
        current,
        pageSize,
      }),
    });
    return {
      total: res?.total || 0,
      list: res?.list || [],
    };
  };

  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    form: form,
  });

  const {
    runAsync: handleChangeApproveStatus,
    loading: handleChangeApproveStatusLoading,
  } = useRequest(
    async (id: number, isApproved: boolean) => {
      try {
        await request(
          `http://localhost:3001/copywriting/change_approve_status`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({ id, is_approved: isApproved }),
          },
        );
        message.success("修改采纳状态成功");
        refresh();
      } catch (error) {
        message.error("修改采纳状态失败");
      }
    },
    { manual: true },
  );

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
          columns={getColumns(handleChangeApproveStatus, handleChangeApproveStatusLoading)}
          rowKey="id"
          scroll={{ x: "max-content" }}
        />
      </div>
    </div>
  );
}
