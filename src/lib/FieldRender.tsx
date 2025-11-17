'use client';
import React from 'react';
import { Input, InputNumber, Select } from 'antd';
const { TextArea } = Input;

type FieldDef = {
  key: string;
  type?: 'input' | 'textarea' | 'number' | 'select';
  props?: Record<string, any>;
  options?: { label: string; value: any }[];
};

export function FieldRender({ field, value, onChange }: { field: FieldDef; value?: any; onChange?: (v: any) => void }) {
  const common = { ...(field.props || {}) };

  switch (field.type) {
    case 'number':
      // InputNumber 的 onChange 已经直接返回数值
      return <InputNumber {...common} value={value} onChange={onChange} style={{ width: '100%' }} />;
    case 'textarea':
      return <TextArea {...common} value={value} onChange={(e) => onChange?.(e.target.value)} />;
    case 'select':
      return (
        <Select {...common} value={value} onChange={onChange} options={field.options} />
      );
    case 'input':
    default:
      return <Input {...common} value={value} onChange={(e) => onChange?.(e.target.value)} />;
  }
}

export default FieldRender;