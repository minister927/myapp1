'use client';

import { useRouter, useSelectedLayoutSegment } from 'next/navigation';
import { Menu } from 'antd';
import {
  UserOutlined,
  DesktopOutlined,
  AppstoreOutlined,
  PicRightOutlined,
} from '@ant-design/icons';

const { SubMenu } = Menu;

export default function MenuSider({ collapsed }: { collapsed?: boolean }) {
  const router = useRouter();
  const segment = useSelectedLayoutSegment(); // 取当前路由段，用于高亮

  // 根据 segment 反推出需要展开的 SubMenu
  const openKeys: string[] = [];
  if (segment === 'bom-info') openKeys.push('bom');

  return (
    <Menu
      theme="dark"
      mode="inline"
      defaultOpenKeys={openKeys}
      selectedKeys={[`/${segment}`]}
      onClick={({ key }) => router.push(key)}
      items={[
        {
          key: '/admin/dashboard',
          icon: <UserOutlined />,
          label: '首页',
        },
        {
          key: '/customer',
          icon: <UserOutlined />,
          label: '客户管理',
        },
        {
          key: '/', // 物料管理
          icon: <AppstoreOutlined />,
          label: '物料管理',
          children: [
            {
              key: '/admin/dashboard/material',
              icon: <DesktopOutlined />,
              label: '成品信息',
            },
            {
              key: '/admin/dashboard/bom_info',
              icon: <PicRightOutlined />,
              label: 'BOM 信息',
            },
             {
              key: '/admin/dashboard/bom_detailinfo',
              icon: <PicRightOutlined />,
              label: 'BOM 详情',
            },
             {
              key: '/admin/dashboard/material_info',
              icon: <PicRightOutlined />,
              label: '物料信息',
            },
          ],
        },
        {
          key: '/admin/dashboard/devicemanage',
          icon: <DesktopOutlined />,
          label: '设备管理',
        },
      ]}
    />
  );
}