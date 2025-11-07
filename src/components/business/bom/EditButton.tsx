// src/app/admin/dashboard/materialmanage/bom/EditButton.tsx
'use client';

import { useState } from 'react';
import { Button, Form, Input, Modal, Select, message } from 'antd';
import { API_PATH } from './config';

const { Option } = Select;

export default function EditButton({ record, onOk }: { record: any; onOk: () => void }) {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const handleEdit = async () => {
    try {
      const values = await form.validateFields();
      await fetch(API_PATH, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...record, ...values }),
      });
      message.success('修改成功');
      setOpen(false);
      onOk();
    } catch (e) {
      message.error('修改失败');
    }
  };

  return (
    <>
      <Button type="link" onClick={() => { setOpen(true); form.setFieldsValue(record); }}>编辑</Button>
      <Modal open={open} title="编辑 BOM" onCancel={() => setOpen(false)} onOk={handleEdit}>
        <Form form={form} layout="vertical">
          {/* 与 AddButton 表单完全一致 */}
          <Form.Item label="BOM编码" name="bom_code" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="BOM名称" name="bom_name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="成品物料ID" name="product_id" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="版本" name="bom_version">
            <Input />
          </Form.Item>
          <Form.Item label="类型" name="bom_type">
            <Select>
              <Option value="EBOM">EBOM</Option>
              <Option value="PBOM">PBOM</Option>
              <Option value="MBOM">MBOM</Option>
            </Select>
          </Form.Item>
          <Form.Item label="状态" name="bom_status">
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
          <Form.Item label="创建人" name="creator">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}