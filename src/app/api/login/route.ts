import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { encrypt } from '@/lib/session'; // session写的 encrypt

/* ========== 根据登录账号密码查找信息 ========== */
export async function POST( req: Request) {
    const { username, password } = await req.json(); // 只读一次
    
    const [rows]: any[] = await pool.query(
    'SELECT * FROM admin WHERE admin_username = ? LIMIT 1',
    [username ]  
    );
      /*用户不存在 */
     if (rows.length === 0) {
        return NextResponse.json({ ok: false, message: '用户名或密码错误' }, { status: 401 });
      }
      // /*  比对密码 */
      // const { admin_id, admin_username,admin_password: pwdInDb } = rows[0];//等价于const admin_id   = rows[0].admin_id;   
      //                                                       //      const pwdInDb    = rows[0].admin_password;        
      // if (password !== pwdInDb) {
      //   return NextResponse.json({ ok: false, message: '用户名或密码错误' }, { status: 401 });
      // }
      // // 生成jwt
      // const token = await encrypt(rows[0]);

      const user = rows[0];
      const { admin_password: pwdInDb, ...userData } = user; // 2. 移除密码，保留其他信息
      
      if (password !== pwdInDb) {
        return NextResponse.json({ ok: false, message: '用户名或密码错误' }, { status: 401 });
      }

       // 3. 将完整的用户信息生成 token
       console.log('用户信息：', userData);
      const token = await encrypt(userData);
      
       // 2. 把 JWT 种到 Cookie（让浏览器自动带） 
      const response = NextResponse.json({ ok: true, message: '登录成功',user: userData });

      response.cookies.set('token', token, {
        httpOnly: true,//不传私密信息，改为false,方便客户端组件取用
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

    return response;
  }