// src/app/api/orders/import/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodeXlsx from 'node-xlsx';
import pool from '@/lib/db';

/* 字段顺序必须与模板一致（第 1 行是表头） */
const HEADER_MAP = [
  'order_number',
  'customer_id',
  'order_date',
  'delivery_date',
  'actual_delivery_date',
  'total_quantity',
  'total_amount',
  'currency',
  'order_status',
  'priority',
  'sales_person',
  'payment_terms',
  'shipping_method',
  'shipping_address',
  'billing_address',
  'notes',
];

export async function POST(req: NextRequest) {
  try {
    /* 1. 取上传文件 buffer */
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: '缺少文件' }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());

    /* 2. 解析成二维数组 */
    const workSheets = nodeXlsx.parse(buffer);
    const sheet = workSheets[0]?.data ?? [];
    if (sheet.length < 2) return NextResponse.json({ error: '空表' }, { status: 400 });

    /* 3. 去掉表头，逐行映射 */
    const rows = sheet.slice(1);
    const orders: any[] = rows.map((row: any[]) => {
      const obj: any = {};
      HEADER_MAP.forEach((key, idx) => {
        obj[key] = row[idx] ?? null;
      });
      // 默认值
      obj.currency = obj.currency || 'CNY';
      obj.order_status = obj.order_status || 'Draft';
      obj.priority = obj.priority || 'Medium';
      return obj;
    });

    /* 4. 事务批量插入 */
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    let ok = 0;
    for (const o of orders) {
      await conn.execute(
        `INSERT INTO orders(order_number,customer_id,order_date,delivery_date,actual_delivery_date,
                            total_quantity,total_amount,currency,order_status,priority,sales_person,
                            payment_terms,shipping_method,shipping_address,billing_address,notes)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          o.order_number, o.customer_id, o.order_date, o.delivery_date,
          o.actual_delivery_date, o.total_quantity, o.total_amount, o.currency,
          o.order_status, o.priority, o.sales_person, o.payment_terms,
          o.shipping_method, o.shipping_address, o.billing_address, o.notes,
        ]
      );
      ok++;
    }
    await conn.commit();
    conn.release();

    return NextResponse.json({ ok, total: orders.length });
  } catch (e: any) {
    console.error('[POST /api/orders/import]', e);
    return NextResponse.json({ error: '导入失败', details: e.message }, { status: 500 });
  }
}