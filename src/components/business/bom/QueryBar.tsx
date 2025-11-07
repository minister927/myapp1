'use client';

import { useState } from 'react';
import { Input, Button, Space, Select } from 'antd';
const { Search } = Input;

type Query = {
  bom_id?: string;
  bom_name?: string;
  bom_version?: string;
  bom_type?: string;
  bom_status?: string;
};

export default function QueryBar({ onSearch }: { onSearch: (q: Query) => void }) {
  const [query, setQuery] = useState<Query>({});
  const [expand, setExpand] = useState(false); // 是否展开更多条件

  /* 统一变更 */
  const handleChange = (name: string, value: string) => {
    setQuery(prev => ({ ...prev, [name]: value || undefined }));
  };

  /* 回车或点击搜索 */
  const handleSearch = () => onSearch(query);

  /* 重置 */
  const handleReset = () => {
    setQuery({});
    onSearch({});
  };

  return (
    <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
      {/* 第一行：主搜索 + 展开/收起 */}
      <Space>
        <Search
          placeholder="搜索 BOM 编码/名称"
          style={{ width: 260 }}
          value={query.bom_name || ''}
          onChange={e => handleChange('bom_name', e.target.value)}
          onSearch={handleSearch}
          enterButton
        />
        <Button onClick={() => setExpand(v => !v)}>{expand ? '收起' : '多条件查询'}</Button>
        <Button onClick={handleReset}>重置</Button>
      </Space>

      {/* 第二行：更多条件（可选展开） */}
      {expand && (
        <Space wrap>
          <Input
            placeholder="BOM 编号"
            value={query.bom_id || ''}
            onChange={e => handleChange('bom_id', e.target.value)}
            style={{ width: 160 }}
          />
          <Input
            placeholder="版本"
            value={query.bom_version || ''}
            onChange={e => handleChange('bom_version', e.target.value)}
            style={{ width: 120 }}
          />
          <Select
            value={query.bom_type || ''}
            onChange={v => handleChange('bom_type', v)}
            style={{ width: 120 }}
            allowClear
            placeholder="全部类型"
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
          >
            <Select.Option value="Develop">编制中</Select.Option>
            <Select.Option value="Released">已发布</Select.Option>
            <Select.Option value="Obsolete">已废弃</Select.Option>
          </Select>
        </Space>
      )}
    </Space>
  );
}