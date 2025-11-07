import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose'; // ① 官方 ESM 验签库


export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. 登录页本身直接放行
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // 2. 其它 /admin 子路径才需要鉴权
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('token')?.value; 
    console.log('查询到的token : ', token);
    if (!token) {
      console.log('中间件：未检测到 token，重定向到 /admin/login');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      // 3. 验签 + 过期检查
      const userId = token;
      console.log('中间件：token 合法，用户 ID=', userId);
      return NextResponse.next();
    } catch (e) {
      console.log('中间件：token 非法或已过期，重定向');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    console.log('中间件：token 存在，放行');
  }

  // 3. 其余情况正常通过
  return NextResponse.next();
}

export const config = {
  // 只在 /admin/* 触发中间件，减少损耗
  matcher: ['/admin/:path*']
}