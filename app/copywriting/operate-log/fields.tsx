import { Col, Row, Form, Input, Select, Button } from "antd";
import { CopywritingOperateType, OperateLogFieldType } from "../types";
const { Item } = Form;

const operateTypeOptions = [
  { value: CopywritingOperateType.Init, label: "初始化" },
  { value: CopywritingOperateType.ModifyByModel, label: "修改文案 - AI" },
  { value: CopywritingOperateType.ModifyByHuman, label: "修改文案 - 人工" },
  { value: CopywritingOperateType.Accept, label: "采纳" },
  { value: CopywritingOperateType.Reject, label: "取消采纳" },
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
        <Item<OperateLogFieldType> label="操作类型" name="operate_type">
          <Select style={{ width: "100%" }} placeholder="请选择操作类型">
            {operateTypeOptions.map((item) => (
              <Select.Option key={item.value} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Item>
      </Col>
      <Col span={8}>
        <Item<OperateLogFieldType> label="操作人" name="create_by">
          <Input placeholder="请输入操作人" />
        </Item>
      </Col>
       <Col span={8}>
        <Button type="primary" onClick={onSearch} style={{ marginRight: 8 }}>
          查询
        </Button>
        <Button onClick={onReset}>重置</Button>
      </Col>
    </Row>
  </>
);