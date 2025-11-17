// src/app/admin/dashboard/materialmanage/bom-detail/AddButton.tsx
'use client';

import { Button, Modal, Form, Input, InputNumber, Select, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { API_PATH } from './config';

const { Option } = Select;

export default function AddButton({ onOk }: { onOk: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const res = await fetch(API_PATH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error('添加失败');

      message.success('添加成功');
      form.resetFields();
      setOpen(false);
      onOk();
    } catch (error) {
      message.error('添加失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setOpen(true)}
        style={{ marginLeft: 8 }}
      >
        新增客户
      </Button>

      <Modal
        open={open}
        title="新增客户"
        onCancel={() => setOpen(false)}
        onOk={handleAdd}
        confirmLoading={loading}
        width={600}
      >
        <Form form={form} layout="vertical">
          {/* 客户编码 */}
          <Form.Item
            label="客户编码"
            name="customer_code"
            rules={[
              { required: true, message: '请输入客户编码' },
              { max: 50, message: '最多50个字符' },
            ]}
          >
            <Input placeholder="请输入唯一客户编码" />
          </Form.Item>

          {/* 客户名称 */}
          <Form.Item
            label="客户名称"
            name="customer_name"
            rules={[
              { required: true, message: '请输入客户名称' },
              { max: 255, message: '最多255个字符' },
            ]}
          >
            <Input placeholder="请输入客户名称" />
          </Form.Item>

          {/* 联系人 */}
          <Form.Item
            label="联系人"
            name="contact_person"
            rules={[{ max: 100, message: '最多100个字符' }]}
          >
            <Input placeholder="请输入联系人" />
          </Form.Item>

          {/* 联系电话 */}
          <Form.Item
            label="联系电话"
            name="phone"
            rules={[{ max: 20, message: '最多20个字符' }]}
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>

          {/* 邮箱 */}
          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { type: 'email', message: '请输入合法邮箱' },
              { max: 100, message: '最多100个字符' },
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          {/* 地址 */}
          <Form.Item label="地址" name="address">
            <Input.TextArea rows={2} placeholder="请输入地址" />
          </Form.Item>

          {/* 信用等级 */}
          <Form.Item label="信用等级" name="credit_rating" initialValue="B">
            <Select placeholder="请选择信用等级">
              <Option value="A">A级-优质</Option>
              <Option value="B">B级-良好</Option>
              <Option value="C">C级-一般</Option>
              <Option value="D">D级-风险</Option>
            </Select>
          </Form.Item>

          {/* 是否有效 */}
          <Form.Item
            label="是否有效"
            name="is_active"
            initialValue={1}
          >
            <Select>
              <Option value={1}>是</Option>
              <Option value={0}>否</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}