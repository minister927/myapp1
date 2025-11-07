// src/app/admin/dashboard/materialmanage/bom/DeleteButton.tsx
'use client';

import { Button, Popconfirm, message } from 'antd';
// import { API_PATH } from '@/components/business/bom/config';

export default function DeleteButton({ record, onOk }: { record: any; onOk: () => void }) {
  const handleDel = async () => {
    await fetch(API_PATH, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bom_id: record.bom_id }),
    });
    message.success('已删除');
    onOk();
  };

  return (
    <Popconfirm title="确定删除？" onConfirm={handleDel}>
      <Button type="link" danger>删除</Button>
    </Popconfirm>
  );
}