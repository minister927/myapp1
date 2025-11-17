// src/app/admin/dashboard/materialmanage/bom-detail/QueryBar.tsx
'use client';

import { useState } from 'react';
import { Input, Button, Space, Select } from 'antd';
const { Search } = Input;

/* ========== ① 接口参数改为 orders 真实字段 ========== */
interface QueryParams {
  order_id?: string;
  order_number?: string;
  customer_id?: string;
  order_date?: string;
  delivery_date?: string;
  order_status?: string;
  priority?: string;
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
        {/* 主搜索：订单编号模糊 */}
        <Search
          placeholder="搜索订单编号"
          style={{ width: 260 }}
          value={query.order_number || ''}
          onChange={e => handleChange('order_number', e.target.value)}
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
            placeholder="订单ID"
            value={query.order_id || ''}
            onChange={e => handleChange('order_id', e.target.value)}
            style={{ width: 120 }}
          />
          <Input
            placeholder="客户ID"
            value={query.customer_id || ''}
            onChange={e => handleChange('customer_id', e.target.value)}
            style={{ width: 120 }}
          />
          <Input
            placeholder="订单日期"
            value={query.order_date || ''}
            onChange={e => handleChange('order_date', e.target.value)}
            style={{ width: 140 }}
            type="date"
          />
          <Input
            placeholder="交货日期"
            value={query.delivery_date || ''}
            onChange={e => handleChange('delivery_date', e.target.value)}
            style={{ width: 140 }}
            type="date"
          />
          <Select
            value={query.order_status}
            onChange={v => handleChange('order_status', v)}
            style={{ width: 120 }}
            allowClear
            placeholder="订单状态"
          >
            <Select.Option value="Draft">草稿</Select.Option>
            <Select.Option value="Confirmed">已确认</Select.Option>
            <Select.Option value="In Production">生产中</Select.Option>
            <Select.Option value="Shipped">已发货</Select.Option>
            <Select.Option value="Delivered">已交付</Select.Option>
            <Select.Option value="Cancelled">已取消</Select.Option>
          </Select>
          <Select
            value={query.priority}
            onChange={v => handleChange('priority', v)}
            style={{ width: 120 }}
            allowClear
            placeholder="优先级"
          >
            <Select.Option value="Low">低</Select.Option>
            <Select.Option value="Medium">中</Select.Option>
            <Select.Option value="High">高</Select.Option>
            <Select.Option value="Urgent">紧急</Select.Option>
          </Select>
        </Space>
      )}
    </Space>
  );
}