'use client';
import { Layout, Menu} from 'antd';
import {
  UserOutlined,
  DesktopOutlined,
  AppstoreOutlined,
  PicRightOutlined,
} from '@ant-design/icons';
import Link from "next/link";

const {  Sider } = Layout;


export default function MenuSider() {

  return (
     <Sider >
        <div
          style={{
            height: 32,
            margin: 16,
            background: 'rgba(255,255,255,0.3)',
            borderRadius: 4,
          }}
        />
    <Menu
      theme="dark"
      mode="inline"
      // onClick={({ key }) => router.push(key)}
      items={[
        {
          key: '/admin/dashboard',
          icon: <UserOutlined />,
          label: <Link href="/admin/dashboard">首页</Link>,
          
        },
        {
          key: '/customer',
          icon: <UserOutlined />,
          label: <Link href="/admin/dashboard/customer">客户管理</Link>,
        },
        {
          key: '/', // 物料管理
          icon: <AppstoreOutlined />,
          label: '物料管理',
          children: [
            {
              key: '/admin/dashboard/material',
              icon: <DesktopOutlined />,
              label: <Link href="/admin/dashboard/material">成品信息</Link>,
            },
            {
              key: '/admin/dashboard/bom_info',
              icon: <PicRightOutlined />,
              label: <Link href="/admin/dashboard/bom_info">BOM 信息</Link>,
            },
             {
              key: '/admin/dashboard/bom_detailinfo',
              icon: <PicRightOutlined />,
              label: <Link href="/admin/dashboard/bom_detailinfo">BOM 详情</Link>,
            },
             {
              key: '/admin/dashboard/material_info',
              icon: <PicRightOutlined />,
              label: <Link href="/admin/dashboard/material_info">物料信息</Link>,
            },
          ],
        },
        {
          key: '/admin/dashboard/devicemanage',
          icon: <DesktopOutlined />,
          label: <Link href="/admin/dashboard/devicemanage">设备管理</Link>,
        },
      ]}
    />
    </Sider>
  );
  
}