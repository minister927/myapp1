'use client';

import { Button, Popconfirm, message } from 'antd';
import { API_PATH } from './config';


//两次调用接口可能出现不同步实现的情况
export default function DeleteButton({  record, onOk }: { record: any; onOk: () => void }) {
  const handleDel = async () => {
    // // 1. 先写变更日志           //因为change_log的bom_id关联bom_head的bom_id，当bom_head没有bom_id,change_log无法留存删除记录
    // console.log('删除更新日志的record',record)
    // const logRes = await fetch('/api/change_log', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     bom_id: record.bom_id,            // 被删的 BOM
    //     changed_by: EditUser.user.admin_username, // 操作人
    //     change_description: '删除bom_head',       // 描述
    //     change_type: 'Delete',                    // 类型
    //   }),
    // });
    

    // if (!logRes.ok) {
    //   message.error('记录变更日志失败');
    //   throw new Error('记录变更日志失败');
    // }

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