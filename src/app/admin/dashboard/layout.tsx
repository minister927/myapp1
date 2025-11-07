'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MenuSider from '@/components/layout/MenuSider'
import { Layout, Menu, Breadcrumb, Avatar, Dropdown, Space, Typography } from 'antd';
import {
  UserOutlined,
  DesktopOutlined,
  DownOutlined,
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

export default function DeviceManageLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const userMenu = [
    { key: 'profile', label: '个人中心' },
    { key: 'logout', label: '退出登录' },
  ];


  const breadcrumbItems = [
    { title: '首页' },
    { title: '设备管理' },
  ];
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 左侧导航 */}
      {/* <Sider collapsible>
        <div
          style={{
            height: 32,
            margin: 16,
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: 4,
          }}
        />
        <Menu
          theme="dark"
          defaultSelectedKeys={['/admin/dashboard/devicemanage']}
          items={[
            { key: '/admin/dashboard', icon: <UserOutlined />, label: '首页' },
            { key: '/', icon: <UserOutlined />, label: '客户管理' },
            { key: '/admin/dashboard/bommanage', icon: <DesktopOutlined />, label: '物料管理' },
            { key: '/admin/dashboard/devicemanage', icon: <DesktopOutlined />, label: '设备管理' },
          ]}
          onClick={({ key }) => router.push(key)}
        />
      </Sider> */}
       <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div
          style={{
            height: 32,
            margin: 16,
            background: 'rgba(255,255,255,0.3)',
            borderRadius: 4,
          }}
        />
        <MenuSider collapsed={collapsed} />
      </Sider>


      {/* 右侧内容区 */}
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Breadcrumb items={breadcrumbItems} />

          <Dropdown menu={{ items: userMenu }} trigger={['click']}>
            <Space style={{ cursor: 'pointer' }}>
              <Avatar size="small" src="/maodie.jpg" alt="me" />
              <Text>管理员</Text>
              <DownOutlined />
            </Space>
          </Dropdown>
        </Header>

        <Content style={{ margin: 24, padding: 24, background: '#fff' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}