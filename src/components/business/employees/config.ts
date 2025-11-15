// src/app/admin/dashboard/employees/config.ts
export const API_PATH = '/api/employees';

/* ============= 部门中文映射（可选） ============= */
const deptMap = {
  'HR': '人事部',
  'RD': '研发部',
  'FIN': '财务部',
  'OPS': '运营部',
  'MKT': '市场部',
} as const;
type DeptKey = keyof typeof deptMap;

/* ============= 在职状态颜色 ============= */
const activeMap = { 1: '✅ 在职', 0: '❌ 离职' } as const;

/* ============= 员工表列配置 ============= */
export const columns = [
  { title: '员工ID', dataIndex: 'employee_id', key: 'employee_id', width: 80 },
  { title: '工号', dataIndex: 'employee_number', key: 'employee_number' },
  { title: '姓名', dataIndex: 'name', key: 'name', ellipsis: true },
  { 
    title: '部门', 
    dataIndex: 'department', 
    key: 'department',
    render: (dept: string) => deptMap[dept as DeptKey] || dept//如果没有映射则显示原值
  },
  { title: '职位', dataIndex: 'position', key: 'position', ellipsis: true },
  { 
    title: '入职日期', 
    dataIndex: 'hire_date', 
    key: 'hire_date',
    render: (d: string) => d ? new Date(d).toLocaleDateString() : '-'
  },
  { 
    title: '状态', 
    dataIndex: 'is_active', 
    key: 'is_active',
    render: (active: number) => activeMap[active as keyof typeof activeMap] || '⚪ 未知'
  },
  // { 
  //   title: '创建时间', 
  //   dataIndex: 'created_at', 
  //   key: 'created_at',
  //   render: (date: string) => new Date(date).toLocaleString()
  // },
  // //暂时无需使用
];