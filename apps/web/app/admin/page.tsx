/**
 * @file apps/web/app/admin/page.tsx
 * @description Next.js App Router Yönetici Sayfası (Admin Dashboard).
 * `apps/admin/index.tsx` içindeki SaaS kontrol merkezi bileşenlerini sunar.
 */

'use client';

import React, { useState } from 'react';
import { AdminDashboardView, AdminPromptControlView } from '@saas-coach/admin';

export default function AdminPage() {
  const [tab, setTab] = useState<'metrics' | 'prompts'>('metrics');

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col">
      {/* Admin Navigasyon Barı */}
      <nav className="border-b border-white/10 bg-slate-900/50 backdrop-blur-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-red-400 to-yellow-500 bg-clip-text text-transparent font-mono">
            ADMIN.COACH
          </span>
          <span className="bg-red-500/10 text-red-400 text-[10px] px-2 py-0.5 rounded border border-red-500/20 font-bold uppercase tracking-wider">
            SaaS Root
          </span>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setTab('metrics')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === 'metrics' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Metrikler & İzleme
          </button>
          <button
            onClick={() => setTab('prompts')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === 'prompts' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Sistem Prompt & AI Ayarları
          </button>
        </div>
        <a
          href="/"
          className="text-xs bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors text-slate-300"
        >
          Kullanıcı Paneline Dön
        </a>
      </nav>

      {/* Admin Panel Seçilen Görünüm */}
      <div className="flex-1">
        {tab === 'metrics' ? <AdminDashboardView /> : <AdminPromptControlView />}
      </div>
    </div>
  );
}
