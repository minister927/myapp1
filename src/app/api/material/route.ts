import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { NextRequest } from 'next/server';

/* ========== GET：查询物料（支持多条件） ========== */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  console.log('🔍 原始 URL:', req.url);
  console.log('🔍 searchParams 条目:', Array.from(sp.entries()));

  // 提取查询参数
  const materialId = sp.get('material_id');
  const materialCode = sp.get('material_code');
  const materialName = sp.get('material_name');
  const materialType = sp.get('material_type'); // Product/Semi-Finished/Raw/Component/Auxiliary
  const isActive = sp.get('is_active');

  // 动态构建查询条件
  const cond: string[] = [];
  const vals: any[] = [];

  if (materialId) cond.push('material_id = ?'), vals.push(Number(materialId));
  if (materialCode) cond.push('material_code LIKE ?'), vals.push(`%${materialCode}%`);
  if (materialName) cond.push('material_name LIKE ?'), vals.push(`%${materialName}%`);
  if (materialType) cond.push('material_type = ?'), vals.push(materialType);
  if (isActive !== null) cond.push('is_active = ?'), vals.push(Number(isActive));

  const where = cond.length ? `WHERE ${cond.join(' AND ')}` : '';
  const sql = `SELECT * FROM material ${where} ORDER BY material_id`;

  try {
    const [rows] = await pool.query(sql, vals);
    console.log('🔍 SQL:', sql);
    console.log('🔍 绑定值:', vals);
    return NextResponse.json(rows);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

/* ========== POST：新增物料 ========== */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('🆕 material 新增数据:', body);

    await pool.execute(
      `INSERT INTO material
        (material_code, material_name, material_type, material_specs, unit,
         unit_price, supplier, is_active)
       VALUES (?,?,?,?,?,?,?,?)`,
      [
        body.material_code,
        body.material_name,
        body.material_type || 'Component', // 默认组件类型
        body.material_specs || null,
        body.unit || '个', // 默认单位
        body.unit_price || null,
        body.supplier || null,
        body.is_active ? 1 : 0 // 布尔值转数字（1启用，0禁用）
      ]
    );
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* ========== PUT：更新物料 ========== */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    console.log('✏️ material 更新数据:', body);

    await pool.execute(
      `UPDATE material
         SET material_code = ?,
             material_name = ?,
             material_type = ?,
             material_specs = ?,
             unit = ?,
             unit_price = ?,
             supplier = ?,
             is_active = ?
       WHERE material_id = ?`,
      [
        body.material_code,
        body.material_name,
        body.material_type || 'Component',
        body.material_specs || null,
        body.unit || '个',
        body.unit_price || null,
        body.supplier || null,
        body.is_active ? 1 : 0,
        body.material_id // 条件：物料ID
      ]
    );
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* ========== DELETE：删除物料 ========== */
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    console.log('🗑️ material 删除ID:', body.material_id);

    await pool.execute(
      'DELETE FROM material WHERE material_id = ?',
      [body.material_id]
    );
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}