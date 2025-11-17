// src/app/admin/dashboard/materialmanage/bom-detail/QueryBar.tsx
'use client';

import { useState } from 'react';
import { Input, Button, Space, Select } from 'antd';
const { Search } = Input;

/* ========== ① 接口参数改为 customers 真实字段 ========== */
interface QueryParams {
  customer_id?: string;
  customer_code?: string;
  customer_name?: string;
  contact_person?: string;
  phone?: string;
  credit_rating?: string;
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
        {/* 主搜索：客户名称支持模糊 */}
        <Search
          placeholder="搜索客户名称"
          style={{ width: 260 }}
          value={query.customer_name || ''}
          onChange={e => handleChange('customer_name', e.target.value)}
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
            placeholder="客户ID"
            value={query.customer_id || ''}
            onChange={e => handleChange('customer_id', e.target.value)}
            style={{ width: 120 }}
          />
          <Input
            placeholder="客户编码"
            value={query.customer_code || ''}
            onChange={e => handleChange('customer_code', e.target.value)}
            style={{ width: 140 }}
          />
          <Input
            placeholder="联系人"
            value={query.contact_person || ''}
            onChange={e => handleChange('contact_person', e.target.value)}
            style={{ width: 120 }}
          />
          <Input
            placeholder="联系电话"
            value={query.phone || ''}
            onChange={e => handleChange('phone', e.target.value)}
            style={{ width: 140 }}
          />
          <Select
            value={query.credit_rating}
            onChange={v => handleChange('credit_rating', v)}
            style={{ width: 120 }}
            allowClear
            placeholder="信用等级"
          >
            <Select.Option value="A">A级-优质</Select.Option>
            <Select.Option value="B">B级-良好</Select.Option>
            <Select.Option value="C">C级-一般</Select.Option>
            <Select.Option value="D">D级-风险</Select.Option>
          </Select>
          <Select
            value={query.is_active}
            onChange={v => handleChange('is_active', v)}
            style={{ width: 120 }}
            allowClear
            placeholder="有效状态"
          >
            <Select.Option value="1">有效</Select.Option>
            <Select.Option value="0">无效</Select.Option>
          </Select>
        </Space>
      )}
    </Space>
  );
}