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
        新增明细
      </Button>
      
      <Modal 
        open={open} 
        title="新增BOM明细" 
        onCancel={() => setOpen(false)}
        onOk={handleAdd}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="BOM ID" name="bom_id" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item label="父项物料ID" name="parent_material_id" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item label="子项组件ID" name="component_material_id" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item label="用量" name="quantity" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} step={0.0001} precision={4} defaultValue={1.0} />
          </Form.Item>
          
          <Form.Item label="损耗率(%)" name="loss_rate">
            <InputNumber style={{ width: '100%' }} step={0.01} precision={2} />
          </Form.Item>
          
          <Form.Item label="工序号" name="operation_seq">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item label="是否关键组件" name="is_critical" valuePropName="checked">
            <Select defaultValue={0}>
              <Option value={1}>是</Option>
              <Option value={0}>否</Option>
            </Select>
          </Form.Item>
          
          <Form.Item label="位号" name="reference_designator">
            <Input placeholder="如: R1, R2, C1" />
          </Form.Item>
          
          <Form.Item label="备注" name="notes">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}