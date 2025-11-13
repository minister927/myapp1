// app/dashboard/page.tsx
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  const user = await decrypt(token);
  
  if (!user) {
    cookieStore.delete('token');
    redirect('/login');
  }

  return (
    <div>
      <h1>欢迎, {user.admin_id}!</h1>
      <p>用户ID: {user.admin_username}</p>
      {/* <p>角色: {user.role || '普通用户'}</p> */}
    </div>
  );
}