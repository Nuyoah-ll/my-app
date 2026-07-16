import { Col, Row, Form, Input, Select, Button, InputNumber } from "antd";
import { ModifyLogFieldType } from "../types";
const { Item } = Form;

const typeOptions = [
  { value: 1, label: "人工" },
  { value: 2, label: "大模型" },
];

export const getFields = ({
  onSearch,
  onReset,
}: {
  onSearch: () => void;
  onReset: () => void;
}) => (
  <>
    <Row gutter={[16, 0]}>
      <Col span={8}>
        <Item<ModifyLogFieldType> label="生成方式" name="type">
          <Select style={{ width: "100%" }} placeholder="请选择生成方式">
            {typeOptions.map((item) => (
              <Select.Option key={item.value} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Item>
      </Col>
      <Col span={8}>
        <Item<ModifyLogFieldType> label="操作人" name="create_by">
          <Input placeholder="请输入操作人" />
        </Item>
      </Col>
      <Col span={8}>
        <Item<ModifyLogFieldType> label="修改后文案" name="modified_content">
          <Input placeholder="请输入修改后文案" />
        </Item>
      </Col>
      <Col span={8}>
        <Item<ModifyLogFieldType> label="修改后文案评分" name="modified_score_min">
          <InputNumber
            placeholder="最低"
            style={{ width: "100%" }}
            min={0}
            max={100}
          />
        </Item>
      </Col>
      <Col span={8}>
        <Item<ModifyLogFieldType> label="修改后文案评分" name="modified_score_max">
          <InputNumber
            placeholder="最高"
            style={{ width: "100%" }}
            min={0}
            max={100}
          />
        </Item>
      </Col>
      <Col span={8}>
        <Button type="primary" onClick={onSearch} style={{ marginRight: 8 }}>
          查询
        </Button>
        <Button onClick={onReset}>重置</Button>
      </Col>
    </Row>
    <Row gutter={[16, 0]} style={{ marginTop: 16 }}></Row>
  </>
);
