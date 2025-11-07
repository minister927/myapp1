import { NextResponse ,NextRequest} from 'next/server';
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
  const sql   = `SELECT * FROM device ${where} ORDER BY device_id`;


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
  const body = await req.json();
  await pool.execute(
    'INSERT INTO device (device_name, device_model, installation_location, current_status) VALUES (?,?,?,?)',
    [body.device_name, body.device_model || null, body.installation_location || null, body.current_status || 'Running']  //    用 || null 保证空串也能存成数据库 NULL
  );
  return NextResponse.json({ ok: true });
}

/* ===== 改：PUT /api/device?id=1 ===== */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const [result] = await pool.execute(
      `UPDATE device
         SET device_name = ?,
             device_model = ?,
             installation_location = ?,
             current_status = ?
       WHERE device_id = ?`,
      [
        body.device_name,
        body.device_model || null,
        body.installation_location || null,
        body.current_status || 'Running',
        body.device_id,
      ]
    );
  } catch (e: any) {
    console.error('PUT /api/device', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

/* ===== 删：DELETE /api/device?id=1 ===== */
export async function DELETE(req: Request) {
  const body = await req.json();
  await pool.execute('DELETE FROM device WHERE device_id = ?', [body.device_id]);
  console.log('后端删除的body.id:',body)
  return NextResponse.json({ ok: true });
}