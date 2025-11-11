// QueryBar.tsx
'use client';

import { useState, useEffect } from 'react';
import { Input, Button, Space, Select } from 'antd';
const { Search } = Input;

type Query = {
  // depth 1 (bom_head)
  bom_id?: string;
  bom_name?: string;
  bom_version?: string;
  bom_type?: string;
  bom_status?: string;
  
  // depth 2 (bom_detail)
  notes?: string;
  parent_material_id?: string;
  component_material_id?: string;
  
  // depth 3 (material)
  material_code?: string;
  material_name?: string;
  material_type?: string;
  unit?: string;
};

interface QueryBarProps {
  depth: number;
  onSearch: (q: Query) => void;
}

export default function QueryBar({ depth, onSearch }: QueryBarProps) {
  const [query, setQuery] = useState<Query>({});
  const [expand, setExpand] = useState(false);

  // // 当 depth 变化时重置查询
  // useEffect(() => {
  //   setQuery({});
  //   onSearch({});
  // }, [depth]);

  const handleChange = (name: string, value: string) => {
    setQuery(prev => ({ ...prev, [name]: value || undefined }));
  };

  const handleSearch = () => onSearch(query);
  
  const handleReset = () => {
    setQuery({});
    onSearch({});
  };

  // 根据 depth 获取搜索占位符
  const getSearchPlaceholder = () => {
    switch(depth) {
      case 1: return '搜索 BOM 编码/名称';
      case 2: return '搜索物料/备注';
      case 3: return '搜索物料编码/名称';
      default: return '搜索';
    }
  };

  // 根据 depth 获取主搜索字段名,引号内关键字不可加多余空格
  const getMainSearchField = () => {
    switch(depth) {
      case 1: return 'bom_name';
      case 2: return 'notes';
      case 3: return 'material_name';
      default: return 'bom_name';
    }
  };

  const mainFieldValue = query[getMainSearchField() as keyof Query] || '';

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {/* 主搜索区域 */}
      <Space>
        <Search
          placeholder={getSearchPlaceholder()}
          style={{ width: 260 }}
          value={mainFieldValue as string}
          onChange={e => handleChange(getMainSearchField(), e.target.value)}
          onSearch={handleSearch}
          enterButton
          size="small"
        />
        <Button size="small" onClick={() => setExpand(v => !v)}>
          {expand ? '收起' : '多条件'}
        </Button>
        <Button size="small" onClick={handleReset}>重置</Button>
      </Space>

      {/* 扩展搜索条件 */}
      {expand && (
        <Space wrap>
          {/* BOM Head 查询字段 (depth === 1) */}
          {depth === 1 && (
            <>
              <Input
                placeholder="BOM 编号"
                value={query.bom_id || ''}
                onChange={e => handleChange('bom_id', e.target.value)}
                style={{ width: 160 }}
                size="small"
              />
              <Input
                placeholder="版本"
                value={query.bom_version || ''}
                onChange={e => handleChange('bom_version', e.target.value)}
                style={{ width: 120 }}
                size="small"
              />
              <Select
                value={query.bom_type || ''}
                onChange={v => handleChange('bom_type', v)}
                style={{ width: 120 }}
                allowClear
                placeholder="全部类型"
                size="small"
              >
                <Select.Option value="EBOM">EBOM</Select.Option>
                <Select.Option value="PBOM">PBOM</Select.Option>
                <Select.Option value="MBOM">MBOM</Select.Option>
              </Select>
              <Select
                value={query.bom_status || ''}
                onChange={v => handleChange('bom_status', v)}
                style={{ width: 120 }}
                allowClear
                placeholder="全部状态"
                size="small"
              >
                <Select.Option value="Develop">编制中</Select.Option>
                <Select.Option value="Released">已发布</Select.Option>
                <Select.Option value="Obsolete">已废弃</Select.Option>
              </Select>
            </>
          )}
          
          {/* BOM Detail 查询字段 (depth === 2) */}
          {depth === 2 && (
            <>
              <Input
                placeholder="父项物料ID"
                value={query.parent_material_id || ''}
                onChange={e => handleChange('parent_material_id', e.target.value)}
                style={{ width: 160 }}
                size="small"
              />
              <Input
                placeholder="子项物料ID"
                value={query.component_material_id || ''}
                onChange={e => handleChange('component_material_id', e.target.value)}
                style={{ width: 160 }}
                size="small"
              />
            </>
          )}
          
          {/* Material 查询字段 (depth === 3) */}
          {depth === 3 && (
            <>
              <Input
                placeholder="物料编码"
                value={query.material_code || ''}
                onChange={e => handleChange('material_code', e.target.value)}
                style={{ width: 160 }}
                size="small"
              />
              <Input
                placeholder="物料名称"
                value={query.material_name || ''}
                onChange={e => handleChange('material_name', e.target.value)}
                style={{ width: 160 }}
                size="small"
              />
              <Select
                value={query.material_type || ''}
                onChange={v => handleChange('material_type', v)}
                style={{ width: 120 }}
                allowClear
                placeholder="全部类型"
                size="small"
              >
                <Select.Option value="成品">成品</Select.Option>
                <Select.Option value="半成品">半成品</Select.Option>
                <Select.Option value="原材料">原材料</Select.Option>
                <Select.Option value="组件">组件</Select.Option>
                <Select.Option value="辅料">辅料</Select.Option>
              </Select>
              <Input
                placeholder="单位"
                value={query.unit || ''}
                onChange={e => handleChange('unit', e.target.value)}
                style={{ width: 100 }}
                size="small"
              />
            </>
          )}
        </Space>
      )}
    </Space>
  );
}