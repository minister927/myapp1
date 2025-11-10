// src/app/admin/dashboard/materialmanage/bom-detail/QueryBar.tsx
'use client';

import { useState } from 'react';
import { Input, Button, Space, Select } from 'antd';
const { Search } = Input;

interface QueryParams {
  detail_id?: string;
  bom_id?: string;
  component_material_id?: string;
  parent_material_id?: string;
  is_critical?: string;
  notes?: string;
}

export default function QueryBar({ onSearch }: { onSearch: (q: QueryParams) => void }) {
  const [query, setQuery] = useState<QueryParams>({});
  const [expand, setExpand] = useState(false);

  const handleChange = (name: keyof QueryParams, value: string) => {
    setQuery(prev => ({ ...prev, [name]: value || undefined }));
  };

  const handleSearch = () => onSearch(query);

  const handleReset = () => {
    setQuery({});
    onSearch({});
  };

  return (
    <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
      <Space>
        <Search
          placeholder="搜索备注内容"
          style={{ width: 260 }}
          value={query.notes || ''}
          onChange={e => handleChange('notes', e.target.value)}
          onSearch={handleSearch}
          enterButton
        />
        <Button onClick={() => setExpand(v => !v)}>
          {expand ? '收起' : '多条件'}
        </Button>
        <Button onClick={handleReset}>重置</Button>
      </Space>

      {expand && (
        <Space wrap>
          <Input
            placeholder="明细ID"
            value={query.detail_id || ''}
            onChange={e => handleChange('detail_id', e.target.value)}
            style={{ width: 120 }}
          />
          <Input
            placeholder="BOM ID"
            value={query.bom_id || ''}
            onChange={e => handleChange('bom_id', e.target.value)}
            style={{ width: 120 }}
          />
          <Input
            placeholder="子项组件ID"
            value={query.component_material_id || ''}
            onChange={e => handleChange('component_material_id', e.target.value)}
            style={{ width: 140 }}
          />
          <Input
            placeholder="父项物料ID"
            value={query.parent_material_id || ''}
            onChange={e => handleChange('parent_material_id', e.target.value)}
            style={{ width: 140 }}
          />
          <Select
            value={query.is_critical}
            onChange={v => handleChange('is_critical', v)}
            style={{ width: 120 }}
            allowClear
            placeholder="是否关键"
          >
            <Select.Option value="1">是</Select.Option>
            <Select.Option value="0">否</Select.Option>
          </Select>
        </Space>
      )}
    </Space>
  );
}