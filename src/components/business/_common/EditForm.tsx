// src/components/SchemaForm/index.tsx
'use client';
import { Input, Select } from 'antd';
const { Option } = Select;
import type { Field } from './types';

interface P {
  fields: Field[];
}

export default function SchemaForm({ fields }: P) {
  return (
    <>
      {fields.map((f) => (
        <Form.Item
          key={f.key}
          label={f.label}
          name={f.key}
          rules={f.rules || [{ required: true }]}
          initialValue={f.initialValue}
        >
          {f.widget === 'input' && <Input />}
          {f.widget === 'number' && <Input type="number" />}
          {f.widget === 'date' && <Input type="date" />}
          {f.widget === 'select' && (
            <Select>
              {f.options?.map((o) => (
                <Option key={o.value} value={o.value}>{o.label}</Option>
              ))}
            </Select>
          )}
        </Form.Item>
      ))}
    </>
  );
}