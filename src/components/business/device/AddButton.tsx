'use client';  

import { useEffect, useState } from 'react';  
import { Modal, Form, Input, message } from 'antd';

type Device = {
  device_id: number;
  device_name: string;
  device_model?: string;
  installation_location?: string;
  current_status?: string;
  total_operating_hours?: number;
  last_maintenance_date?: string;
  manufacturer?: string;
  purchase_date?: string;
};

type Props = {
  onSuccess: () => void; // 父组件给的回调
};

export default function AddButton({ onSuccess }: Props) {
   /* 状态区 */
   const [list, setList] = useState<Device[]>([]); // 设备列表
   const [open, setOpen] = useState(false);  //设置是否打开增加框的常亮
   const [form] = Form.useForm();


   const fetchDevices = async () => {
    const res = await fetch('/api/device');
    const data: Device[] = await res.json();
    setList(data);          // 更新 state → 页面自动重渲染
  };

 /* ---------- 增 ---------- */
/* 提交新增 */
const handleAdd = async () => {
  try {
    const values = await form.validateFields(); 
    /* ✅ 这里打印 */
    const res = await fetch('/api/device', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    if (!res.ok) throw new Error('添加失败');
    message.success('添加成功');
    setOpen(false);
    form.resetFields();
    onSuccess();
  } catch {
    message.error('添加失败');
  }
};
 
    return(
      // 包裹多个同级 JSX 元素，避免额外嵌套一层 DOM 节点。<> 就是“隐形盒子”，只用来满足 JSX 的“单根”规则，不会生成任何真实 DOM 节点。
      <>  
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition transform duration-200"
      >
        添加设备
      </button>

      {/* AntD 弹窗表单 */}
      <Modal
        title="新增设备"
        open={open}
        onOk={handleAdd}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
        }}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" initialValues={{ current_status: 'Running' }}>
          <Form.Item label="设备名称" name="device_name" rules={[{ required: true, message: '请输入设备名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="型号" name="device_model">
            <Input />
          </Form.Item>
          <Form.Item label="安装位置" name="installation_location">
            <Input />
          </Form.Item>
          <Form.Item label="当前状态" name="current_status">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
    )
  }