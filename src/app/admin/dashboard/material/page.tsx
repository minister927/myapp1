// ...existing code...
'use client';

import { useEffect, useState } from 'react';
import { Row, Col, Card, Tree, Table, Button, Modal, Form, Input, InputNumber, Popconfirm, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
const { TextArea } = Input;

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

  const depth = String(selectedKey).split('-').length;
  const bomId = String(selectedKey).split('-')[0];
  const detailId = String(selectedKey).split('-')[1];

  const getRestPrefix = (d: number) => (d === 1 ? '/api/bom_head' : d === 2 ? '/api/bom_detail' : '/api/material');//根据深度获取对应的REST API前根

  /* ===== 初次加载树 ===== */
  useEffect(() => {
    fetch('/api/bom_head')
      .then(r => r.json())
      .then(res => {
        const list = res.data || res; /* 兼容不同后端写法 */
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
  const onTreeSelect = (keys: React.Key[]) => {
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
          { title: '操作', key: 'op', width: 160, render: (_, r) => <OpButtons record={r} /> },
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
          { title: '操作', key: 'op', width: 160, render: (_, r) => <OpButtons record={r} /> },
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
          { title: '操作', key: 'op', width: 160, render: (_, r) => <OpButtons record={r} /> },
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

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    const d = depth;
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
      const prefix = getRestPrefix(depth);
      const id = editingRecord ? editingRecord.bom_id || editingRecord.detail_id || editingRecord.material_id : '';
      const method = editingRecord ? 'PUT' : 'POST';
      let body: any;
      if (depth === 1) {
        body = { bom_id: editingRecord.bom_id, bom_code: vals.bom_code, bom_name: vals.bom_name, product_id: vals.product_id };
      } else if (depth === 2) {
        // 新增/修改 BOM 明细，确保 parent_material_id 使用当前选中 detailId（如适用）
        body = {
          ...vals,
          parent_material_id: detailId ?? vals.parent_material_id,
        };
      } else {
        body = { material_id: editingRecord.material_id,material_code: vals.material_code, material_name: vals.material_name, material_type: vals.material_type, unit: vals.unit };
      }

      console.log("修改所需提交的body：",body);

      // const res = await fetch(`${prefix}${editingRecord ? `/${id}` : ''}`, {
      const res = await fetch(prefix, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).then(r => r.json());
      if (!res.ok) throw new Error(res.message || '失败');
      message.success('保存成功');
      setModalOpen(null);
      reloadTableByKey(String(selectedKey));
      /* 若是新增 BOM 头，同步插入树节点 */
      if (!editingRecord && depth === 1) {
        setTreeData(origin => [...origin, { title: vals.bom_name, key: String(res.data.bom_id), isLeaf: false }]);
      } 
    } catch (e: any) {
      message.error(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (record: any) => {
    const prefix = getRestPrefix(depth);
    const id = record.bom_id || record.detail_id || record.material_id;
    console.log('🗑️ 删除 ID:', id);
    try {
      const res = await fetch(prefix, 
        { method: 'DELETE' ,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ record })
         })
        .then(r => r.json());
      if (!res.ok) throw new Error(res.message || '失败');
      message.success('已删除');
      reloadTableByKey(String(selectedKey));
      /* 若删的是 BOM 头，同步从树移除 */
      if (depth === 1) {
        setTreeData(origin => origin.filter(n => n.key !== String(id)));
      }
    } catch (e: any) {
      message.error(e.message);
    }
  };

  const OpButtons = ({ record }: { record: any }) => (
    <Space>
      <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
        编辑
      </Button>
      <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record)}>
        <Button type="link" danger size="small" icon={<DeleteOutlined />}>
          删除
        </Button>
      </Popconfirm>
    </Space>
  );

  /* ===== 渲染 ===== */
  return (
    <Row gutter={16} style={{ height: 'calc(100vh - 200px)' }}>
      <Col span={6}>
        <Card
          title="BOM 列表"
          size="small"
          style={{ height: '100%', overflow: 'auto' }}
        >
          <Tree loadData={onLoadData} treeData={treeData} selectedKeys={[selectedKey]} onSelect={onTreeSelect} />
        </Card>
      </Col>
      <Col span={18}>
        <Card
          title={`${tableTitle} ${selectedKey ? `- 节点 ${selectedKey}` : ''}`}
          size="small"
          style={{ height: '100%', overflow: 'auto' }}
          extra={
            <Button type="primary" size="small" icon={<PlusOutlined />} onClick={handleAdd}>
              新增
            </Button>
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
              <Form.Item label="关联的BOM ID（外键）" name="referenceDesignator">
                <Input />
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