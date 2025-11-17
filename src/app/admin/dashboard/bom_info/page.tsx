// src/app/admin/dashboard/materialmanage/bom/page.tsx
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session';
import BomTable from '@/components/business/bom_info/BomTable';

export default async function BomPage() {
  const cookieStore  = await cookies();
  const token = cookieStore.get('token')?.value;
  let user = null;
  if (token) user = await decrypt(token);          // 解密失败也当未登录

  return <BomTable user={user} />;
}