// src/app/api/orders/import/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodeXlsx from 'node-xlsx';
import pool from '@/lib/db';

export const HEADER_MAP = [
  'order_id',               // 1
  'order_number',           // 2
  'customer_id',            // 3
  'order_date',             // 4
  'delivery_date',          // 5
  'actual_delivery_date',   // 6
  'total_quantity',         // 7
  'total_amount',           // 8
  'currency',               // 9
  'order_status',           // 10
  'priority',               // 11
  'sales_person',           // 12
  'payment_terms',          // 13
  'shipping_method',        // 14
  'shipping_address',       // 15
  'billing_address',        // 16
  'notes',                  // 17
  'created_at',             // 18
  'updated_at'              // 19
] as const;

/* ------- 日期处理：序列号 or 字符串 → YYYY-MM-DD ------- */
const fmtDate = (v: any): string | null => {
  if (v == null || v === '') return null;
  // 序列号 → Date
  if (typeof v === 'number') {
    const epoch = new Date(1900, 0, 1);
    const dt = new Date(epoch.getTime() + (v - 2) * 864e5); // -2 含伪闰日
    return dt.toISOString().slice(0, 10);
  }
  // 字符串 2011/9/3 or 2011-9-3
  const str = String(v).trim();
  const m = str.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
  if (m) return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;
  return null;
};

export async function POST(req: NextRequest) {
  try {
    /* 1. 取文件 */
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: '缺少文件' }, { status: 400 });
    const buffer = Buffer.from(await file.arrayBuffer());

    /* 2. 解析 */
    const workSheets = nodeXlsx.parse(buffer);
    const sheet = workSheets[0]?.data ?? [];
    if (sheet.length < 2) return NextResponse.json({ error: '空表' }, { status: 400 });

    /* 3. 映射 + 日期转换 */
    const rows = sheet.slice(1);
    const orders: any[] = rows.map((row: any[]) => {
      const obj: any = {};
      HEADER_MAP.forEach((key, idx) => (obj[key] = row[idx] ?? null));
      // 默认值
      obj.currency = obj.currency || 'CNY';
      obj.order_status = obj.order_status || 'Draft';
      obj.priority = obj.priority || 'Medium';
      // 仅转换日期
      obj.order_date = fmtDate(obj.order_date);
      obj.delivery_date = fmtDate(obj.delivery_date);
      obj.actual_delivery_date = fmtDate(obj.actual_delivery_date);
      return obj;
    });

    /* 4. 打印全 19 列 */
    orders.forEach((o, idx) => {
      console.log(
        `行${idx + 2}:`,
        ...HEADER_MAP.map(k => `${k}=${o[k]}`)
      );
    });

    /* 5. 入库（跳过自增 & 时间戳列） */
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    let doneorder = 0;
    for (const o of orders) {
      await conn.execute(
        `INSERT INTO orders(
           order_number,customer_id,order_date,delivery_date,actual_delivery_date,
           total_quantity,total_amount,currency,order_status,priority,sales_person,
           payment_terms,shipping_method,shipping_address,billing_address,notes
         ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          o.order_number, o.customer_id, o.order_date, o.delivery_date,
          o.actual_delivery_date, o.total_quantity, o.total_amount, o.currency,
          o.order_status, o.priority, o.sales_person, o.payment_terms,
          o.shipping_method, o.shipping_address, o.billing_address, o.notes
        ]
      );
      doneorder++;
    }
    await conn.commit();
    conn.release();

    return NextResponse.json({ ok: true, doneorder, total: orders.length });
  } catch (e: any) {
    console.error('[POST /api/orders/import]', e);
    return NextResponse.json({ error: '导入失败', details: e.message }, { status: 500 });
  }
}