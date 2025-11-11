import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose'; // ① 官方 ESM 验签库

// 将密钥转换为 Uint8Array
const secret = new TextEncoder().encode(process.env.SESSION_SECRET!);

//后续扩展让用户信息可以随时取用，目前只做最简单的鉴权，
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
       // 3. 验签 + 过期检查 + 提取 payload
      const { payload } = await jwtVerify(token, secret);// ② 验签并提取 payload登录信息,根据密钥验证身份，防止冒充
      console.log('中间件：token 合法，payload 包含:', payload);
      
      // 4. 将用户信息添加到请求头，供下游使用
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', payload.admin_id?.toString() || '');
      requestHeaders.set('x-username', payload.admin_username?.toString() || '');
      
      // 5. 继续处理请求，带上修改后的 headers
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (e) {
      console.log('中间件：token 非法或已过期，重定向');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // 3. 其余情况正常通过
  return NextResponse.next();
}





export const config = {
  // 只在 /admin/* 触发中间件，减少损耗
  matcher: ['/admin/:path*']
}