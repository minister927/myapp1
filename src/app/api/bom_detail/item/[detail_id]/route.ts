import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ detail_id: string }> } // ← 注意这里是 Promise
) {
  const { detail_id } = await params; // ← 必须 await

  const [rows] = await pool.query(
    `SELECT *
     FROM bom_detail
     WHERE detail_id = ?
     ORDER BY operation_seq`,
    [detail_id]
  );

  return NextResponse.json(rows);
}