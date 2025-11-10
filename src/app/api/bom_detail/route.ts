// app/api/bom_detail/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  
  console.log('🔍 bom_detail 原始 URL:', req.url);
  console.log('🔍 bom_detail searchParams 条目:', Array.from(sp.entries()));

  // 提取所有查询参数
  const detailId = sp.get('detail_id');
  const bomId = sp.get('bom_id');
  const parentMaterialId = sp.get('parent_material_id');
  const componentMaterialId = sp.get('component_material_id');
  const quantity = sp.get('quantity');
  const lossRate = sp.get('loss_rate');
  const operationSeq = sp.get('operation_seq');
  const isCritical = sp.get('is_critical');
  const referenceDesignator = sp.get('reference_designator');
  const notes = sp.get('notes');
  const createdAtFrom = sp.get('created_at_from');
  const createdAtTo = sp.get('created_at_to');

  // 构建动态 WHERE 子句
  const cond: string[] = [];
  const vals: any[] = [];

  // 精确匹配（整数类型）
  if (detailId) { cond.push('detail_id = ?'); vals.push(Number(detailId)); }
  if (bomId) { cond.push('bom_id = ?'); vals.push(Number(bomId)); }
  if (parentMaterialId) { cond.push('parent_material_id = ?'); vals.push(Number(parentMaterialId)); }
  if (componentMaterialId) { cond.push('component_material_id = ?'); vals.push(Number(componentMaterialId)); }
  if (operationSeq) { cond.push('operation_seq = ?'); vals.push(Number(operationSeq)); }
  if (isCritical !== null && isCritical !== '') { cond.push('is_critical = ?'); vals.push(Number(isCritical)); }

  // 精确匹配（小数类型）
  if (quantity) { cond.push('quantity = ?'); vals.push(Number(quantity)); }
  if (lossRate) { cond.push('loss_rate = ?'); vals.push(Number(lossRate)); }

  // 模糊匹配（字符串类型）
  if (referenceDesignator) { cond.push('reference_designator LIKE ?'); vals.push(`%${referenceDesignator}%`); }
  if (notes) { cond.push('notes LIKE ?'); vals.push(`%${notes}%`); }

  // 时间范围查询
  if (createdAtFrom) { cond.push('created_at >= ?'); vals.push(createdAtFrom); }
  if (createdAtTo) { cond.push('created_at <= ?'); vals.push(createdAtTo); }

  const where = cond.length ? `WHERE ${cond.join(' AND ')}` : '';
  const sql = `SELECT * FROM bom_detail ${where} ORDER BY detail_id `;

  try {
    const [rows] = await pool.query(sql, vals);
    console.log('✅ bom_detail 查询成功，记录数:', Array.isArray(rows) ? rows.length : 0);
    console.log('🔍 SQL:', sql);
    console.log('🔍 绑定值:', vals);
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('❌ bom_detail 查询失败:', error);
    return NextResponse.json({ error: '查询失败', details: error.message }, { status: 500 });
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