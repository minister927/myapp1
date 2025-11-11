// lib/get-user.ts，供 API Route 和 后台页面 调用的工具，获取当前用户信息
import { headers } from 'next/headers';

export async function getCurrentUser() {
  const headersList = await headers(); // 异步函数, 改get为 await
  const userId = headersList.get('x-user-id');
  const username = headersList.get('x-username');

  if (!userId) {
    return null;
  }

  return {
    userId,
    username,
  };
}




// // app/api/material/route.ts，API取用 示例
// import { NextResponse } from 'next/server';
// import { getCurrentUser } from '@/lib/get-user';

// export async function GET() {
//   const user = await getCurrentUser(); // ✅ 添加 await
  
//   if (!user) {
//     return NextResponse.json({ error: '未授权' }, { status: 401 });
//   }

//   console.log(`用户 ${user.username} (ID: ${user.userId}) 正在查询`);
//   return NextResponse.json({ data: '查询结果' });
// }


// // app/admin/dashboard/page.tsx, 后台页面取用示例
// import { getCurrentUser } from '@/lib/get-user';
// import { redirect } from 'next/navigation';

// export default async function DashboardPage() {
//   const user = await getCurrentUser(); // ✅ 添加 await
  
//   if (!user) {
//     redirect('/admin/login');
//   }

//   return (
//     <div>
//       <h1>欢迎, {user.username}!</h1>
//     </div>
//   );
// }