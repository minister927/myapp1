import LoginForm from '@/components/layout/LoginForm';
import { Card } from 'antd';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4">
      <Card
        title={
          <div className="text-center text-lg font-semibold text-slate-700">
            Next 全栈管理系统后台
          </div>
        }
        className="w-full max-w-md rounded-2xl shadow-xl border-0 bg-white/80 backdrop-blur"
      >
        <LoginForm />
      </Card>
    </div>
  );
}