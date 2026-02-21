import Link from 'next/link';

import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { AuthRedirect } from '@/features/auth/components/AuthRedirect';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthRedirect>
      <AuthLayout
        title="회원가입"
        description="새 계정을 만들어 시작하세요"
        footer={
          <>
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="text-primary hover:underline">
              로그인
            </Link>
          </>
        }
      >
        <RegisterForm />
      </AuthLayout>
    </AuthRedirect>
  );
}
