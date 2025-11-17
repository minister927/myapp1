'use client';

import { Table, message } from 'antd';
import { useEffect, useState } from 'react';
import { API_PATH, columns } from './config';
import AddButton from './AddButton';
import EditButton from './EditButton';
import DeleteButton from './DeleteButton';
import QueryBar from './QueryBar';

export default function CustomersTable() {
  const [data, setData] = useState<any[]>([]);         //定义返回的data数组的类型
  const [loading, setLoading] = useState(true);    //用以判断是否在加载状态的常量
  const [total, setTotal] = useState(0);          // ① 总条数
  const [page, setPage] = useState(1);            // ② 当前页
  const [pageSize, setPageSize] = useState(3);    // ③ 每页条数
  const [query, setQuery] = useState<Record<string, any>>({}); // ④ 查询条件


  const fetchData = async (q: Record<string, any> = {}, p = page, ps = pageSize) => {
    setLoading(true);                    //打开加载动画
    const params = new URLSearchParams();
    Object.entries(q).forEach(([k, v]) => v && params.append(k, v));
    params.append('page', String(p));
    params.append('pageSize', String(ps));

    const res = await fetch(`${API_PATH}?${params}`);   //调用config文件所定义的加载后端的组件
    const list = await res.json();       //解析后端所回应数据

    setData(list.rows ?? []);
    setTotal(list.total ?? 0);
    setLoading(false);           //关闭加载动画
  };

  /* ---------- 首次挂载 + 页码变化 ---------- */
  useEffect(() => {
    fetchData(query, page, pageSize);
  }, [page, pageSize]);



  const actions = {
    title: '操作',
    key: 'action',
    width: 300,
    render: (_: any, record: any) => (
      <>
        {/* record={record} 用以将当前行的数据交与子组件*/}
        <EditButton record={record} onOk={() => fetchData(query, page, pageSize)} />       
        <DeleteButton record={record} onOk={() => fetchData(query, page, pageSize)}/>
      </>
    ),
  };


    /* ---------- QueryBar 查询 ---------- */
  const handleSearch = (q: Record<string, any>) => {
    setQuery(q);
    setPage(1);              // 新查询回到第一页,再调用fetchdata方法
    fetchData(q, 1, pageSize);
  };


   /* ---------- 页码/页大小变化 ---------- */
  const handleTableChange = (p: any) => {
    setPage(p.current);
    setPageSize(p.pageSize);
    console.log('页码变化：', p);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <QueryBar onSearch={handleSearch} />
        <AddButton onOk={() => fetchData(query, page, pageSize)}  />
      </div>
      <Table
        rowKey="customer_id"                   //主键字段
        loading={loading}                 //判断加载状态
        columns={[...columns, actions]}   //合并静态列和操作列，两个列合成到一个列内
        dataSource={data}                //赋予数据
         pagination={{
          current: page,//当前页码
          pageSize,//每页条数
          total,// ④ 总条数
          showSizeChanger: true,
          pageSizeOptions: ['3', '5', '10', '15'],
        }}
        onChange={handleTableChange}  // ⑤ 页码变化回调
      />
    </div>
  );
}