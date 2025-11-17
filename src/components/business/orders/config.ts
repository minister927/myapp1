// src/app/admin/dashboard/orders/config.ts
export const API_PATH = '/api/orders';
import type { FieldMeta } from '@/lib/crud';

/* =================== 订单状态中文映射 =================== */
const statusMap = {
  Draft:       '草稿',
  Confirmed:   '已确认',
  'In Production': '生产中',
  Shipped:     '已发货',
  Delivered:   '已交付',
  Cancelled:   '已取消',
} as const;
type StatusKey = keyof typeof statusMap;

/* =================== 优先级颜色+中文映射 =================== */
const priorityMap = {
  Low:    { text: '低',   color: '#87d068' },
  Medium: { text: '中',   color: '#faad14' },
  High:   { text: '高',   color: '#fa8c16' },
  Urgent: { text: '紧急', color: '#f5222d' },
} as const;
type PriorityKey = keyof typeof priorityMap;

/* =================== 币种符号映射（可选） =================== */
const currencySymbol: Record<string, string> = {
  CNY: '¥',
  USD: '$',
  EUR: '€',
};

/* =================== 订单列表列配置 =================== */
export const columns = [
  { title: '订单ID', dataIndex: 'order_id', key: 'order_id', width: 80 },
  { title: '订单编号', dataIndex: 'order_number', key: 'order_number', width: 140 },
  { title: '客户ID', dataIndex: 'customer_id', key: 'customer_id', width: 100 },
  { title: '订单日期', dataIndex: 'order_date', key: 'order_date',
    render: (d: string) => d ? new Date(d).toLocaleDateString() : '-' },
  { title: '交货日期', dataIndex: 'delivery_date', key: 'delivery_date',
    render: (d: string) => d ? new Date(d).toLocaleDateString() : '-' },
  { title: '实际交货', dataIndex: 'actual_delivery_date', key: 'actual_delivery_date',
    render: (d: string) => d ? new Date(d).toLocaleDateString() : '未交付' },

  { title: '总数量', dataIndex: 'total_quantity', key: 'total_quantity', align: 'right' as const },
  { title: '总金额', dataIndex: 'total_amount', key: 'total_amount', align: 'right' as const,
    render: (_: number, record: any) =>
      `${currencySymbol[record.currency] ?? '¥'}${Number(record.total_amount).toFixed(2)}` },

  { title: '币种', dataIndex: 'currency', key: 'currency', width: 60 },
  { title: '订单状态', dataIndex: 'order_status', key: 'order_status', width: 100,
    render: (s: string) => statusMap[s as StatusKey] ?? s },
  // { title: '优先级', dataIndex: 'priority', key: 'priority', width: 90,
  //   render: (p: string) => {
  //     const { text, color } = priorityMap[p as PriorityKey] ?? { text: p, color: '' };
  //     return <span style={{ color }}>{text}</span>;
  //   } },

  { title: '销售人员', dataIndex: 'sales_person', key: 'sales_person', ellipsis: true },
  { title: '运输方式', dataIndex: 'shipping_method', key: 'shipping_method', ellipsis: true },
  { title: '备注', dataIndex: 'notes', key: 'notes', ellipsis: true,
    render: (t: string) => t || '-' },
];

