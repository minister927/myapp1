// src/app/api/export/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import nodeXlsx from 'node-xlsx';

export async function GET(req: NextRequest) {
  try {
    /* 1. 查数据 */
    const [rows] = await pool.query(`
      SELECT * FROM bom_head ORDER BY bom_id DESC
    `);

    /* 2. 表头 + 数据 */
    const data = [
      Object.keys((rows as any)[0] ?? {}),
      ...(rows as any[]).map((r: any) => Object.values(r)),
    ];

    /* 3. 生成 xlsx */
    const buffer = nodeXlsx.build([{ name: 'Orders', data: data as unknown[][], options: {} }]);

    /* 4. Buffer → ArrayBuffer → Blob ⬅ 关键一步 */
   const u8 = new Uint8Array(buffer);   // 视图，零拷贝

    const blob = new Blob([u8], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    /* 5. 下载 */
    return new NextResponse(blob, {
      headers: {
        'Content-Disposition': 'attachment; filename=orders.xlsx',
      },
    });
  } catch (e: any) {
    console.error('[GET /api/export]', e);
    return NextResponse.json({ error: '导出失败', details: e.message }, { status: 500 });
  }
}