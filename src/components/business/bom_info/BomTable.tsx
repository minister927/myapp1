'use client';

import { Table, message } from 'antd';
import { useEffect, useState } from 'react';
import { API_PATH, columns } from './config';
import AddButton from './AddButton';
import EditButton from './EditButton';
import DeleteButton from './DeleteButton';
import QueryBar from './QueryBar';
import ChangeLog from './ChangeLog';

export default function BomTable() {
  const [data, setData] = useState<any[]>([]);         //定义返回的data数组的类型
  const [loading, setLoading] = useState(true);    //用以判断是否在加载状态的常量
  const [keyword, setKeyword] = useState('');      //搜索栏所用的关键字

  const fetchData = async () => {
    setLoading(true);                    //打开加载动画
    const res = await fetch(API_PATH);   //调用config文件所定义的加载后端的组件
    const list = await res.json();       //解析后端所回应数据


//     // 在前端已经拿到的“全量” bom 列表里，用数组 filter 做内存级模糊搜索
// const filtered = list.filter((it: any) =>           // list 就是后端返回的完整 BOM 数组
// // 把“bom编码”和“bom名称”无脑拼成一条长字符串，中间不加空格
// `${it.bom_code}${it.bom_name}`
//   // 统一转成小写，实现“不区分大小写”的匹配
//   .toLowerCase()
//   // 看这条长字符串里有没有出现用户输入的关键字（同样先转小写）
//   .includes(keyword.toLowerCase())
// );
    // const filtered = list.filter((it: any) =>    //每一次加载数据都要先进行前端keyword的查询，没有keyword则全部显示
    //   `${it.bom_code}${it.bom_name}`.toLowerCase().includes(keyword.toLowerCase())
    // );


    setData(list);           //写入data变量，用以赋值给表格
    setLoading(false);           //关闭加载动画
  };

  useEffect(() => {       //// 组件首次挂载 或 keyword 变化时重新拉数据
    fetchData();          //api内 ‘查’ 的接口决定获取数据，本接口用于获取全部数据
  }, []);




  const actions = {
    title: '操作',
    key: 'action',
    width: 300,
    render: (_: any, record: any) => (
      <>
        {/* record={record} 用以将当前行的数据交与子组件*/}
        <ChangeLog record={record}  onOk={fetchData}/>
        <EditButton record={record} onOk={fetchData} />       
        <DeleteButton record={record} onOk={fetchData} />
      </>
    ),
  };


   /* 根据 QueryBar 回传条件拉数据 */
   const handleSearch = async (q: Record<string, any>) => {
    setLoading(true);
    /* 只传非空值 */
    const params = new URLSearchParams();
    Object.entries(q).forEach(([k, v]) => v && params.append(k, v));

    const res = await fetch(`/api/bom_head?${params}`);
    const list = await res.json();
    setData(Array.isArray(list) ? list : []);
    setLoading(false);
  };


  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <QueryBar onSearch={handleSearch} />
        <AddButton onOk={fetchData} />
      </div>
      <Table
        rowKey="bom_id"                   //主键字段
        loading={loading}                 //判断加载状态
        columns={[...columns, actions]}   //合并静态列和操作列，两个列合成到一个列内
        dataSource={data}                 //赋予数据
        pagination={{ pageSize: 3 }}     //每行15列
      />
    </div>
  );
}