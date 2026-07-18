"use client";

import { Form, Table } from "antd";
import { useAntdTable } from "ahooks";
import {
  CopywritingRecord,
  FieldType,
} from "./types";
import { getColumns } from "./columns";
import { getFields } from "./fields";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { request } from "../utils/request";
import EditCopywritingModal from "./components/edit-copywriting-modal";
import GenerateCopywritingModal from "./components/generate-copywriting-modal";

const formStyle: React.CSSProperties = {
  maxWidth: "none",
};

export default function CopywritingPage() {
  const [form] = Form.useForm<FieldType>();
  const router = useRouter();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editModalRecord, setEditModalRecord] =
    useState<CopywritingRecord | null>(null);
  const [generateModalVisible, setGenerateModalVisible] = useState(false);
  const [generateModalRecord, setGenerateModalRecord] =
    useState<CopywritingRecord | null>(null);

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
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
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
    setEditModalRecord(record);
    setEditModalVisible(true);
  };

  const handleGenerateCopywritingByModel = (record: CopywritingRecord) => {
    setGenerateModalRecord(record);
    setGenerateModalVisible(true);
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
            handleGenerateCopywritingByModel,
          })}
          rowKey="id"
          scroll={{ x: "max-content" }}
        />
      </div>
      {editModalVisible ? (
        <EditCopywritingModal
          visible={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          onSuccess={() => search.submit()}
          record={editModalRecord}
        />
      ) : null}
      {generateModalVisible ? (
        <GenerateCopywritingModal
          visible={generateModalVisible}
          onCancel={() => setGenerateModalVisible(false)}
          record={generateModalRecord}
          onSuccess={() => search.submit()}
        />
      ) : null}
    </div>
  );
}
