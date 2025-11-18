// src/app/admin/dashboard/materialmanage/bom/AddButton.tsx
'use client';

import { useState } from 'react';
import { Button, Form, Input, Modal, Select, message } from 'antd';
import { API_PATH } from './config';

const { Option } = Select;

export default function AddButton({ onOk }: { onOk: () => void }) {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      await fetch(API_PATH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      message.success('新增成功');
      form.resetFields();
      setOpen(false);
      onOk();
    } catch (e) {
      message.error('新增失败');
    }
    
  };

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)} style={{ marginLeft: 8 }}>新增 BOM</Button>
      <Modal open={open} title="新增 BOM" onCancel={() => setOpen(false)} onOk={handleAdd}>
        <Form form={form} layout="vertical">
          <Form.Item label="BOM编码" name="bom_code" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="BOM名称" name="bom_name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="成品物料ID" name="product_id" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="版本" name="bom_version" initialValue="1.0">
            <Input />
          </Form.Item>
          <Form.Item label="类型" name="bom_type" initialValue="EBOM">
            <Select>
              <Option value="EBOM">EBOM</Option>
              <Option value="PBOM">PBOM</Option>
              <Option value="MBOM">MBOM</Option>
            </Select>
          </Form.Item>
          <Form.Item label="状态" name="bom_status" initialValue="Develop">
            <Select>
              <Option value="Develop">编制中</Option>
              <Option value="Released">已发布</Option>
              <Option value="Obsolete">已废弃</Option>
            </Select>
          </Form.Item>
          <Form.Item label="生效日期" name="effective_date">
            <Input type="date" />
          </Form.Item>
          <Form.Item label="失效日期" name="expiration_date">
            <Input type="date" />
          </Form.Item>
          <Form.Item label="创建人" name="creator" initialValue="System">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}