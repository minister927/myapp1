'use client';

import { useEffect, useState } from 'react';
import AddButton from '@/components/business/device/AddButton';//'./'代表当前所处目录文件所在路径  '../'代表所处文件所在的上一级目录
import EditButton from '@/components/business/device/EditButton';
import { Form, Button, message, Modal } from 'antd';
import DeleteButton from '@/components/business/device/DeleteButton';


type Device = {
  device_id: number;
  device_name: string;
  device_model?: string;
  installation_location?: string;
  current_status?: string;
};

export default function Home() {
  const [list, setList] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
 
  /* 生命周期：组件挂载后拉取数据 */
  useEffect(() => {
    fetch('/api/device')                 // 向后端 GET /api/device
      .then((res) => res.json())         // 解析 JSON
      .then((data) => {
        setList(data);                   // 写入状态 => 触发重新渲染
        setLoading(false);               // 关闭加载提示
      })
      .catch((err) => {
        console.error(err);              // 打印错误
        setLoading(false);               // 无论如何都要结束加载态
      });
  }, []);                                // 空依赖 => 只执行一次


  const fetchDevices = async () => {
    const res = await fetch('/api/device');
    const data: Device[] = await res.json();
    setList(data);          // 更新 state → 页面自动重渲染
  };

  /* 加载中占位 */
  if (loading) return <p className="p-6">加载中...</p>;


  // // ② 删除
  // const handleDelete = async (id: number) => {
  //   try {
  //     if (!confirm('确定删除该设备？')) return;
  //     const res = await fetch(`/admin/dashboard/api/device?id=${id}`, { 
  //       method: 'DELETE'
  //     });
  //     console.log('删除设备的id：', id);
  //     if (!res.ok) throw new Error('网络错误');
  //     message.success('删除成功');
  //     await fetchDevices();   // ← 重新拉数据，列表即刻同步
  //   } catch {
  //     message.error('添加失败');
  // }
  // };



  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">设备管理</h1>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">设备ID</th>
            <th className="border p-2">设备名称</th>
            <th className="border p-2">型号</th>
            <th className="border p-2">安装位置</th>
            <th className="border p-2">当前状态</th>
            <th className="border p-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {list.map((d) => (
            <tr key={d.device_id}>
              <td className="border p-2">{d.device_id}</td>
              <td className="border p-2">{d.device_name}</td>
              <td className="border p-2">{d.device_model || '-'}</td>
              <td className="border p-2">{d.installation_location || '-'}</td>
              <td className="border p-2">{d.current_status || '-'}</td>
              <td className="border p-2">
                <div className="flex gap-2">
                  {/* <button
                    onClick={() => handleDelete(d.device_id)}
                    className="text-red-600 hover:underline"
                  >
                    删除
                  </button> */}
                  <DeleteButton device={d} onSuccess={() => fetchDevices()}/>
                  <EditButton device={d} onSuccess={() => fetchDevices()}/>
              </div>
             </td>
            </tr>
          ))} 
        </tbody>
      </table>
      
      {/* 添加按钮 */}
      <AddButton onSuccess={() => fetchDevices()} />
    </main>
  );
}