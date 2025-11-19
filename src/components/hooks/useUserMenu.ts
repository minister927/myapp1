//用于展示用户选择的下拉栏，,若要复用下拉栏即可再加不同名的方法，使用不同逻辑
'use client';
import { useRouter } from 'next/navigation';
import { MenuProps } from 'antd';

export default function useUserMenu(): MenuProps['items'] {
  const router = useRouter();
  const logout = async() =>{
    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
     router.push('admin/login');
  }

  return [
    {
      key: 'profile',
      label: '个人中心',
      onClick: () => router.push('/admin/profile'),
    },
    {
      key: 'logout',
      label: '退出登录',
      onClick: () => logout() 
    },
  ];
}