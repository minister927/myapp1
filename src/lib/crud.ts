// lib/crud.ts
export type FieldType = 'input' | 'number' | 'select' | 'date' | 'textarea';

export interface FieldMeta {
  key: string;          // 对应数据库字段
  label: string;        // 表单标签
  type: FieldType;
  rules?: any[];        // Form.Item rules
  options?: { label: string; value: string | number }[]; // select 用
  initialValue?: any;
  width?: number;       // 表格列宽
  render?: (v: any, record?: any) => React.ReactNode;   // 表格自定义渲染
}

export interface CrudProps {
  apiPath: string;      // 接口前缀 如 /api/customers
  fields: FieldMeta[];  // 字段元数据
  primaryKey: string;   // 主键字段名
  // onRefresh: () => void;// 操作完成后刷新列表
}