'use client';

import MainHeader from '@/components/layout/MainHeader';
import MenuSider from '@/components/layout/MenuSider'
import { Layout, Menu, Breadcrumb, Avatar, Dropdown, Space, Typography } from 'antd';// 1. 引入 antd 组件需要使用'use client',该库组件是客户端渲染的


const { Header, Content, Sider } = Layout;
const { Text } = Typography;

export default function DeviceManageLayout({ children }: { children: React.ReactNode }) {

  return (
    <Layout style={{ minHeight: '100vh' }}>
       {/* 左侧标签页 */}
        <MenuSider />
      {/* 右侧内容区 */}
      <Layout>
        <MainHeader />
        <Content style={{ margin: 24, padding: 24, background: '#fff' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}