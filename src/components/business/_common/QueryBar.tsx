// src/app/admin/dashboard/materialmanage/bom/QueryBar.tsx
'use client';

import { Input } from 'antd';
const { Search } = Input;


//在父组件 MaterialTable 里用前端 Array.filter 完成的——属于纯前端模糊搜索
//前端查询适用于少量数据的查询，每一次查询的请求都要重新获取全部表单数据，
//在数据库数据数据量大时建议使用后端查询，传输数据量少，优化性能
export default function QueryBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <Search placeholder="搜索 BOM 编码/名称" value={value} onChange={(e) => onChange(e.target.value)} style={{ width: 260 }} />;
}