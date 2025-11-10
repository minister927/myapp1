// ...existing code...
'use client';
import React, { useMemo } from 'react';
import { useEffect, useState } from 'react';
import { Row, Col, Card, Tree, Table, Button, Modal, Form, Input, InputNumber, Popconfirm, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
const { TextArea } = Input;
import QueryBar from '@/components/business/material/QueryBar';

/* ---------------- 类型 ---------------- */
type SeriesNode = {
  title: string;
  key: string;
  isLeaf?: boolean;
  children?: SeriesNode[];
};

/* ---------------- 主组件 ---------------- */
export default function BomTreePage() {
  /* ===== 状态 ===== */
  const [treeData, setTreeData] = useState<SeriesNode[]>([]);
  const [selectedKey, setSelectedKey] = useState<React.Key>('');
  const [tableTitle, setTableTitle] = useState('');
  const [tableData, setTableData] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState<'add'|'edit'|null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [form] = Form.useForm();

  /* ===== 工具函数 ===== */
  const updateTreeData = (list: SeriesNode[], key: React.Key, children: SeriesNode[]): SeriesNode[] =>
    list.map(node =>
      node.key === key ? { ...node, children } : node.children ? { ...node, children: updateTreeData(node.children, key, children) } : node
    );


    // 用 useMemo 替代普通常量，确保 selectedKey 变化时自动重新计算
  const depth = useMemo(() => String(selectedKey).split('-').length, [selectedKey]);
  const bomId = useMemo(() => String(selectedKey).split('-')[0], [selectedKey]);
  const detailId = useMemo(() => String(selectedKey).split('-')[1], [selectedKey]);

  const getRestPrefix = (d: number) => (d === 1 ? '/api/bom_head' : d === 2 ? '/api/bom_detail' : '/api/material');

  /* ===== 初次加载树 ===== */
  useEffect(() => {
    fetch('/api/bom_head')
      .then(r => r.json())
      .then(res => {
        const list = res.data || res;
        setTreeData(
          list.map((item: any) => ({
            title: item.bom_name,
            key: String(item.bom_id),
            isLeaf: false,
          }))
        );
      })
      .catch(() => message.error('加载顶层 BOM 失败'));
  }, []);

  /* ===== 树异步加载 ===== */
  const onLoadData = ({ key, children }: any) =>
    new Promise<void>(async resolve => {
         if (children) { resolve(); return; }
      const d = String(key).split('-').length;
      const bid = String(key).split('-')[0];
      let nodes: SeriesNode[] = [];
      try {
        console.log('当前树加载节点数据，key:', key, '深度:', d);
        if (d === 1) {
          const res = await fetch(`/api/bom_detail/${bid}`).then(r => r.json());
          const list = res.data || res;
          nodes = list.map((it: any) => ({
            title: `${it.notes || '无备注'} (${it.quantity})`,
            key: `${key}-${it.detail_id}`,
            isLeaf: false,
          }));
        } else if (d === 2) {
          const [, did] = String(key).split('-');
          const res1 = await fetch(`/api/bom_detail/item/${did}`).then(r => r.json());
          const detail = (res1.data || res1)[0];
          const mid = detail.component_material_id;
          const res2 = await fetch(`/api/material/${mid}`).then(r => r.json());
          const list = res2.data || res2;
          nodes = list.map((it: any) => ({
            title: it.material_name,
            key: `${key}-${it.material_id}`,
            isLeaf: true,
          }));
          if (nodes.length === 0) nodes = [{ title: '─ 无子阶 ─', key: `${key}-empty`, isLeaf: true }];
        }
      } catch (e) {
        message.error('加载失败');
      }
      setTreeData(origin => updateTreeData(origin, key, nodes));
      resolve();
    });

  /* ===== 点击树节点 → 刷新右表 ===== */
  const onTreeSelect = (keys: React.Key[], ) => {
    const key = keys[0];
    if (!key) return;
    setSelectedKey(key);
    reloadTableByKey(key);
  };

  const reloadTableByKey = async (key: string) => {
    setLoading(true);
    const d = String(key).split('-').length;
    const bid = String(key).split('-')[0];
    const [, did] = String(key).split('-');
    let url = '';
    let cols: any[] = [];
    let title = '';
    try {
      if (d === 1) {
        url = `/api/bom_head/${bid}`;
        cols = [
          { title: 'BOM编号', dataIndex: 'bom_id' },
          { title: 'BOM名称', dataIndex: 'bom_name' },
          { title: '关联的成品物料ID', dataIndex: 'product_id' },
          { title: '操作', key: 'op', width: 160, render: (_, r) => <OpButtons record={r} nodeKey={key} /> },
        ];
        title = 'BOM 头';
      } else if (d === 2) {
        url = `/api/bom_detail/item/${did}`;
        cols = [
          { title: '物料', dataIndex: 'notes' },
          { title: '关联的BOM ID（外键）', dataIndex: 'bom_id' },
          { title: '父项物料ID（外键）', dataIndex: 'parent_material_id' },
          { title: '子项（组件）物料ID（外键）', dataIndex: 'component_material_id' },
          { title: '用量', dataIndex: 'quantity' },
          { title: '损耗率%', dataIndex: 'loss_rate' },
          { title: '操作', key: 'op', width: 160, render: (_, r) => <OpButtons record={r} nodeKey={key} /> },
        ];
        title = 'BOM 明细';
      } else {
        const mid = String(key).split('-').pop();
        url = `/api/material/${mid}`;
        cols = [
          { title: '物料ID', dataIndex: 'material_id' },
          { title: '物料代码', dataIndex: 'material_code' },
          { title: '物料名称', dataIndex: 'material_name' },
          { title: '物料类型', dataIndex: 'material_type' },
          { title: '单位', dataIndex: 'unit' },
          { title: '操作', key: 'op', width: 160, render: (_, r) => <OpButtons record={r} nodeKey={key} /> },
        ];
        title = '物料档案';
      }
      const res = await fetch(url).then(r => r.json());
      const list = res.data || res;
      setTableData(Array.isArray(list) ? list : [list]);
      setColumns(cols);
      setTableTitle(title);
    } catch (e) {
      message.error('加载失败');
    } finally {
      setLoading(false);
    }
  };

  /* ===== 增删改弹窗 ===== */
  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalOpen('add');
  };

  // ✅ 修改：接收 key 参数，像 onLoadData 一样
  const handleEdit = (record: any, key: string) => {
    setEditingRecord(record);
    const d = String(key).split('-').length;
    console.log('当前编辑的记录，key:', key, 'record:', record);
    const vals =
      d === 1
        ? {
            bom_code: record.bom_code ?? record.bomCode,
            bom_name: record.bom_name ?? record.bomName,
            product_id: record.product_id ?? record.productId,
          }
        : d === 2
        ? {
            notes: record.notes,
            bom_id: record.bom_id ?? record.bomId,
            parent_material_id: record.parent_material_id ?? record.parentMaterialId,
            component_material_id: record.component_material_id ?? record.componentMaterialId,
            quantity: record.quantity,
            loss_rate: record.loss_rate ?? record.lossRate,
            referenceDesignator: record.referenceDesignator ?? record.reference_designator,
          }
        : {
            material_code: record.material_code ?? record.materialCode,
            material_name: record.material_name ?? record.materialName,
            material_type: record.material_type ?? record.materialType,
            unit: record.unit,
          };
    form.setFieldsValue(vals);
    setModalOpen('edit');
  };

  const handleSubmit = async (vals: any) => {
    setSubmitting(true);
    try {
      // ✅ 实时计算，避免闭包问题
      const currentKey = String(selectedKey);
      const currentDepth = currentKey.split('-').length;
      const [currentBomId, currentDetailId] = currentKey.split('-');

      const prefix = getRestPrefix(currentDepth);
      const id = editingRecord ? editingRecord.bom_id || editingRecord.detail_id || editingRecord.material_id : '';
      const method = editingRecord ? 'PUT' : 'POST';
      
      let body: any;
      if (currentDepth === 1) {
        body = { 
          bom_id: editingRecord?.bom_id ?? null, 
          bom_code: vals.bom_code, 
          bom_name: vals.bom_name, 
          product_id: vals.product_id 
        };
      } else if (currentDepth === 2) {
        body = {
          ...vals,
          parent_material_id: currentDetailId ?? vals.parent_material_id,
        };
      } else {
        body = { 
          material_id: editingRecord.material_id,
          material_code: vals.material_code, 
          material_name: vals.material_name, 
          material_type: vals.material_type, 
          unit: vals.unit 
        };
      }

      const res = await fetch(prefix, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).then(r => r.json());
      
      if (!res.ok) throw new Error(res.message || '失败');
      message.success('保存成功');
      setModalOpen(null);
      reloadTableByKey(currentKey);

      if (!editingRecord && currentDepth === 1) {
        fetch('/api/bom_head')
          .then(r => r.json())
          .then(res => {
            const list = res.data || res;
            setTreeData(
              list.map((item: any) => ({
                title: item.bom_name,
                key: String(item.bom_id),
                isLeaf: false,
              }))
            );
          })
          .catch(() => message.error('新增后刷新 BOM 树失败'));
      }
    } catch (e: any) {
      message.error(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ 修改：接收 key 参数
  const handleDelete = async (record: any, key: string) => {
    const d = String(key).split('-').length;
    const prefix = getRestPrefix(d);
    const id = record.bom_id || record.detail_id || record.material_id;
    console.log('🗑️ 删除 ID:', id, '当前深度:', d);
    try {
      const res = await fetch(prefix, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      }).then(r => r.json());
      if (!res.ok) throw new Error(res.message || '失败');
      message.success('已删除');
      reloadTableByKey(key);
       /* 若删的是 BOM 头，同步从树移除 */
      if (d === 1 ) {
        setTreeData(origin => origin.filter(n => n.key !== String(id)));
      }else if (d === 2) {
      // 删除第二层（BOM明细）
      const parentKey = String(key).split('-')[0];
      setTreeData(origin => {
        const parent = origin.find(n => n.key === parentKey);
        if (!parent || !parent.children) return origin;
        // 过滤掉要删除的子节点
        const newChildren = parent.children.filter(c => c.key !== key);
        return updateTreeData(origin, parentKey, newChildren);
      });
    }
    // 第三层（物料）只是展示，不需要从树中删除
    } catch (e: any) {
      message.error(e.message);
    }
  };

  // ✅ 修改：从 render 接收 nodeKey 参数
  const OpButtons = ({ record, nodeKey }: { record: any, nodeKey: string }) => (
    <Space>
      <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record, nodeKey)}>
        编辑
      </Button>
      <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record, nodeKey)}>
        <Button type="link" danger size="small" icon={<DeleteOutlined />}>
          删除
        </Button>
      </Popconfirm>
    </Space>
  );


  /* 根据 QueryBar 回传条件拉数据 */
