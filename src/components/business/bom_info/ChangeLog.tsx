// src/app/admin/dashboard/materialmanage/bom/cha.tsx
'use client';

import { useState,useEffect } from 'react';
import { Button, Form, Input, Modal, Select, message } from 'antd';
import { API_PATH_changelog } from './config';

const { Option } = Select;


export default function updatechangelog({ record ,onOk}: { record: any; onOk: () => void  }) {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

   // 当弹窗打开且record.bom_id存在时，加载变更记录
  useEffect(() => {
    if (!open || !record?.bom_id) 
      return;

    const loadChangeLog = async () => {
      try {
        console.log('加载变更记录 for BOM ID:', record.bom_id);
        const res = await fetch(`${API_PATH_changelog}?bom_id=${record.bom_id}`);
        const data = await res.json();
        console.log('变更记录响应数据:', data);
        
        if (res.ok && Array.isArray(data) && data.length > 0) {
          // 按时间降序排序，取最新的记录
          const sortedData = data.sort((a, b) => 
            new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime()
          );
          form.setFieldsValue(sortedData[0]); // 填充最新记录到表单
        } else {
          // 无历史记录时，预填充部分字段
          form.setFieldsValue({
            bom_id: record.bom_id,
            //可以增加无变更记录提示
          });
        }
      } catch (error) {
        console.error('加载变更记录失败:', error);
        message.error('加载变更记录失败');
      }
    };
    loadChangeLog();
  }, [open, record?.bom_id, form]); // 依赖项：弹窗状态、bom_id、form实例



  const updatechangelog = async () => {
    try {
      const values = await form.validateFields();
      await fetch(API_PATH_changelog, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...record, ...values }),
      });
      message.success('修改变更记录成功');
      setOpen(false);
      onOk();
    } catch (e) {
      message.error('修改变更记录失败');
    }
  };

  return (
    <>
      <Button type="link" onClick={() => { setOpen(true); form.setFieldsValue(record); }}>变更记录</Button>
      <Modal 
        open={open} 
        title="编辑变更记录" 
        onCancel={() => setOpen(false)}
        onOk={updatechangelog}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="变更记录ID" name="change_id">
            <Input disabled />
          </Form.Item>
          
          <Form.Item label="BOM ID" name="bom_id" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          
          <Form.Item label="变更类型" name="change_type" rules={[{ required: true }]}>
            <Select>
              <Option value="Create">创建</Option>
              <Option value="Update">更新</Option>
              <Option value="Delete">删除</Option>
            </Select>
          </Form.Item>
          
          <Form.Item label="变更描述" name="change_description" rules={[{ required: true }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          
          <Form.Item label="变更原因" name="change_reason">
            <Input.TextArea rows={2} />
          </Form.Item>
          
          <Form.Item label="变更人" name="changed_by" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          
          <Form.Item label="变更时间" name="changed_at">
            <Input type="datetime-local" disabled />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}