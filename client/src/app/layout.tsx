import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { QueryProvider } from '@/providers/QueryProvider';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Readyme - 이력서 플랫폼',
  description: '이력서 작성, 공유, 피드백, 거래 플랫폼',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <QueryProvider>
          <div className="min-h-screen flex flex-col">
            <header className="border-b bg-white">
              <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="font-bold text-xl text-primary-600">Readyme</div>
                <div className="flex items-center gap-4">
                  <Button variant="ghost" asChild>
                    <Link href="/login">로그인</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">회원가입</Link>
                  </Button>
                </div>
              </nav>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t bg-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} Readyme. All rights reserved.
              </div>
            </footer>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
