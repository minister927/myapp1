// components/EditButton.tsx
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
    device: Device; 
    onSuccess: () => void; // 父组件给的回调
  };

export default function EditButton({ device, onSuccess }: Props)  {

     /* 状态区 */
   const [list, setList] = useState<Device[]>([]); // 设备列表
   const [open, setOpen] = useState(false);  //设置是否打开增加框的常亮
   const [form] = Form.useForm();

   useEffect(() => {
    if (open)
     form.setFieldsValue(device);   // 打开时回填
  }, [open, device, form]);


        const handleEdit = async () => {
        console.log('device 对象:', device);
        console.log('device_id:', device.device_id);
        console.log('设备名称:', device.device_name);
        try {
            const values = await form.validateFields();   // 校验并拿到最新值，await方法只允许在异步函数里面使用
            // const payload: Device = { ...device, ...values }; // 合并原数据(原来的内容device和刚填写的value)

            // 1. 调你的更新接口（示例）
            const res = await fetch(`/api/device`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(values),
            });
      
            if (!res.ok) throw new Error('更新失败');
      
            setOpen(false);          // 关闭弹窗
            form.resetFields();      // 清空表单
            onSuccess();             //表示更新完成
          } catch (e: any) {
            message.error(e.message || '校验/网络错误');
          }
      };


    return (
        <>
            <button
                 onClick={() => setOpen(true)}
                className="text-red-600 hover:underline"
            >
                编辑
            </button>

            
            {/* AntD 弹窗表单 */}
            <Modal
                title="编辑设备"
                open={open}
                onOk={handleEdit}
                onCancel={() => {
                setOpen(false);
                form.resetFields();
                }}
                okText="保存"
                cancelText="取消"
            >
                <Form form={form} layout="vertical" initialValues={{ current_status: 'Running' }}>
                <Form.Item name="device_id" noStyle>
                     <Input type="hidden" />
                </Form.Item>
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
    );
  }