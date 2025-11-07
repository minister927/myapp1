import { Form, Button, message, Modal } from 'antd';


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
    device: Device; 
    onSuccess: () => void; // 父组件给的回调
  };


export default function DeleteButton({ device, onSuccess }: Props)  {

  // ② 删除
  const handleDelete = async () => {
    try {
        // const deletedid = device.device_id;//可改为  body: JSON.stringify({ device_id: device.device_id }),
      if (!confirm('确定删除该设备？')) return;
      const res = await fetch(`/api/device`, { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(device),
      });
      console.log(device)
      if (!res.ok) throw new Error('网络错误');
      message.success('删除成功');
      onSuccess();
    } catch {
      message.error('添加失败');
  }
  };

  return (

    <button
         onClick={handleDelete}
        className="text-red-600 hover:underline"
        >
        删除
    </button> 

  )
}
