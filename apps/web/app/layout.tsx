import React from 'react';
import './globals.css';

export const metadata = {
  title: 'AI SaaS Student Coach Platform',
  description: 'Türkiye\'nin Yapay Zekâ Destekli Premium Eğitim Koçluğu Platformu',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="bg-slate-950 text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
