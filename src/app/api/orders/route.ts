// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

/* =================== GET /api/orders 列表 + 模糊查询 =================== */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  /* ---------- 分页 ---------- */
  const page     = Number(sp.get('page')  ?? 1);
  const pageSize = Number(sp.get('pageSize') ?? 3);

  /* ---------- 查询参数 ---------- */
  const orderId   = sp.get('order_id');
  const orderNumber= sp.get('order_number');
  const customerId = sp.get('customer_id');
  const orderDate = sp.get('order_date');
  const deliveryDate= sp.get('delivery_date');
  const status    = sp.get('order_status');
  const priority  = sp.get('priority');

  /* ---------- 动态 WHERE ---------- */
  const cond: string[] = [];
  const vals: any[] = [];

  /* 精确匹配 */
  if (orderId)      { cond.push('order_id = ?');        vals.push(Number(orderId)); }
  if (customerId)   { cond.push('customer_id = ?');     vals.push(Number(customerId)); }
  if (orderDate)    { cond.push('order_date = ?');      vals.push(orderDate); }
  if (deliveryDate) { cond.push('delivery_date = ?');   vals.push(deliveryDate); }
  if (status)       { cond.push('order_status = ?');    vals.push(status); }
  if (priority)     { cond.push('priority = ?');        vals.push(priority); }

  /* 模糊匹配 */
  if (orderNumber)  { cond.push('order_number LIKE ?'); vals.push(`%${orderNumber}%`); }

  const where = cond.length ? `WHERE ${cond.join(' AND ')}` : '';

  /* ---------- 总条数 ---------- */
  const countSql = `SELECT COUNT(*) AS total FROM orders ${where}`;
  const [countRows] = await pool.query(countSql, vals);
  const total = (countRows as any)[0].total;

  /* ---------- 分页数据 ---------- */
  const dataSql = `
    SELECT order_id, order_number, customer_id, order_date, delivery_date,
           actual_delivery_date, total_quantity, total_amount, currency,
           order_status, priority, sales_person, payment_terms,
           shipping_method, shipping_address, billing_address, notes,
           created_at, updated_at
    FROM orders
    ${where}
    ORDER BY order_id DESC
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

/* =================== POST /api/orders 新增 =================== */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // /* ① 订单编号唯一校验 */
    // const [[exist]] = await pool.query('SELECT 1 FROM orders WHERE order_number = ?', [body.order_number]);
    // if (exist) return NextResponse.json({ ok: false, message: '订单编号已存在' }, { status: 400 });

    /* ② 入库 */
    const sql = `
      INSERT INTO orders
        (order_number, customer_id, order_date, delivery_date,
         actual_delivery_date, total_quantity, total_amount, currency,
         order_status, priority, sales_person, payment_terms,
         shipping_method, shipping_address, billing_address, notes)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;
    const vals = [
      body.order_number,
      body.customer_id,
      body.order_date,
      body.delivery_date,
      body.actual_delivery_date || null,
      body.total_quantity,
      body.total_amount,
      body.currency || 'CNY',
      body.order_status || 'Draft',
      body.priority || 'Medium',
      body.sales_person || null,
      body.payment_terms || null,
      body.shipping_method || null,
      body.shipping_address || null,
      body.billing_address || null,
      body.notes || null,
    ];
    await pool.execute(sql, vals);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('[POST /api/orders]', e);
    return NextResponse.json({ ok: false, message: e.message }, { status: 500 });
  }
}

/* =================== PATCH /api/orders 部分更新 =================== */
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { order_id, ...fields } = body;
    if (!order_id) throw new Error('order_id 必填');

    /* 允许更新的字段白名单 */
    const ALLOW: Record<string, boolean> = {
      order_number: true,
      customer_id: true,
      order_date: true,
      delivery_date: true,
      actual_delivery_date: true,
      total_quantity: true,
      total_amount: true,
      currency: true,
      order_status: true,
      priority: true,
      sales_person: true,
      payment_terms: true,
      shipping_method: true,
      shipping_address: true,
      billing_address: true,
      notes: true,
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

    const sql = `UPDATE orders SET ${sets.join(', ')} WHERE order_id = ?`;
    vals.push(order_id);
    await pool.execute(sql, vals);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('[PATCH /api/orders]', e);
    return NextResponse.json({ ok: false, message: e.message }, { status: 500 });
  }
}

/* =================== DELETE /api/orders 删除 =================== */
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    await pool.execute('DELETE FROM orders WHERE order_id = ?', [body.order_id]);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('[DELETE /api/orders]', e);
    return NextResponse.json({ ok: false, message: e.message }, { status: 500 });
  }
}