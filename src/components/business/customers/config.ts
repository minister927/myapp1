// src/app/admin/dashboard/customers/config.ts
export const API_PATH = '/api/customers';

/* ============= 信用等级中文映射（可选） ============= */
const creditMap = {
  'A': 'A级-优质',
  'B': 'B级-良好',
  'C': 'C级-一般',
  'D': 'D级-风险',
} as const;
type CreditKey = keyof typeof creditMap;

/* ============= 客户状态颜色 ============= */
const activeMap = { 1: '✅ 有效', 0: '❌ 无效' } as const;

/* ============= 客户表列配置 ============= */
export const columns = [
  { title: '客户ID', dataIndex: 'customer_id', key: 'customer_id', width: 80 },
  { title: '客户编码', dataIndex: 'customer_code', key: 'customer_code' },
  { title: '客户名称', dataIndex: 'customer_name', key: 'customer_name', ellipsis: true },
  { title: '联系人', dataIndex: 'contact_person', key: 'contact_person', ellipsis: true },
  { title: '联系电话', dataIndex: 'phone', key: 'phone', ellipsis: true },
  { title: '邮箱', dataIndex: 'email', key: 'email', ellipsis: true },
  { title: '地址', dataIndex: 'address', key: 'address', ellipsis: true },
  { 
    title: '信用等级', 
    dataIndex: 'credit_rating', 
    key: 'credit_rating',
    render: (level: string) => creditMap[level as CreditKey] || level
  },
  { 
    title: '状态', 
    dataIndex: 'is_active', 
    key: 'is_active',
    render: (active: number) => activeMap[active as keyof typeof activeMap] || '⚪ 未知'
  },
  { 
    title: '创建时间', 
    dataIndex: 'created_at', 
    key: 'created_at',
    render: (date: string) => date ? new Date(date).toLocaleString() : '-'
  },
  { 
    title: '更新时间', 
    dataIndex: 'updated_at', 
    key: 'updated_at',
    render: (date: string) => date ? new Date(date).toLocaleString() : '-'
  },
];