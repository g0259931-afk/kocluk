/**
 * @file apps/web/app/page.tsx
 * @description Next.js App Router Ana Giriş Sayfası.
 * `apps/web/index.tsx` içerisindeki premium tek sayfa (SPA) arayüzünü yükler.
 */

'use client';

import React from 'react';
import { AppContainer } from '../index';

export default function HomePage() {
  // Entegre premium SPA konteynerını döndür
  return <AppContainer />;
}
