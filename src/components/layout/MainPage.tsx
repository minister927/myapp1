'use client';
import React from 'react';
import MainHeader from '@/components/layout/MainHeader';
import MenuSider from '@/components/layout/MenuSider';
import { Layout } from 'antd';

const { Header, Content, Sider } = Layout;

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <MenuSider />
      <Layout>
        <MainHeader />
        <Content style={{ margin: 24, padding: 24, background: '#fff' }}>{children}</Content>
      </Layout>
    </Layout>
  );
}