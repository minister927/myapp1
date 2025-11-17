// src/app/admin/dashboard/materialmanage/bom-detail/EditButton.tsx
'use client';

import { Button, Modal, Form, Input, InputNumber, Select, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { API_PATH } from './config';

const { Option } = Select;
const { TextArea } = Input;

export default function EditButton({ record, onOk }: { record: any; onOk: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleEdit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const res = await fetch(API_PATH, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...record, ...values }),
      });
      if (!res.ok) throw new Error('更新失败');
      message.success('更新成功');
      setOpen(false);
      onOk();
    } catch (error) {
      message.error('更新失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button type="link" icon={<EditOutlined />} size="small" onClick={() => { setOpen(true); form.setFieldsValue(record); }}>
        编辑
      </Button>

      <Modal open={open} title="编辑订单" onCancel={() => setOpen(false)} onOk={handleEdit} confirmLoading={loading} width={640}>
        <Form form={form} layout="vertical">
          {/* 订单编号 */}
          <Form.Item label="订单编号" name="order_number" rules={[{ required: true, max: 50 }]}>
            <Input placeholder="业务唯一编号" />
          </Form.Item>

          {/* 客户ID */}
          <Form.Item label="客户ID" name="customer_id" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} placeholder="客户ID" />
          </Form.Item>

          {/* 订单日期 */}
          <Form.Item label="订单日期" name="order_date" rules={[{ required: true }]}>
            <Input type="date" style={{ width: '100%' }} />
          </Form.Item>

          {/* 要求交货日期 */}
          <Form.Item label="要求交货日期" name="delivery_date" rules={[{ required: true }]}>
            <Input type="date" style={{ width: '100%' }} />
          </Form.Item>

          {/* 实际交货日期 */}
          <Form.Item label="实际交货日期" name="actual_delivery_date">
            <Input type="date" style={{ width: '100%' }} />
          </Form.Item>

          {/* 总数量 */}
          <Form.Item label="订单总数量" name="total_quantity" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={0} precision={4} placeholder="0.0000" />
          </Form.Item>

          {/* 总金额 */}
          <Form.Item label="订单总金额" name="total_amount" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={0} precision={2} placeholder="0.00" />
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