import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { NextRequest } from 'next/server';

/* ========== GET：查询明细（支持多条件） ========== */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  console.log('🔍 原始 URL:', req.url);
  console.log('🔍 searchParams 条目:', Array.from(sp.entries()));

  // 提取查询参数
  const detailId = sp.get('detail_id');
  const bomId = sp.get('bom_id');
  const parentMaterialId = sp.get('parent_material_id');
  const componentMaterialId = sp.get('component_material_id');
  const isCritical = sp.get('is_critical');

  // 动态构建查询条件
  const cond: string[] = [];
  const vals: any[] = [];

  if (detailId) cond.push('detail_id = ?'), vals.push(Number(detailId));
  if (bomId) cond.push('bom_id = ?'), vals.push(Number(bomId));
  if (parentMaterialId) cond.push('parent_material_id = ?'), vals.push(Number(parentMaterialId));
  if (componentMaterialId) cond.push('component_material_id = ?'), vals.push(Number(componentMaterialId));
  if (isCritical !== null) cond.push('is_critical = ?'), vals.push(Number(isCritical));

  const where = cond.length ? `WHERE ${cond.join(' AND ')}` : '';
  const sql = `SELECT * FROM bom_detail ${where} ORDER BY detail_id`;

  try {
    const [rows] = await pool.query(sql, vals);
    console.log('🔍 SQL:', sql);
    console.log('🔍 绑定值:', vals);
    return NextResponse.json(rows);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

/* ========== POST：新增明细 ========== */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('🆕 bom_detail 新增数据:', body);

    await pool.execute(
      `INSERT INTO bom_detail
        (bom_id, parent_material_id, component_material_id, quantity, loss_rate,
         operation_seq, is_critical, reference_designator, notes)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [
        body.bom_id,
        body.parent_material_id,
        body.component_material_id,
        body.quantity || 1.0000,
        body.loss_rate || null,
        body.operation_seq || null,
        body.is_critical ? 1 : 0, // 布尔值转数字
        body.reference_designator || null,
        body.notes || null
      ]
    );
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* ========== PUT：更新明细 ========== */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    console.log('✏️ bom_detail 更新数据:', body);

    await pool.execute(
      `UPDATE bom_detail
         SET bom_id = ?,
             parent_material_id = ?,
             component_material_id = ?,
             quantity = ?,
             loss_rate = ?,
             operation_seq = ?,
             is_critical = ?,
             reference_designator = ?,
             notes = ?
       WHERE detail_id = ?`,
      [
        body.bom_id,
        body.parent_material_id,
        body.component_material_id,
        body.quantity || 1.0000,
        body.loss_rate || null,
        body.operation_seq || null,
        body.is_critical ? 1 : 0,
        body.reference_designator || null,
        body.notes || null,
        body.detail_id // 条件：明细ID
      ]
    );
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* ========== DELETE：删除明细 ========== */
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    console.log('🗑️ bom_detail 删除ID:', body.detail_id);

    await pool.execute(
      'DELETE FROM bom_detail WHERE detail_id = ?',
      [body.detail_id]
    );
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}