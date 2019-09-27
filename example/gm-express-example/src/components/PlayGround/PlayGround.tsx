/* eslint-disable react/destructuring-assignment */
/*
 * @Author: GM20171202
 * @Date: 2019-09-27 13:52:58
 * @Last Modified by: GM20171202
 * @Last Modified time: 2019-09-27 13:58:33
 */
import React, { useState } from 'react';
import { Row, Col, Input, Form, Card, Button, Alert, Switch } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { compare } from 'gmsoft-express';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const PlayGround = (props: FormComponentProps) => {
  const {
    form: { getFieldDecorator },
  } = props;
  // const [val, setVal] = useState<string>('');
  const formValues = props.form.getFieldsValue();
  return (
    <Form {...formItemLayout}>
      <Card>
        <Row gutter={24}>
          <Col span={24}>
            <Row gutter={24} style={{ marginBottom: 20 }}>
              <Col span={14} push={6}>
                <Button block type="dashed" onClick={() => props.form.resetFields()}>
                  重置
                </Button>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Form.Item label="启用规则合法性校验">
              {getFieldDecorator('checkLimit')(<Switch />)}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="靶标">{getFieldDecorator('limit-sign')(<Input />)}</Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="规则">{getFieldDecorator('limit')(<Input />)}</Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="靶值">{getFieldDecorator('value')(<Input />)}</Form.Item>
          </Col>
          <Col span={24}>
            <Row gutter={24} style={{ marginBottom: 20 }}>
              <Col span={14} push={6}>
                <Button block type="primary" onClick={() => props.form.resetFields()}>
                  执行表达式
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </Form>
  );
};

const WrappedForm = Form.create()(PlayGround);

export default WrappedForm;
