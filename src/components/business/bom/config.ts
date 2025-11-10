// src/app/admin/dashboard/materialmanage/bom/config.ts
// 当前模块：BOM 管理页「静态配置」集中写在这里，方便一处改、处处生效
export const API_PATH = '/api/bom_head';
export const API_PATH_changelog = '/api/change_log';

export const columns = [
  { title: 'BOM编码', dataIndex: 'bom_code', key: 'bom_code' },
  { title: 'BOM名称', dataIndex: 'bom_name', key: 'bom_name' },
  { title: '版本', dataIndex: 'bom_version', key: 'bom_version', width: 80 },
  { title: '类型', dataIndex: 'bom_type', key: 'bom_type', width: 90 },
  { title: '状态', dataIndex: 'bom_status', key: 'bom_status', width: 90 },
  { title: '创建人', dataIndex: 'creator', key: 'creator', width: 120 },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    key: 'created_at',
    width: 160,
    render: (v: string) => new Date(v).toLocaleString(),//渲染
  },
  
];