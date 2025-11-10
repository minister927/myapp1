// src/app/admin/dashboard/materialmanage/bom-detail/config.ts
export const API_PATH = '/api/bom_detail';

// bom_detail 表列配置
export const columns = [
  { title: '明细ID', dataIndex: 'detail_id', key: 'detail_id', width: 80 },
  { 
    title: 'BOM ID', 
    dataIndex: 'bom_id', 
    key: 'bom_id',
    render: (bom_id: number) => `BOM-${bom_id}`
  },
  { 
    title: '父项物料', 
    dataIndex: 'parent_material_id', 
    key: 'parent_material_id',
    render: (id: number) => `物料-${id}`
  },
  { 
    title: '子项组件', 
    dataIndex: 'component_material_id', 
    key: 'component_material_id',
    render: (id: number) => `组件-${id}`
  },
  { 
    title: '用量', 
    dataIndex: 'quantity', 
    key: 'quantity',
    render: (qty: string) => Number(qty).toFixed(4)
  },
  { 
    title: '损耗率(%)', 
    dataIndex: 'loss_rate', 
    key: 'loss_rate',
    render: (rate: string) => rate ? `${rate}%` : '0%'
  },
  { title: '工序号', dataIndex: 'operation_seq', key: 'operation_seq' },
  { 
    title: '关键组件', 
    dataIndex: 'is_critical', 
    key: 'is_critical',
    render: (is_critical: number) => is_critical ? '✅ 是' : '❌ 否'
  },
  { 
    title: '位号', 
    dataIndex: 'reference_designator', 
    key: 'reference_designator',
    ellipsis: true
  },
  { 
    title: '备注', 
    dataIndex: 'notes', 
    key: 'notes',
    ellipsis: true
  },
  { 
    title: '创建时间', 
    dataIndex: 'created_at', 
    key: 'created_at',
    render: (date: string) => new Date(date).toLocaleDateString()
  },
];