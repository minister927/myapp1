'use client';

import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  BuildOutlined,
  FileTextOutlined,
  GoldOutlined,
  ProfileOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons';
import Link from 'next/link';

const { Sider } = Layout;

export default function MenuSider() {
  return (
    <Sider>
      {/* 顶部占位块 */}
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
        items={[
          {
            key: '/admin/dashboard',
            icon: <DashboardOutlined />,
            label: <Link href="/admin/dashboard">首页</Link>,
          },
          {
            key: '/admin/dashboard/employees',
            icon: <UserOutlined />,
            label: <Link href="/admin/dashboard/employees">员工管理</Link>,
          },

          /* ===== 物料管理 ===== */
          {
            key: 'material-mgmt',   // 只要唯一即可
            icon: <AppstoreOutlined />,
            label: '物料管理',
            children: [
              {
                key: '/admin/dashboard/material',
                icon: <GoldOutlined />,
                label: <Link href="/admin/dashboard/material">成品信息</Link>,
              },
              {
                key: '/admin/dashboard/bom_info',
                icon: <ProfileOutlined />,
                label: <Link href="/admin/dashboard/bom_info">BOM 信息</Link>,
              },
              {
                key: '/admin/dashboard/bom_detailinfo',
                icon: <FileTextOutlined />,
                label: <Link href="/admin/dashboard/bom_detailinfo">BOM 详情</Link>,
              },
              {
                key: '/admin/dashboard/material_info',
                icon: <BuildOutlined />,
                label: <Link href="/admin/dashboard/material_info">物料信息</Link>,
              },
            ],
          },

          /* ===== 设备管理 ===== */
          {
            key: '/admin/dashboard/devicemanage',
            icon: <BuildOutlined />,
            label: <Link href="/admin/dashboard/devicemanage">设备管理</Link>,
          },

          /* ===== 订单管理 ===== */
          {
            key: 'order-mgmt',   // 只要唯一即可
            icon: <ShoppingOutlined />,
            label: '订单管理',
            children: [
              {
                key: '/admin/dashboard/customers',
                icon: <CustomerServiceOutlined />,
                label: <Link href="/admin/dashboard/customers">客户档案</Link>,
              },
              {
                key: '/admin/dashboard/orders',
                icon: <FileTextOutlined />,
                label: <Link href="/admin/dashboard/orders">订单信息</Link>,
              },
            ],
          },
        ]}
      />
    </Sider>
  );
}