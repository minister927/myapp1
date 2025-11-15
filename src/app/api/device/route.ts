import { NextResponse ,NextRequest} from 'next/server';
import pool from '@/lib/db';


/* ========== 直接返回全表数据 ========== */
/* ========== GET：全表 或 多条件查询 ========== */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

   /* 1. 先把原始参数全部打出来 */////////////////////////////该多条件查询仍未逻辑上的实现，请勿使用
   console.log('🔍 原始 URL:', req.url);
   console.log('🔍 searchParams 条目:', Array.from(sp.entries()));

  /* 1. 取所有可选参数 */
  const deviceId          = sp.get('device_id');
  const deviceName        = sp.get('device_name');
  const deviceModel        = sp.get('device_model');
  const installationLocation      = sp.get('installation_location');
  const currentstatus     = sp.get('current_status');
  const totalOperatingHours        = sp.get('total_operating_hours');        // EBOM | PBOM | MBOM
  const lastMaintenanceDate      = sp.get('last_maintenance_date');      // Develop | Released | Obsolete
  const manufacturer  = sp.get('manufacturer');  // 生效日期 >=
  const purchaseDate    = sp.get('purchase_date');    // 生效日期 <=

  /* 2. 动态 WHERE */
  const cond: string[] = [];
  const vals: any[]    = [];

  if (deviceId)        { cond.push('bom_id = ?');        vals.push(Number(deviceId)); }
  if (deviceName)      { cond.push('bom_code LIKE ?');   vals.push(`%${deviceName}%`); }
  if (deviceModel)      { cond.push('bom_name LIKE ?');   vals.push(`%${deviceModel}%`); }
  if (installationLocation)    { cond.push('product_id = ?');    vals.push(Number(installationLocation)); }
  if (currentstatus)   { cond.push('bom_version = ?');   vals.push(currentstatus); }
  if (totalOperatingHours)      { cond.push('bom_type = ?');      vals.push(totalOperatingHours); }
  if (lastMaintenanceDate)    { cond.push('bom_status = ?');    vals.push(lastMaintenanceDate); }
  if (manufacturer){ cond.push('effective_date >= ?');vals.push(manufacturer); }
  if (purchaseDate)  { cond.push('effective_date <= ?');vals.push(purchaseDate); }

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
   await pool.execute(
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
    return NextResponse.json({ ok: true });
  }
}

/* ===== 删：DELETE /api/device?id=1 ===== */
export async function DELETE(req: Request) {
  const body = await req.json();
  await pool.execute('DELETE FROM device WHERE device_id = ?', [body.device_id]);
  console.log('后端删除的body.id:',body)
  return NextResponse.json({ ok: true });
}