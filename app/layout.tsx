import './globals.css';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Light Life | 身心靈療癒',
  description: 'Light Life 身心靈老師品牌網站',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-10 md:py-16">{children}</main>
      </body>
    </html>
  );
}
