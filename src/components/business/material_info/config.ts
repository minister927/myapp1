// src/app/admin/dashboard/materialmanage/config.ts
export const API_PATH = '/api/material';

// 定义物料类型映射
const typeMap = {
  'Product': '成品',
  'Semi-Finished': '半成品',
  'Raw': '原材料',
  'Component': '组件',
  'Auxiliary': '辅料'
} as const;

type MaterialTypeKey = keyof typeof typeMap;



// material 表列配置
export const columns = [
  { title: '物料ID', dataIndex: 'material_id', key: 'material_id', width: 80 },
  { 
    title: '物料编码', 
    dataIndex: 'material_code', 
    key: 'material_code'
  },
  { 
    title: '物料名称', 
    dataIndex: 'material_name', 
    key: 'material_name',
    ellipsis: true
  },
  { 
    title: '物料类型', 
    dataIndex: 'material_type', 
    key: 'material_type',
    render: (type: string) => {
      // 使用类型断言确保类型安全
      return typeMap[type as MaterialTypeKey] || type;
    }
  },
  { 
    title: '物料规格', 
    dataIndex: 'material_specs', 
    key: 'material_specs',
    ellipsis: true
  },
  { 
    title: '计量单位', 
    dataIndex: 'unit', 
    key: 'unit',
    width: 80
  },
  { 
    title: '单价', 
    dataIndex: 'unit_price', 
    key: 'unit_price',
    render: (price: number) => price ? `¥${Number(price).toFixed(2)}` : '-'
  },
  { 
    title: '默认供应商', 
    dataIndex: 'supplier', 
    key: 'supplier',
    ellipsis: true
  },
  { 
    title: '状态', 
    dataIndex: 'is_active', 
    key: 'is_active',
    render: (isActive: number) => isActive ? '✅ 启用' : '❌ 停用'
  },
  { 
    title: '创建时间', 
    dataIndex: 'created_at', 
    key: 'created_at',
    render: (date: string) => new Date(date).toLocaleString()
  },
];