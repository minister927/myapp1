// src/features/bom/bomFields.ts
import type { Field } from '@/components/SchemaForm/types';

export const BOM_FIELDS: Field[] = [
  { key: 'bom_code', label: 'BOM编码', widget: 'input' },
  { key: 'bom_name', label: 'BOM名称', widget: 'input' },
  { key: 'product_id', label: '成品物料ID', widget: 'number' },
  { key: 'bom_version', label: '版本', widget: 'input', initialValue: '1.0' },
  {
    key: 'bom_type',
    label: '类型',
    widget: 'select',
    initialValue: 'EBOM',
    options: [
      { label: 'EBOM', value: 'EBOM' },
      { label: 'PBOM', value: 'PBOM' },
      { label: 'MBOM', value: 'MBOM' },
    ],
  },
  {
    key: 'bom_status',
    label: '状态',
    widget: 'select',
    initialValue: 'Develop',
    options: [
      { label: '编制中', value: 'Develop' },
      { label: '已发布', value: 'Released' },
      { label: '已废弃', value: 'Obsolete' },
    ],
  },
  { key: 'effective_date', label: '生效日期', widget: 'date' },
  { key: 'expiration_date', label: '失效日期', widget: 'date' },
  { key: 'creator', label: '创建人', widget: 'input', initialValue: 'System' },
];