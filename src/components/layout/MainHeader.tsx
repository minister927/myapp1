'use client';
import { Layout, Menu, Breadcrumb, Avatar, Dropdown, Space, Typography } from 'antd';
import {
  UserOutlined,
  DesktopOutlined,
  DownOutlined,
} from '@ant-design/icons';
import useBreadcrumb from '@/components/hooks/useBreadcrumb';
import useUserMenu from '@/components/hooks/useUserMenu';

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

export default function MainHeader() {
  const breadcrumbItems = useBreadcrumb();//将面包屑逻辑脱离易于复用

     const userMenu = useUserMenu();

  return (
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
  );
}