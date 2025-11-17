// src/app/admin/dashboard/materialmanage/bom-detail/AddButton.tsx
'use client';

import { Button, Modal, Form, Input, InputNumber, Select, DatePicker, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { API_PATH } from './config';
import type { Moment } from 'moment';

const { Option } = Select;
const { TextArea } = Input;

export default function AddButton({ onOk }: { onOk: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      /* 格式化日期 */
      const payload = {
        ...values,
        order_date: values.order_date.format('YYYY-MM-DD'),
        delivery_date: values.delivery_date.format('YYYY-MM-DD'),
        actual_delivery_date: values.actual_delivery_date?.format('YYYY-MM-DD') || null,
      };

      const res = await fetch(API_PATH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('添加失败');
      message.success('添加成功');
      form.resetFields();
      setOpen(false);
      onOk();
    } catch (error: any) {
      message.error(error.message || '添加失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)} style={{ marginLeft: 8 }}>
        新增订单
      </Button>

      <Modal
        open={open}
        title="新增订单"
        onCancel={() => setOpen(false)}
        onOk={handleAdd}
        confirmLoading={loading}
        width={640}
      >
        <Form form={form} layout="vertical">
          {/* 订单编号 */}
          <Form.Item
            label="订单编号"
            name="order_number"
            rules={[{ required: true, message: '请输入订单编号' }, { max: 50 }]}
          >
            <Input placeholder="业务唯一编号" />
          </Form.Item>

          {/* 客户ID */}
          <Form.Item
            label="客户ID"
            name="customer_id"
            rules={[{ required: true, message: '请选择客户' }]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="输入客户ID" />
          </Form.Item>

          {/* 订单日期 */}
          <Form.Item
            label="订单日期"
            name="order_date"
            rules={[{ required: true }]}
            initialValue={null}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          {/* 要求交货日期 */}
          <Form.Item
            label="要求交货日期"
            name="delivery_date"
            rules={[{ required: true }]}
            initialValue={null}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          {/* 实际交货日期 */}
          <Form.Item label="实际交货日期" name="actual_delivery_date">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          {/* 总数量 */}
          <Form.Item
            label="订单总数量"
            name="total_quantity"
            rules={[{ required: true }]}
            initialValue={0}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="0.0000"
              min={0}
              precision={4}
            />
          </Form.Item>

          {/* 总金额 */}
          <Form.Item
            label="订单总金额"
            name="total_amount"
            rules={[{ required: true }]}
            initialValue={0}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="0.00"
              min={0}
              precision={2}
            />
          </Form.Item>

          {/* 币种 */}
          <Form.Item label="币种" name="currency" initialValue="CNY">
            <Select>
              <Option value="CNY">CNY ¥</Option>
              <Option value="USD">USD $</Option>
              <Option value="EUR">EUR €</Option>
            </Select>
          </Form.Item>

          {/* 订单状态 */}
          <Form.Item label="订单状态" name="order_status" initialValue="Draft">
            <Select>
              <Option value="Draft">草稿</Option>
              <Option value="Confirmed">已确认</Option>
              <Option value="In Production">生产中</Option>
              <Option value="Shipped">已发货</Option>
              <Option value="Delivered">已交付</Option>
              <Option value="Cancelled">已取消</Option>
            </Select>
          </Form.Item>

          {/* 优先级 */}
          <Form.Item label="优先级" name="priority" initialValue="Medium">
            <Select>
              <Option value="Low">低</Option>
              <Option value="Medium">中</Option>
              <Option value="High">高</Option>
              <Option value="Urgent">紧急</Option>
            </Select>
          </Form.Item>

          {/* 销售人员 */}
          <Form.Item label="销售人员" name="sales_person">
            <Input placeholder="请输入销售人员" maxLength={100} />
          </Form.Item>

          {/* 付款条款 */}
          <Form.Item label="付款条款" name="payment_terms">
            <Input placeholder="请输入付款条款" maxLength={255} />
          </Form.Item>

          {/* 运输方式 */}
          <Form.Item label="运输方式" name="shipping_method">
            <Input placeholder="请输入运输方式" maxLength={100} />
          </Form.Item>

          {/* 送货地址 */}
          <Form.Item label="送货地址" name="shipping_address">
            <TextArea rows={2} placeholder="请输入送货地址" />
          </Form.Item>

          {/* 账单地址 */}
          <Form.Item label="账单地址" name="billing_address">
            <TextArea rows={2} placeholder="请输入账单地址" />
          </Form.Item>

          {/* 备注 */}
          <Form.Item label="备注" name="notes">
            <TextArea rows={2} placeholder="请输入订单备注" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}