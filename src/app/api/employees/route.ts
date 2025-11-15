import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

/* ====== GET /api/employees  列表 + 模糊查询 ====== */
/* ====== GET /api/employees  列表 + 模糊查询 ====== */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  console.log('🔍 employees 原始 URL:', req.url);
  console.log('🔍 employees searchParams 条目:', Array.from(sp.entries()));

  /* ---------- 1. 提取所有查询参数（仅数据库真实字段） ---------- */
  const employeeId = sp.get('employee_id');
  const empNumber  = sp.get('employee_number');
  const name       = sp.get('name');
  const department = sp.get('department');
  const position   = sp.get('position');
  const hireDate   = sp.get('hire_date');      // 精确日期
  const isActive   = sp.get('is_active');      // 1|0
  // const createdAt  = sp.get('created_at');     // 精确时间
  // const updatedAt  = sp.get('updated_at');     // 精确时间

  /* ---------- 2. 动态 WHERE ---------- */
  const cond: string[] = [];
  const vals: any[] = [];

  /* 精确匹配 */
  if (employeeId) { cond.push('employee_id = ?'); vals.push(Number(employeeId)); }
  if (hireDate)   { cond.push('hire_date = ?');   vals.push(hireDate); }
  // if (createdAt)  { cond.push('created_at = ?');  vals.push(createdAt); }
  // if (updatedAt)  { cond.push('updated_at = ?');  vals.push(updatedAt); }
  if (isActive !== null && isActive !== '') {
    cond.push('is_active = ?');
    vals.push(Number(isActive));
  }

  /* 模糊匹配 */
  if (empNumber)  { cond.push('employee_number LIKE ?'); vals.push(`%${empNumber}%`); }
  if (name)       { cond.push('name LIKE ?');            vals.push(`%${name}%`); }
  if (department) { cond.push('department LIKE ?');      vals.push(`%${department}%`); }
  if (position)   { cond.push('position LIKE ?');        vals.push(`%${position}%`); }

  const where = cond.length ? `WHERE ${cond.join(' AND ')}` : '';
  const sql = `
    SELECT employee_id, employee_number, name, department, position,
           hire_date, is_active, created_at, updated_at
    FROM employees
    ${where}
    ORDER BY employee_id DESC
  `;

  /* ---------- 3. 执行 & 日志 ---------- */
  try {
    const [rows] = await pool.query(sql, vals);
    console.log('✅ employees 查询成功，记录数:', Array.isArray(rows) ? rows.length : 0);
    console.log('🔍 SQL:', sql);
    console.log('🔍 绑定值:', vals);
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('❌ employees 查询失败:', error);
    return NextResponse.json({ error: '查询失败', details: error.message }, { status: 500 });
  }
}

/* ====== POST /api/employees  新增 ====== */
export async function POST(req: Request) {
  const body = await req.json();
  const sql = `
    INSERT INTO employees
      (employee_number, name, department, position, hire_date, is_active)
    VALUES (?,?,?,?,?,?)
  `;
  const vals = [
    body.employee_number,
    body.name,
    body.department || null,
    body.position || null,
    body.hire_date || null,
    body.is_active ?? 1,
  ];
  await pool.execute(sql, vals);
  return NextResponse.json({ ok: true });
}

/* ====== PATCH /api/employees  部分更新 ====== */
//“大对象、弱网络、只改一点点 → PATCH；完整替换、重置、快照 → PUT。”
export async function PATCH(req: Request) {
  const body = await req.json();
  const { employee_id, ...fields } = body;
  if (!employee_id) throw new Error('employee_id 必填');

  const ALLOW: Record<string, boolean> = {
    employee_number: true,
    name: true,
    department: true,
    position: true,
    hire_date: true,
    is_active: true,
  };

  const sets: string[] = [];
  const vals: any[] = [];
  Object.entries(fields).forEach(([k, v]) => {
    if (ALLOW[k]) {
      sets.push(`${k} = ?`);
      vals.push(v === undefined ? null : v);
    }
  });

  if (sets.length === 0) return NextResponse.json({ ok: false, message: '无有效字段' }, { status: 400 });

  const sql = `UPDATE employees SET ${sets.join(', ')} WHERE employee_id = ?`;
  vals.push(employee_id);
  await pool.execute(sql, vals);
  return NextResponse.json({ ok: true });
}

/* ====== DELETE /api/employees  删除 ====== */
export async function DELETE(req: Request) {
  const body = await req.json();
  await pool.execute('DELETE FROM employees WHERE employee_id = ?', [body.employee_id]);
  return NextResponse.json({ ok: true });
}