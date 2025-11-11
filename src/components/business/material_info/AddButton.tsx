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
        新增物料
      </Button>
      
      <Modal 
        open={open} 
        title="新增物料" 
        onCancel={() => setOpen(false)}
        onOk={handleAdd}
        confirmLoading={loading}
        width={600}
>
          <Form form={form} layout="vertical">
            <Form.Item 
              label="物料编码" 
              name="material_code" 
              rules={[
                { required: true, message: '请输入物料编码' },
                { max: 50, message: '最多50个字符' }
              ]}
            >
              <Input placeholder="请输入唯一物料编码" />
            </Form.Item>
            
            <Form.Item 
              label="物料名称" 
              name="material_name" 
              rules={[
                { required: true, message: '请输入物料名称' },
                { max: 255, message: '最多255个字符' }
              ]}
            >
              <Input placeholder="请输入物料名称" />
            </Form.Item>
            
            <Form.Item 
              label="物料类型" 
              name="material_type" 
              rules={[{ required: true, message: '请选择物料类型' }]}
            >
              <Select placeholder="请选择物料类型">
                <Option value="Product">成品</Option>
                <Option value="Semi-Finished">半成品</Option>
                <Option value="Raw">原材料</Option>
                <Option value="Component">组件</Option>
                <Option value="Auxiliary">辅料</Option>
              </Select>
            </Form.Item>
            
            <Form.Item 
              label="物料规格" 
              name="material_specs"
              rules={[{ max: 500, message: '最多500个字符' }]}
            >
              <Input.TextArea rows={2} placeholder="请输入物料规格（可选）" />
            </Form.Item>
            
            <Form.Item 
              label="计量单位" 
              name="unit" 
              rules={[
                { required: true, message: '请输入计量单位' },
                { max: 20, message: '最多20个字符' }
              ]}
            >
              <Input placeholder="如：个、kg、m、件" />
            </Form.Item>
            
            <Form.Item 
              label="物料单价" 
              name="unit_price"
              rules={[{ type: 'number', min: 0, message: '请输入有效的价格' }]}
            >
              <InputNumber 
                style={{ width: '100%' }} 
                placeholder="请输入单价（可选）"
                min={0}
                step={0.01}
                precision={2}
              />
            </Form.Item>
            
            <Form.Item 
              label="默认供应商" 
              name="supplier"
              rules={[{ max: 255, message: '最多255个字符' }]}
            >
              <Input placeholder="请输入默认供应商（可选）" />
            </Form.Item>
            
            <Form.Item 
              label="是否启用" 
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