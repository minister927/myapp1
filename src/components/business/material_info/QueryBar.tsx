// src/app/admin/dashboard/materialmanage/bom-detail/QueryBar.tsx
'use client';

import { useState } from 'react';
import { Input, Button, Space, Select } from 'antd';
const { Search } = Input;

interface QueryParams {
  material_id?: string;
  material_code?: string;
  material_name?: string;
  material_type?: string;
  unit?: string;
  supplier?: string;
  is_active?: string;
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
          placeholder="搜索物料名称"
          style={{ width: 260 }}
          value={query.material_name || ''}
          onChange={e => handleChange('material_name', e.target.value)}
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
            placeholder="物料ID"
            value={query.material_id || ''}
            onChange={e => handleChange('material_id', e.target.value)}
            style={{ width: 120 }}
          />
          <Input
            placeholder="物料编码"
            value={query.material_code || ''}
            onChange={e => handleChange('material_code', e.target.value)}
            style={{ width: 140 }}
          />
          <Select
            value={query.material_type}
            onChange={v => handleChange('material_type', v)}
            style={{ width: 120 }}
            allowClear
            placeholder="物料类型"
          >
            <Select.Option value="Product">成品</Select.Option>
            <Select.Option value="Semi-Finished">半成品</Select.Option>
            <Select.Option value="Raw">原材料</Select.Option>
            <Select.Option value="Component">组件</Select.Option>
            <Select.Option value="Auxiliary">辅料</Select.Option>
          </Select>
          <Input
            placeholder="计量单位"
            value={query.unit || ''}
            onChange={e => handleChange('unit', e.target.value)}
            style={{ width: 120 }}
          />
          <Input
            placeholder="供应商"
            value={query.supplier || ''}
            onChange={e => handleChange('supplier', e.target.value)}
            style={{ width: 140 }}
          />
          <Select
            value={query.is_active}
            onChange={v => handleChange('is_active', v)}
            style={{ width: 120 }}
            allowClear
            placeholder="状态"
          >
            <Select.Option value="1">启用</Select.Option>
            <Select.Option value="0">停用</Select.Option>
          </Select>
        </Space>
      )}
    </Space>
  );
}