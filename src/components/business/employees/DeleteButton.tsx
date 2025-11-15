// src/app/admin/dashboard/materialmanage/bom-detail/DeleteButton.tsx
'use client';

import { Button, Popconfirm, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { API_PATH } from './config';



export default function DeleteButton({ record, onOk }: { 
  record: any; 
  onOk: () => void 
}) {
  console.log('DeleteButton record:', record);
  const handleDelete = async () => {
    try {
      const res = await fetch(API_PATH, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employee_id: record.employee_id }),
      });
      
      if (!res.ok) throw new Error('删除失败');
      console.log('🗑️ material 删除ID:', record.employee_id) ;
      message.success('删除成功');
      onOk();
    } catch (error) {
      message.error('删除失败');
    }
  };

  return (
    <Popconfirm
      title="确定删除？"
      onConfirm={handleDelete}
      okText="确定"
      cancelText="取消"
    >
      <Button type="link" danger icon={<DeleteOutlined />} size="small">
        删除
      </Button>
    </Popconfirm>
  );
}