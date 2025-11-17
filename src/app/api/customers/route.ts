// src/app/api/customers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

/* =================== GET /api/customers 列表 + 模糊查询 =================== */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  /* ---------- 分页 ---------- */
  const page     = Number(sp.get('page') ?? 1);
  const pageSize = Number(sp.get('pageSize') ?? 3);

  /* ---------- 查询参数 ---------- */
  const customerId   = sp.get('customer_id');
  const customerCode = sp.get('customer_code');
  const customerName = sp.get('customer_name');
  const contactPerson= sp.get('contact_person');
  const phone        = sp.get('phone');
  const creditRating = sp.get('credit_rating');
  const isActive     = sp.get('is_active');

  /* ---------- 动态 WHERE ---------- */
  const cond: string[] = [];
  const vals: any[] = [];

  /* 精确匹配 */
  if (customerId)    { cond.push('customer_id = ?');    vals.push(Number(customerId)); }
  if (creditRating)  { cond.push('credit_rating = ?');  vals.push(creditRating); }
  if (isActive !== null && isActive !== '') {
    cond.push('is_active = ?');
    vals.push(Number(isActive));
  }

  /* 模糊匹配 */
  if (customerCode)  { cond.push('customer_code LIKE ?');  vals.push(`%${customerCode}%`); }
  if (customerName)  { cond.push('customer_name LIKE ?');  vals.push(`%${customerName}%`); }
  if (contactPerson) { cond.push('contact_person LIKE ?'); vals.push(`%${contactPerson}%`); }
  if (phone)         { cond.push('phone LIKE ?');          vals.push(`%${phone}%`); }

  const where = cond.length ? `WHERE ${cond.join(' AND ')}` : '';

  /* ---------- 总条数 ---------- */
  const countSql = `SELECT COUNT(*) AS total FROM customers ${where}`;
  const [countRows] = await pool.query(countSql, vals);
  const total = (countRows as any)[0].total;

  /* ---------- 分页数据 ---------- */
  const dataSql = `
    SELECT customer_id, customer_code, customer_name, contact_person, phone, email, address,
           credit_rating, is_active, created_at, updated_at
    FROM customers
    ${where}
    ORDER BY customer_id DESC
    LIMIT ? OFFSET ?
  `;
  try {
    vals.push(pageSize, (page - 1) * pageSize);
    const [rows] = await pool.query(dataSql, vals);
    return NextResponse.json({ rows, total });
  } catch (error: any) {
    return NextResponse.json({ error: '查询失败', details: error.message }, { status: 500 });
  }
}

/* =================== POST /api/customers 新增 =================== */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const sql = `
      INSERT INTO customers
        (customer_code, customer_name, contact_person, phone, email, address, credit_rating, is_active)
      VALUES (?,?,?,?,?,?,?,?)
    `;
    const vals = [
      body.customer_code,
      body.customer_name,
      body.contact_person || null,
      body.phone || null,
      body.email || null,
      body.address || null,
      body.credit_rating || null,
      body.is_active ?? 1,
    ];
    await pool.execute(sql, vals);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('[POST /api/customers]', e);
    return NextResponse.json({ ok: false, message: e.message }, { status: 500 });
  }
}

/* =================== PATCH /api/customers 部分更新 =================== */
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { customer_id, ...fields } = body;
    if (!customer_id) throw new Error('customer_id 必填');

    const ALLOW: Record<string, boolean> = {
      customer_code: true,
      customer_name: true,
      contact_person: true,
      phone: true,
      email: true,
      address: true,
      credit_rating: true,
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

    const sql = `UPDATE customers SET ${sets.join(', ')} WHERE customer_id = ?`;
    vals.push(customer_id);
    await pool.execute(sql, vals);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('[PATCH /api/customers]', e);
    return NextResponse.json({ ok: false, message: e.message }, { status: 500 });
  }
}

/* =================== DELETE /api/customers 删除 =================== */
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    await pool.execute('DELETE FROM customers WHERE customer_id = ?', [body.customer_id]);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('[DELETE /api/customers]', e);
    return NextResponse.json({ ok: false, message: e.message }, { status: 500 });
  }
}