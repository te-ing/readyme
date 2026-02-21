import { Header } from '@/components/Header';
import { Toaster } from '@/components/ui/sonner';
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
            <Header />
            <main className="flex-1">{children}</main>
            <footer className="border-t bg-muted">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-muted-foreground text-sm">
                &copy; {new Date().getFullYear()} Readyme. All rights reserved.
              </div>
            </footer>
          </div>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
