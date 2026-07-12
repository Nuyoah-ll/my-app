import { Col, Row, Form, Input, Select, InputNumber, Button } from "antd";
import { FieldType } from "./types";
const { Item } = Form;

export const getFields = ({
  onSearch,
  onReset,
}: {
  onSearch: () => void;
  onReset: () => void;
}) => (
  <>
    <Row gutter={[16, 0]}>
      <Col span={6}>
        <Item<FieldType> label="原始文案" name="cluster_content">
          <Input placeholder="请输入原始文案" />
        </Item>
      </Col>
      <Col span={6}>
        <Item<FieldType> label="得分范围(最小值)" name="score_min">
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            max={100}
            placeholder="最小值"
          />
        </Item>
      </Col>
      <Col span={6}>
        <Item<FieldType> label="得分范围(最大值)" name="score_max">
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            max={100}
            placeholder="最大值"
          />
        </Item>
      </Col>
      <Col span={6}>
        <Item<FieldType> label="体验平台应用ID" name="sif_app_id">
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            placeholder="请输入应用ID"
          />
        </Item>
      </Col>
      <Col span={6}>
        <Item<FieldType> label="体验平台应用名称" name="sif_app_name">
          <Input placeholder="请输入应用名称" />
        </Item>
      </Col>
      <Col span={6}>
        <Item<FieldType> label="子应用ID" name="sub_app_id">
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            placeholder="请输入子应用ID"
          />
        </Item>
      </Col>
      <Col span={6}>
        <Item<FieldType> label="子应用名称" name="app_name">
          <Input placeholder="请输入子应用名称" />
        </Item>
      </Col>
      <Col span={6}>
        <Item<FieldType> label="页面地址" name="pid">
          <Input placeholder="请输入页面地址" />
        </Item>
      </Col>
      <Col span={6}>
        <Item<FieldType> label="监控平台项目ID" name="monitor_platform_bid">
          <Input placeholder="请输入项目ID" />
        </Item>
      </Col>
      <Col span={6}>
        <Item<FieldType> label="是否来源于后端" name="is_from_req">
          <Select style={{ width: "100%" }} placeholder="请选择">
            <Select.Option value={0}>否</Select.Option>
            <Select.Option value={1}>是</Select.Option>
          </Select>
        </Item>
      </Col>
      <Col span={6}>
        <Item<FieldType> label="请求API" name="req_api">
          <Input placeholder="请输入API地址" />
        </Item>
      </Col>
      <Col span={6}>
        <Item<FieldType> label="业务状态码" name="res_code">
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            placeholder="请输入状态码"
          />
        </Item>
      </Col>
      <Col span={6}>
        <Item<FieldType> label="请求log_id" name="res_log_id">
          <Input placeholder="请输入log_id" />
        </Item>
      </Col>
      <Col span={6}>
        <Item<FieldType> label="PSM" name="psm">
          <Input placeholder="请输入PSM" />
        </Item>
      </Col>
    </Row>
    <Row gutter={16} style={{ marginTop: 16 }}>
      <Col span={24}>
        <Button type="primary" onClick={onSearch} style={{ marginRight: 8 }}>
          查询
        </Button>
        <Button onClick={onReset}>重置</Button>
      </Col>
    </Row>
  </>
);
