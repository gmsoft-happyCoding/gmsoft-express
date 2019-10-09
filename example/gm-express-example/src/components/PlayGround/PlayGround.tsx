/* eslint-disable react/destructuring-assignment */
/* eslint-disable camelcase */
/*
 * @Author: GM20171202
 * @Date: 2019-09-27 13:52:58
 * @Last Modified by: GM20171202
 * @Last Modified time: 2019-10-09 16:07:23
 */
import React, { useState, useEffect } from 'react';
import { isEqual } from 'lodash';
import { Row, Col, Input, Form, Card, Button, Alert, Descriptions } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import * as gmsoft_express from 'gmsoft-express';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const { exeExpress, fillLimit, limitToMsg, getExpressStatic, getCustomExpressReg } = gmsoft_express;
// @ts-ignore
window.gmsoft_express = gmsoft_express;

const PlayGround = (props: FormComponentProps) => {
  const {
    form: { getFieldDecorator, setFieldsValue },
  } = props;
  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
  useEffect(() => {
    const newValue = props.form.getFieldsValue();
    if (newValue && !isEqual(newValue, formValues)) {
      setFormValues(() => newValue);
    }
  });
  const getFillLimit = () => {
    setFieldsValue({ fillLimit: fillLimit(formValues.limit, formValues.sign, formValues.value) });
  };
  const checkResult = () => {
    setFieldsValue({
      checkResult: `${getCustomExpressReg(formValues.sign).test(formValues.limit)}`,
    });
  };
  const staticLimit = () => {
    const staticMap = getExpressStatic(formValues.limit);
    const staticObj: { [key: string]: string[] } = {};
    // eslint-disable-next-line
    for (let [key, value] of staticMap.entries()) {
      staticObj[key] = [...value];
    }
    setFieldsValue({ static: JSON.stringify(staticObj) });
  };
  const runLimit = () => {
    setFieldsValue({ result: `${exeExpress(formValues.fillLimit)}` });
  };
  const tranLimit = () => {
    setFieldsValue({
      tranResult: limitToMsg(formValues.limit, formValues.sign, formValues.signTran),
    });
  };
  return (
    <Form {...formItemLayout}>
      <Card>
        <Row gutter={24}>
          <Col span={14}>
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
                <Form.Item label="靶标">
                  {getFieldDecorator('sign', {
                    initialValue: 'sum',
                    rules: [{ required: true, message: '请输入靶标' }],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="规则">
                  {getFieldDecorator('limit', {
                    initialValue: 'sum>=1000&&sum<1000000',
                    rules: [{ required: true, message: '请输入规则' }],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Row gutter={24} style={{ marginBottom: 20 }}>
                  <Col span={14} push={6}>
                    <Button block type="primary" disabled={!formValues.limit} onClick={checkResult}>
                      校验表达式
                    </Button>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Form.Item label="校验结果">
                  {getFieldDecorator('checkResult')(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="靶值">
                  {getFieldDecorator('value', {
                    initialValue: '2000',
                    rules: [{ required: true, message: '请输入靶值' }],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Row gutter={24} style={{ marginBottom: 20 }}>
                  <Col span={14} push={6}>
                    <Button block type="primary" onClick={getFillLimit}>
                      填充表达式
                    </Button>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Form.Item label="填充后">
                  {getFieldDecorator('fillLimit')(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Row gutter={24} style={{ marginBottom: 20 }}>
                  <Col span={14} push={6}>
                    <Button
                      block
                      type="primary"
                      disabled={!formValues.fillLimit}
                      onClick={runLimit}
                    >
                      执行表达式
                    </Button>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Form.Item label="执行结果">
                  {getFieldDecorator('result')(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Row gutter={24} style={{ marginBottom: 20 }}>
                  <Col span={14} push={6}>
                    <Button block type="primary" disabled={!formValues.limit} onClick={staticLimit}>
                      统计表达式运算符
                    </Button>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Form.Item label="统计结果">
                  {getFieldDecorator('static')(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="靶标文案">{getFieldDecorator('signTran')(<Input />)}</Form.Item>
              </Col>
              <Col span={24}>
                <Row gutter={24} style={{ marginBottom: 20 }}>
                  <Col span={14} push={6}>
                    <Button
                      block
                      type="primary"
                      disabled={!formValues.fillLimit}
                      onClick={tranLimit}
                    >
                      翻译表达式
                    </Button>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Form.Item label="翻译结果">
                  {getFieldDecorator('tranResult')(<Input disabled />)}
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={10}>
            <Alert
              type="info"
              message="控制台访问 window.gmsoft_express 也可调用 相关api（仅本调试页面有效）"
            />
            <Descriptions bordered title="表单值监控" size="middle" column={1}>
              {Object.keys(formValues).map(item => (
                <Descriptions.Item label={item} key={item}>
                  {formValues[item]}
                </Descriptions.Item>
              ))}
            </Descriptions>
          </Col>
        </Row>
      </Card>
    </Form>
  );
};

const WrappedForm = Form.create()(PlayGround);

export default WrappedForm;
