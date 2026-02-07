import type { Metadata } from 'next';
import { QueryProvider } from '@/providers/QueryProvider';
import './globals.css';
import { Noto_Sans } from 'next/font/google';

const notoSans = Noto_Sans({ variable: '--font-sans' });

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
    <html lang="ko" className={notoSans.variable}>
      <body className="antialiased">
        <QueryProvider>
          <div className="min-h-screen flex flex-col">
            <header className="border-b bg-white">
              <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="font-bold text-xl text-primary-600">Readyme</div>
                <div className="flex items-center gap-4">
                  <a href="/login" className="text-gray-600 hover:text-gray-900">
                    로그인
                  </a>
                  <a
                    href="/register"
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                  >
                    회원가입
                  </a>
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
