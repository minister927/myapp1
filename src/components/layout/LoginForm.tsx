'use client';
import { useRouter } from 'next/navigation';
import { Card, Form, Button, Input, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useState } from 'react';

type FormValue = { username: string; password: string };

export default function LoginForm() {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: FormValue) => {
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        messageApi.success('登录成功');
        setTimeout(() => router.replace('/admin/dashboard'), 500); // 给 0.8s 动画，优化体验
      } else {
        messageApi.error(data.message || '登录失败');
      }
    } catch {
      messageApi.error('网络错误，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {contextHolder}
    <Form
    
      labelCol={{ span: 4 }}
      onFinish={onFinish}
      size="large"
      autoComplete="off"
    >
      <Form.Item
        name="username"
        label="用户名"
        rules={[{ required: true, whitespace: true, message: '请输入用户名' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
      </Form.Item>

      <Form.Item
        name="password"
        label="密码"
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
      </Form.Item>

      <Form.Item className="mb-0">
        <Button
          block
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={loading}
        >
          登录
        </Button>
      </Form.Item>
    </Form>
    </>
  );
}