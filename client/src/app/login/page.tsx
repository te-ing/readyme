import Link from 'next/link';

import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { AuthRedirect } from '@/features/auth/components/AuthRedirect';
import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <AuthRedirect>
      <AuthLayout
        title="로그인"
        description="이메일과 비밀번호로 로그인하세요"
        footer={
          <>
            계정이 없으신가요?{' '}
            <Link href="/register" className="text-primary hover:underline">
              회원가입
            </Link>
          </>
        }
      >
        <LoginForm />
      </AuthLayout>
    </AuthRedirect>
  );
}
