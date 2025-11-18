// src/app/admin/dashboard/materialmanage/bom/EditButton.tsx
'use client';

import { useState } from 'react';
import { Button, Form, Input, Modal, Select, message } from 'antd';
import { API_PATH } from './config';
// import { getCurrentUser } from '@/lib/get-user';//bu允许在客户端组件中使用该工具，next/headers 是服务端专属 API，不能在浏览器中运行。客户端组件需要数据时，必须通过 Props 从服务端组件传递下来。

const { Option } = Select;

export default function EditButton({ EditUser,record, onOk }: { EditUser:any ;record: any; onOk: () => void }) {
  
  const [openEdit, setOpenEdit] = useState(false);
  const [openReason, setOpenReason] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [reasonForm] = Form.useForm();




  const handleEditClick = () => {
    reasonForm.resetFields();
    console.log('编辑记录:', record);
    // reasonForm.setFieldsValue(record);
    reasonForm.setFieldsValue({
      bom_id: record.bom_id,
      changed_by: EditUser.user.admin_username,
    });
    console.log('编辑的用户：', EditUser);
    console.log('编辑的用户用户名：', EditUser.user.admin_username);
    setOpenReason(true);
  }

  const handleReasonOk = async () => {
    try {

      await reasonForm.validateFields();
      setOpenReason(false);
      setOpenEdit(true);
      form.setFieldsValue(record);
    } catch (error) {
      // 验证失败，保持 modal 打开
    }
  }

  const handleEditOk = async () => {
    try {
      const editValues = await form.validateFields();
      console.log('编辑值:', editValues);
      const reasonValues = reasonForm.getFieldsValue();
      console.log('变更原因值:', reasonValues);
      setLoading(true);
      
      // 先记录变更日志
      const logRes = await fetch('/api/change_log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reasonValues),
      });
      
      if (!logRes.ok) {
        throw new Error('记录变更日志失败');
      }
      
      // 然后更新物料
      const updateRes = await fetch(API_PATH, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editValues, material_id: record.material_id }),
      });
      
      if (!updateRes.ok) {
        throw new Error('更新物料失败');
      }
      
      message.success('编辑成功');
      form.resetFields();
      setOpenEdit(false);
      onOk();
    } catch (error: any) {
      message.error(error.message || '编辑失败');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button type="link" onClick={handleEditClick}>编辑</Button>

       {/* 变更原因 Modal */}
      <Modal 
        open={openReason} 
        title="编辑变更原因" 
        onCancel={() => setOpenReason(false)}
        onOk={handleReasonOk}
        okText="继续编辑"
        width={500}
      >
        <Form form={reasonForm} layout="vertical">
          <Form.Item label="BomId" name="bom_id" rules={[{ required: true }]}>
            <Input readOnly />
          </Form.Item>
          <Form.Item label="变更人" name="changed_by" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="变更描述" name="change_description" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item 
            label="变更原因" 
            name="change_reason"
            rules={[{ required: true, message: '请输入变更原因' }]}
          >
            <Input.TextArea rows={3} placeholder="请描述变更原因..." />
          </Form.Item>
          <Form.Item name="change_type" initialValue="update" noStyle>
            <Input type="hidden" />
          </Form.Item>
        </Form>
      </Modal>
      



       {/* 编辑物料 Modal */}
      <Modal 
        open={openEdit} 
        title="编辑物料" 
        onCancel={() => setOpenEdit(false)}
        onOk={handleEditOk}
        confirmLoading={loading}
        width={600}
      >
        <Form form={form} layout="vertical">
          {/* 与 AddButton 表单完全一致 */}
          <Form.Item
            label="BomId"
            name="bom_id"
            rules={[{ required: true, message: 'BomId 不能为空' }]}
            style={{ display: 'none' }}   /* ← 整个 Form.Item 都不可见 */
          >
            <Input />                      {/* 不需要再加 hidden */}
          </Form.Item>
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