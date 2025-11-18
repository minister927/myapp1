import ClientShell from '@/components/layout/MainPage';

export default function DeviceManageLayout({ children }: { children: React.ReactNode }) {
  // Server Component：仅负责渲染 client shell（减少 server->client bundle）
  return <ClientShell>{children}</ClientShell>;
}