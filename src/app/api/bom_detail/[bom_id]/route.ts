import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bom_id: string }> } // ← 注意这里是 Promise
) {
  const { bom_id } = await params; // ← 必须 await

  const [rows] = await pool.query(
    `SELECT *
     FROM bom_detail
     WHERE bom_id = ?
     ORDER BY operation_seq`,
    [bom_id]
  );

  return NextResponse.json(rows);
}