const handleSearch = async (q: Record<string, any>) => {
  if (!depth || depth === 0) {
    message.warning('请先选择一个节点');
    return;
  }

  setLoading(true);
  try {
    /* 只传非空值 */
    const params = new URLSearchParams();
    Object.entries(q).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        params.append(k, String(v));
      }
    });

    /* 根据 depth 选择对应的 API */
    const apiMap: Record<number, string> = {
      1: '/api/bom_head',
      2: '/api/bom_detail',
      3: '/api/material'
    };
    
    const apiUrl = apiMap[depth];
    if (!apiUrl) {
      throw new Error(`不支持当前层级: ${depth}`);
    }

    const url = `${apiUrl}?${params}`;
    console.log('搜索请求:', url, '参数:', q);

    const res = await fetch(url);
    const json = await res.json();
    
    if (!res.ok) {
      throw new Error(json.message || '搜索失败');
    }

    const list = json.data || json;
    const data = Array.isArray(list) ? list : [list];
    
    setTableData(data);
    message.success(`查询到 ${data.length} 条结果`);
  } catch (e: any) {
    console.error('搜索失败:', e);
    message.error(`搜索失败: ${e.message}`);
    setTableData([]); // 失败时清空表格
  } finally {
    setLoading(false);
  }
};

  /* ===== 渲染 ===== */
  return (
    <Row gutter={16} style={{ height: 'calc(100vh - 200px)' }}>
      <Col span={6}>
        <Card title="BOM 列表" size="small" style={{ height: '100%', overflow: 'auto' }}>
          <Tree loadData={onLoadData} treeData={treeData} selectedKeys={[selectedKey]} onSelect={onTreeSelect} />
        </Card>
      </Col>
      <Col span={18}>
        <Card
          title={`${tableTitle} ${selectedKey ? `- 节点 ${selectedKey}` : ''}`}
          size="small"
          style={{ height: '100%', overflow: 'auto' }}
          extra={
            <Space> {/* 添加 Space 组件 */}
              <QueryBar  depth={depth} onSearch={handleSearch} />
              <Button type="primary"  icon={<PlusOutlined />} onClick={handleAdd}>
                新增
              </Button>
            </Space>
          }
        >
          <Table
            size="small"
            rowKey={r => r.bom_id || r.detail_id || r.material_id}
            loading={loading}
            columns={columns}
            dataSource={tableData}
            pagination={false}
            scroll={{ y: 'calc(100vh - 280px)' }}
          />
        </Card>
      </Col>

      <Modal
        title={modalOpen === 'add' ? '新增' : '编辑'}
        open={modalOpen !== null}
        confirmLoading={submitting}
        onCancel={() => setModalOpen(null)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {depth === 1 && (
            <>
              <Form.Item name="bom_id" noStyle>
                <Input type="hidden" />
              </Form.Item>
              <Form.Item label="BOM编码" name="bom_code" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label="BOM名称" name="bom_name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label="关联的成品物料ID" name="product_id">
                <Input />
              </Form.Item>
            </>
          )}
          {depth === 2 && (
            <>
              <Form.Item name="detail_id" noStyle>
                <Input type="hidden" />
              </Form.Item>
              <Form.Item label="备注/物料" name="notes">
                <Input />
              </Form.Item>
              <Form.Item label="关联的BOM ID（外键）" name="bom_id">
                <Input />
              </Form.Item>
              <Form.Item label="父项物料ID（外键）" name="parent_material_id">
                <Input />
              </Form.Item>
              <Form.Item label="子项（组件）物料ID（外键）" name="component_material_id">
                <Input />
              </Form.Item>
              <Form.Item label="用量" name="quantity" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item label="损耗率%" name="loss_rate">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </>
          )}
          {depth === 3 && (
            <>
              <Form.Item name="material_id" noStyle>
                <Input type="hidden" />
              </Form.Item>
              <Form.Item label="物料编码" name="material_code" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label="物料名称" name="material_name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label="物料类型（成品、半成品、原材料、组件、辅料）" name="material_type" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label="单位" name="unit">
                <Input />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </Row>
  );
}