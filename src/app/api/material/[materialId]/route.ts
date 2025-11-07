// //定义的bom树的子节点的动态路由
// import { NextResponse } from 'next/server';       //用于将提取将参数写入url的代码，conn？？

// import pool from '@/lib/db';

// /* ========== 查：全表 ========== */
// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const materialId = searchParams.get('materialId'); // 前端传的 material_id

//     if (!materialId) {
//         return NextResponse.json({ error: '缺少 material_id' }, { status: 400 });
//       }

//     const conn = await pool.getConnection();
//     const [rows] = await conn.query('SELECT * FROM material where material_id = ?', [materialId]);
//     conn.release();
//     return NextResponse.json(rows);
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }


import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ materialId: string }> } // ← 注意这里是 Promise
) {
  const { materialId } = await params; // ← 必须 await

  const [rows] = await pool.query('SELECT * FROM material where material_id = ?', [materialId]);

  return NextResponse.json(rows);
}