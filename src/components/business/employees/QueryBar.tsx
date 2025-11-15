// src/app/admin/dashboard/materialmanage/bom-detail/QueryBar.tsx
'use client';

import { useState } from 'react';
import { Input, Button, Space, Select } from 'antd';
const { Search } = Input;

/* ========== ① 接口参数改为 employees 真实字段 ========== */
interface QueryParams {
  employee_id?: string;
  employee_number?: string;
  name?: string;
  department?: string;
  position?: string;
  hire_date?: string;
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
        {/* 主搜索：姓名支持模糊 */}
        <Search
          placeholder="搜索员工姓名"
          style={{ width: 260 }}
          value={query.name || ''}
          onChange={e => handleChange('name', e.target.value)}
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
            placeholder="员工ID"
            value={query.employee_id || ''}
            onChange={e => handleChange('employee_id', e.target.value)}
            style={{ width: 120 }}
          />
          <Input
            placeholder="员工工号"
            value={query.employee_number || ''}
            onChange={e => handleChange('employee_number', e.target.value)}
            style={{ width: 140 }}
          />
          <Input
            placeholder="所属部门"
            value={query.department || ''}
            onChange={e => handleChange('department', e.target.value)}
            style={{ width: 120 }}
          />
          <Input
            placeholder="职位"
            value={query.position || ''}
            onChange={e => handleChange('position', e.target.value)}
            style={{ width: 120 }}
          />
          <Input
            placeholder="入职日期"
            value={query.hire_date || ''}
            onChange={e => handleChange('hire_date', e.target.value)}
            style={{ width: 140 }}
            type="date"
          />
          <Select
            value={query.is_active}
            onChange={v => handleChange('is_active', v)}
            style={{ width: 120 }}
            allowClear
            placeholder="在职状态"
          >
            <Select.Option value="1">在职</Select.Option>
            <Select.Option value="0">离职</Select.Option>
          </Select>
        </Space>
      )}
    </Space>
  );
}