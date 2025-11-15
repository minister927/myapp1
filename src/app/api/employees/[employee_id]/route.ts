import { NextResponse } from 'next/server';
import pool from '@/lib/db';

/* GET /api/employees/:id  单条详情 */
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const [rows] = await pool.query('SELECT * FROM employees WHERE employee_id = ?', [params.id]);
  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  }
  return NextResponse.json(rows[0]);
}