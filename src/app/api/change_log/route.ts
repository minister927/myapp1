// app/api/bom_change_log/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

/* ==================== GET: 根据 bom_id 查询变更记录 ==================== */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const bomId = sp.get('bom_id');

  if (!bomId) {
    return NextResponse.json(
      { error: '缺少 bom_id 参数' }, 
      { status: 400 }
    );
  }

  try {
    // 按时间降序排列，最新的变更记录在前
    const sql = `
      SELECT * FROM bom_change_log 
      WHERE bom_id = ? 
      ORDER BY changed_at DESC
    `;
    const [rows] = await pool.query(sql, [Number(bomId)]);
    
    console.log(`✅ BOM ${bomId} 变更记录查询成功，共 ${Array.isArray(rows) ? rows.length : 0} 条`);
    console.log('🔍 查询change_log SQL:', sql);
    console.log('🔍 查询change_log 绑定值:', [bomId]);
    
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('❌ 查询 bom_change_log 失败:', error);
    return NextResponse.json(
      { error: '查询失败', details: error.message }, 
      { status: 500 }
    );
  }
}


/* ==================== POST: 新增变更记录 ==================== */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      bom_id,
      change_type,
      change_description,
      change_reason,
      changed_by,
    } = body;

    // // 必填字段校验
    // if (!bom_id || !change_type || !change_description || !change_reason || !changed_by) {
    //   return NextResponse.json(
    //     { error: '缺少必填字段（bom_id, change_type, change_description, change_reason, changed_by）' },
    //     { status: 400 }
    //   );
    // }

    const sql = `
      INSERT INTO bom_change_log 
        (bom_id, change_type, change_description, change_reason, changed_by)
      VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
      Number(bom_id),
      change_type ,
      change_description,
      change_reason || null,
      changed_by,
    ];

    console.log('🔍 插入 change_log SQL:', sql);
    console.log('🔍 插入 change_log 绑定值:', values);

    const [result] = await pool.query(sql, values);

    // 获取插入后的 ID（MySQL 默认返回 insertId）
    const insertId = (result as any).insertId;

    return NextResponse.json({
      success: true,
      message: '新增变更记录成功',
      data: { change_id: insertId },
    });
  } catch (error: any) {
    console.error('❌ 新增 bom_change_log 失败:', error);
    return NextResponse.json(
      { error: '新增失败', details: error.message },
      { status: 500 }
    );
  }
}




/* ==================== PUT: 更新变更记录 ==================== */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { change_id, bom_id, change_type, change_description, change_reason, changed_by } = body;

    // 验证必要字段
    if (!change_id) {
      return NextResponse.json(
        { error: '缺少 change_id' }, 
        { status: 400 }
      );
    }

    // 构建动态更新语句（只更新非空字段）
    const fields: string[] = [];
    const values: any[] = [];

    if (bom_id !== undefined) { fields.push('bom_id = ?'); values.push(Number(bom_id)); }
    if (change_type !== undefined) { fields.push('change_type = ?'); values.push(change_type); }
    if (change_description !== undefined) { fields.push('change_description = ?'); values.push(change_description); }
    if (change_reason !== undefined) { fields.push('change_reason = ?'); values.push(change_reason); }
    if (changed_by !== undefined) { fields.push('changed_by = ?'); values.push(changed_by); }
    // if (changed_at !== undefined) { fields.push('changed_at = ?'); values.push(changed_at); }//change_at似乎在数据库会实时更新

    if (fields.length === 0) {
      return NextResponse.json(
        { error: '没有提供要更新的字段' }, 
        { status: 400 }
      );
    }

    // 添加 WHERE 条件
    values.push(Number(change_id));

    const sql = `UPDATE bom_change_log SET ${fields.join(', ')} WHERE change_id = ?`;

    console.log('🔍 更新 SQL:', sql);
    console.log('🔍 绑定值:', values);

    const [result] = await pool.query(sql, values);

    // 检查是否更新成功
    if (result && typeof result === 'object' && 'affectedRows' in result) {
      if (result.affectedRows === 0) {
        return NextResponse.json(
          { error: '未找到对应的变更记录' }, 
          { status: 404 }
        );
      }
    }

    return NextResponse.json({ success: true, message: '更新成功' });
  } catch (error: any) {
    console.error('❌ 更新 bom_change_log 失败:', error);
    return NextResponse.json(
      { error: '更新失败', details: error.message }, 
      { status: 500 }
    );
  }
}