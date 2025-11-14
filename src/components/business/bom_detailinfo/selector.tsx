// src/components/select.tsx
//逻辑有误，但能用，父子选择都应该从material接口获取数据
'use client';

import { Select } from 'antd';
import { useEffect, useState } from 'react';

type Option = { label: string; value: string | number };

/* ========== 父项物料 ========== */
export function ParentMaterialSelect({ value, onChange }: { value?: number; onChange?: (v: number) => void }) {
  const [opts, setOpts] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    fetch('/api/material',{
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
      .then(r => r.json())
      .then(list =>
        setOpts(
          list.map((it: any) => ({
            label: `${it.material_id} - ${it.material_name}`,
            value: it.material_id, 
          }))
        )
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <Select
      showSearch
      placeholder="请选择父项物料"
      optionFilterProp="label"
      style={{ width: 200 }}
      value={value}
      onChange={onChange}
      loading={loading}
      options={opts}
    />
  );
}

/* ========== 子项组件 ========== */
export function ConponentMaterialSelect({ value, onChange }: { value?: string; onChange?: (v: string) => void }) {
  const [opts, setOpts] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/material',{
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
      .then(r => r.json())
      .then(list =>
        setOpts(
          list.map((it: any) => ({
            label: `${it.material_id} - ${it.material_name}`,
            value: it.material_id, 
          }))
        )
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <Select
      showSearch
      placeholder="请选择子项组件"
      optionFilterProp="label"
      style={{ width: 200 }}
      value={value}
      onChange={onChange}
      loading={loading}
      options={opts}
    />
  );
}