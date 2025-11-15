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
        新增员工
      </Button>
      
      <Modal
        open={open}
        title="新增员工"
        onCancel={() => setOpen(false)}
        onOk={handleAdd}
        confirmLoading={loading}
        width={600}
      >
        <Form form={form} layout="vertical">
          {/* 员工工号 */}
          <Form.Item
            label="员工工号"
            name="employee_number"
            rules={[
              { required: true, message: '请输入员工工号' },
              { max: 50, message: '最多50个字符' }
            ]}
          >
            <Input placeholder="请输入唯一员工工号" />
          </Form.Item>

          {/* 员工姓名 */}
          <Form.Item
            label="员工姓名"
            name="name"
            rules={[
              { required: true, message: '请输入员工姓名' },
              { max: 100, message: '最多100个字符' }
            ]}
          >
            <Input placeholder="请输入员工姓名" />
          </Form.Item>

          {/* 所属部门 */}
          <Form.Item
            label="所属部门"
            name="department"
            rules={[{ required: true, message: '请选择所属部门' }]}
          >
            <Select placeholder="请选择所属部门">
              <Option value="研发部">研发部</Option>
              <Option value="生产部">生产部</Option>
              <Option value="质量部">质量部</Option>
              <Option value="采购部">采购部</Option>
              <Option value="仓储部">仓储部</Option>
              <Option value="销售部">销售部</Option>
              <Option value="财务部">财务部</Option>
              <Option value="人事部">人事部</Option>
            </Select>
          </Form.Item>

          {/* 职位 */}
          <Form.Item
            label="职位"
            name="position"
            rules={[{ required: true, message: '请输入职位' }]}
          >
            <Input placeholder="请输入职位" />
          </Form.Item>

          {/* 入职日期 */}
          <Form.Item
            label="入职日期"
            name="hire_date"
            rules={[{ required: true, message: '请选择入职日期' }]}
          >
            <Input type="date" style={{ width: '100%' }} />
          </Form.Item>

          {/* 是否在职 */}
          <Form.Item
            label="是否在职"
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