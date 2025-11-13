import { Layout, Menu, Breadcrumb, Avatar, Dropdown, Space, Typography } from 'antd';
import {
  UserOutlined,
  DesktopOutlined,
  DownOutlined,
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

export default function MainHeader() {

     const userMenu = [
    { key: 'profile', label: '个人中心' },
    { key: 'logout', label: '退出登录' },
  ];


  const breadcrumbItems = [
    { title: '首页' },
    { title: '设备管理' },
  ];

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