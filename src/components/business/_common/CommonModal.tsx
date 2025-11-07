'use client';
import { Form, Modal } from 'antd';
import EditForm from '@/components/business/_common/EditForm';

interface P {
  open: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
}

export default function BomModal({ open, onCancel, onOk }: P) {
  const [form] = Form.useForm();

  const handleOk = async () => {
    const values = await form.validateFields();
    onOk(values);
    form.resetFields();
  };

  return (
    <Modal open={open} title="新增 BOM" onCancel={onCancel} onOk={handleOk}>
      <Form form={form} layout="vertical">
        <EditForm />
      </Form>
    </Modal>
  );
}