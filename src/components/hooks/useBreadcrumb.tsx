//用于展示用户所在路由的面包屑导航,若要复用面包屑即可再加不同名的方法，使用不同逻辑
'use client';

import { useSelectedLayoutSegment } from 'next/navigation';
import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb';


const routeMap: Record<string, { label: string; href?: string }> = {
//dashboard: { label: '工作台', href: '/dashboard' },
  employees: { label: '员工管理', href: '/admin/dashboard/employees' },

//   deviceDetail: { label: '设备详情' }, // 末级不带 href
  material:{ label: '成品信息', href: '/admin/dashboard/marerial' },
  bom_info:{ label: 'BOM 信息', href: '/admin/dashboard/marerial' },
  bom_detailinfo:{ label: 'BOM 详情', href: '/admin/dashboard/marerial' },

  material_info:{ label: '物料档案', href: '/admin/dashboard/marerial' },

  devicemanage: { label: '设备管理', href: '/admin/dashboard/device' },

  customers:{ label: '客户档案', href: '/admin/dashboard/marerial' },
  orders:{ label: '订单信息', href: '/admin/dashboard/marerial' },

};

export default function useBreadcrumb(): BreadcrumbItemType[] {
  const segment = useSelectedLayoutSegment(); // 例如 ["device","list"]
  const segs = segment ? segment.split('/') : [];
  console.log('面包屑从路由解析出的segs:',segs)

  const items: BreadcrumbItemType[] = [{ title: '首页', href: '/admin/dashboard' }];
  let cumPath = '   ';
  segs.forEach((s, i) => {
    cumPath += `/${s}`;
    const meta = routeMap[s];
    if (!meta) return; // 找不到就跳过
    items.push({
      title: meta.href ? (
        <a href={meta.href}>{meta.label}</a>
      ) : (
        meta.label
      ),
      href: meta.href ? cumPath : undefined,
    });
  });
  return items;
}