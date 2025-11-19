// src/app/api/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST(_request: Request) {
  const res = NextResponse.json({ ok: true, message: '已退出' });

  // 关键：同名覆盖、时间设为 0
  res.cookies.set('token', '', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,          // 立即过期
    path: '/',
  });

  return res;
}