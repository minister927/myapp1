// src/app/api/bom_head/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

/* ========== 直接返回全表数据 ========== */
/* ========== GET：全表 或 多条件查询 ========== */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

   /* 1. 先把原始参数全部打出来 */
   console.log('🔍 原始 URL:', req.url);
   console.log('🔍 searchParams 条目:', Array.from(sp.entries()));

  /* 1. 取所有可选参数 */
  const bomId          = sp.get('bom_id');
  const bomCode        = sp.get('bom_code');
  const bomName        = sp.get('bom_name');
  const productId      = sp.get('product_id');
  const bomVersion     = sp.get('bom_version');
  const bomType        = sp.get('bom_type');        // EBOM | PBOM | MBOM
  const bomStatus      = sp.get('bom_status');      // Develop | Released | Obsolete
  const effectiveFrom  = sp.get('effective_from');  // 生效日期 >=
  const effectiveTo    = sp.get('effective_to');    // 生效日期 <=

  /* 2. 动态 WHERE */
  const cond: string[] = [];
  const vals: any[]    = [];

  if (bomId)        { cond.push('bom_id = ?');        vals.push(Number(bomId)); }
  if (bomCode)      { cond.push('bom_code LIKE ?');   vals.push(`%${bomCode}%`); }
  if (bomName)      { cond.push('bom_name LIKE ?');   vals.push(`%${bomName}%`); }
  if (productId)    { cond.push('product_id = ?');    vals.push(Number(productId)); }
  if (bomVersion)   { cond.push('bom_version = ?');   vals.push(bomVersion); }
  if (bomType)      { cond.push('bom_type = ?');      vals.push(bomType); }
  if (bomStatus)    { cond.push('bom_status = ?');    vals.push(bomStatus); }
  if (effectiveFrom){ cond.push('effective_date >= ?');vals.push(effectiveFrom); }
  if (effectiveTo)  { cond.push('effective_date <= ?');vals.push(effectiveTo); }

  const where = cond.length ? `WHERE ${cond.join(' AND ')}` : '';
  const sql   = `SELECT * FROM bom_head ${where} ORDER BY bom_id`;


  try {
    const [rows] = await pool.query(sql, vals);    //antd的table组件要求返回数据类型必须是数组

    console.log('🔍 SQL:', sql);
    console.log('🔍 绑定值:', vals);

    return NextResponse.json(rows);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

/* ========== 增 ========== */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('🆕bom_head 新增数据:', body);
    await pool.execute(
      `INSERT INTO bom_head
        (bom_code, bom_name, product_id, bom_version, bom_type, bom_status,
          effective_date, expiration_date, creator)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [
        body.bom_code,
        body.bom_name,
        body.product_id,
        body.bom_version || '1.0',
        body.bom_type || 'EBOM',
        body.bom_status || 'Develop',
        body.effective_date || null,
        body.expiration_date || null,
        body.creator || 'System'
      ]
    );
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* ========== 改 ========== */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    await pool.execute(
      `UPDATE bom_head
         SET bom_code           = ?,
             bom_name           = ?,
             product_id         = ?,
             bom_version        = ?,
             bom_type           = ?,
             bom_status         = ?,
             effective_date     = ?,
             expiration_date    = ?,
             creator            = ?
       WHERE bom_id = ?`,
      [
        body.bom_code,
        body.bom_name,
        body.product_id,
        body.bom_version || '1.0',
        body.bom_type || 'EBOM',
        body.bom_status || 'Develop',
        body.effective_date || null,
        body.expiration_date || null,
        body.creator || 'System',
        body.bom_id
      ]
    );
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* ========== 删 ========== */
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    await pool.execute('DELETE FROM bom_head WHERE bom_id = ?', [body.bom_id]);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}