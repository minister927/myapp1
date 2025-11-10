// app/api/material/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  
  console.log('🔍 material 原始 URL:', req.url);
  console.log('🔍 material searchParams 条目:', Array.from(sp.entries()));

  // 提取所有查询参数
  const materialId = sp.get('material_id');
  const materialCode = sp.get('material_code');
  const materialName = sp.get('material_name');
  const materialType = sp.get('material_type'); // Product | Semi-Finished | Raw | Component | Auxiliary
  const materialSpecs = sp.get('material_specs');
  const unit = sp.get('unit');
  const unitPriceMin = sp.get('unit_price_min');
  const unitPriceMax = sp.get('unit_price_max');
  const supplier = sp.get('supplier');
  const isActive = sp.get('is_active'); // 1 | 0
  const createdAtFrom = sp.get('created_at_from');
  const createdAtTo = sp.get('created_at_to');
  const updatedAtFrom = sp.get('updated_at_from');
  const updatedAtTo = sp.get('updated_at_to');

  // 构建动态 WHERE 子句
  const cond: string[] = [];
  const vals: any[] = [];

  // 精确匹配（整数类型）
  if (materialId) { cond.push('material_id = ?'); vals.push(Number(materialId)); }
  if (isActive !== null && isActive !== '') { cond.push('is_active = ?'); vals.push(Number(isActive)); }

  // 精确匹配（枚举类型）
  if (materialType) { cond.push('material_type = ?'); vals.push(materialType); }
  if (unit) { cond.push('unit = ?'); vals.push(unit); }

  // 模糊匹配（字符串类型）
  if (materialCode) { cond.push('material_code LIKE ?'); vals.push(`%${materialCode}%`); }
  if (materialName) { cond.push('material_name LIKE ?'); vals.push(`%${materialName}%`); }
  if (materialSpecs) { cond.push('material_specs LIKE ?'); vals.push(`%${materialSpecs}%`); }
  if (supplier) { cond.push('supplier LIKE ?'); vals.push(`%${supplier}%`); }

  // 数值范围查询（单价）
  if (unitPriceMin) { cond.push('unit_price >= ?'); vals.push(Number(unitPriceMin)); }
  if (unitPriceMax) { cond.push('unit_price <= ?'); vals.push(Number(unitPriceMax)); }

  // 时间范围查询
  if (createdAtFrom) { cond.push('created_at >= ?'); vals.push(createdAtFrom); }
  if (createdAtTo) { cond.push('created_at <= ?'); vals.push(createdAtTo); }
  if (updatedAtFrom) { cond.push('updated_at >= ?'); vals.push(updatedAtFrom); }
  if (updatedAtTo) { cond.push('updated_at <= ?'); vals.push(updatedAtTo); }

  const where = cond.length ? `WHERE ${cond.join(' AND ')}` : '';
  const sql = `SELECT * FROM material ${where} ORDER BY material_id ASC`;

  try {
    const [rows] = await pool.query(sql, vals);
    console.log('✅ material 查询成功，记录数:', Array.isArray(rows) ? rows.length : 0);
    console.log('🔍 SQL:', sql);
    console.log('🔍 绑定值:', vals);
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('❌ material 查询失败:', error);
    return NextResponse.json({ error: '查询失败', details: error.message }, { status: 500 });
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