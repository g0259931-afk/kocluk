/**
 * @file apps/admin/index.tsx
 * @description SaaS Kontrol Merkezi ve Yönetici Paneli (SaaS Admin Management Center).
 * Sistem durum izleme (monitoring), kullanıcı denetleme (RBAC), prompt versiyonlama
 * ve AI model parametre ayarlarının tek bir panelden el ile yönetilebilmesini sağlar.
 */

import React, { useState } from 'react';
import { UserEntity, UserRole } from '@saas-coach/types';

// --- ADMIN DASHBOARD & METRICS VIEW ---

export const AdminDashboardView: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 space-y-8 font-sans">
      {/* Üst Yönetici Başlığı */}
      <div className="flex justify-between items-center border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">SaaS Kontrol Merkezi</h1>
          <p className="text-sm text-slate-400 mt-1">Sistem performansını, gelirleri ve AI bütçelerini gerçek zamanlı yönetin.</p>
        </div>
        <span className="bg-red-500/10 text-red-400 text-xs px-3 py-1.5 rounded-full border border-red-500/20 uppercase tracking-widest font-mono font-bold animate-pulse">
          Canlı İzleme Etkin
        </span>
      </div>

      {/* Finansal & AI Metrikleri Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
          <p className="text-xs text-slate-400 uppercase tracking-wider">Toplam Kullanıcı</p>
          <h3 className="text-3xl font-extrabold mt-2 text-white">12.450</h3>
          <p className="text-xs text-green-400 mt-1">▲ Bugün +142 yeni öğrenci</p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
          <p className="text-xs text-slate-400 uppercase tracking-wider">Aylık Tekrarlayan Gelir (MRR)</p>
          <h3 className="text-3xl font-extrabold mt-2 text-green-400">148.900 TL</h3>
          <p className="text-xs text-slate-400 mt-1">PayTR/Iyzico adaptörleri aktif</p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
          <p className="text-xs text-slate-400 uppercase tracking-wider">Bugün Harcanan AI Token</p>
          <h3 className="text-3xl font-extrabold mt-2 text-purple-400">4.120.450</h3>
          <p className="text-xs text-slate-400 mt-1">Maliyet: $24.84 (GPT-4o ağırlıklı)</p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
          <p className="text-xs text-slate-400 uppercase tracking-wider">Sistem Sağlık Durumu</p>
          <h3 className="text-3xl font-extrabold mt-2 text-blue-400">99.98%</h3>
          <p className="text-xs text-green-400 mt-1">Tüm API ve DB servisleri çalışır durumda</p>
        </div>
      </div>

      {/* Model Durumları ve AI Sağlayıcı Fallback Monitorü */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl space-y-4">
          <h3 className="text-lg font-bold">Aktif AI Sağlayıcı ve Fallback Zinciri</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
              <div>
                <h4 className="font-semibold text-blue-400">1. Birincil Sağlayıcı: OpenAI (GPT-4o)</h4>
                <p className="text-xs text-slate-400">Ortalama yanıt süresi: 1240ms | Başarı Oranı: %99.4</p>
              </div>
              <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">AKTİF</span>
            </div>

            <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
              <div>
                <h4 className="font-semibold text-purple-400">2. İkincil Sağlayıcı: Claude (Sonnet 3.5)</h4>
                <p className="text-xs text-slate-400">Hata durumunda otomatik yönlendirilecek model</p>
              </div>
              <span className="text-xs font-bold text-slate-400 bg-white/5 px-2 py-1 rounded">YEDEK</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl space-y-4">
          <h3 className="text-lg font-bold text-purple-300">Gereksinim / Disk Kotası</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">PostgreSQL Yükü:</span>
              <span className="font-mono">%14 (Index Ok)</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Redis Cache Hit:</span>
              <span className="font-mono">%92.4</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Günlük Hata Logu:</span>
              <span className="font-mono text-green-400">0 Kritik Hata</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SYSTEM PROMPT & MODEL PARAMETER MANAGEMENT VIEW ---

export const AdminPromptControlView: React.FC = () => {
  const [temperature, setTemperature] = useState(0.7);
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [activePrompt, setActivePrompt] = useState(
    `Sen Türkiye'deki sınavlara hazırlanan öğrencilere premium koçluk yapan akıllı bir yapay zekâ eğitim koçusun.`
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 space-y-8 font-sans">
      <div className="flex justify-between items-center border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">AI Prompt & Model Kontrol Merkezi</h1>
          <p className="text-sm text-slate-400 mt-1">Karakterleri, kuralları ve parametreleri kod yazmadan dinamik olarak değiştirin.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors">
          Yeni Versiyon Olarak Kaydet (v1.4)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sol Kolon: Model Parametreleri */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl space-y-6">
          <h3 className="text-lg font-bold text-blue-400">Model Yapılandırması</h3>

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Varsayılan Model</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="gpt-4o">GPT-4o (Yüksek Mantık)</option>
              <option value="gpt-3.5-turbo">GPT-3.5-Turbo (Hızlı Analiz)</option>
              <option value="claude-3-opus">Claude 3 Opus (Derin Rehberlik)</option>
              <option value="deepseek-coder">DeepSeek Coder (Kod & Tablo)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-xs uppercase tracking-wider text-slate-400 mb-2">
              <span>Yaratıcılık Derecesi (Temperature)</span>
              <span className="font-mono font-bold text-blue-400">{temperature}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.2"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full cursor-pointer accent-blue-500"
            />
            <p className="text-[10px] text-slate-500 mt-1.5">
              Düşük değerler daha tutarlı ve net, yüksek değerler ise daha yaratıcı cevaplar üretir.
            </p>
          </div>
        </div>

        {/* Sağ Kolon: Aktif System Prompt Düzenleyici */}
        <div className="md:col-span-2 bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl space-y-4">
          <h3 className="text-lg font-bold text-purple-300">Aktif Sistem Promptu (Koç Motoru)</h3>
          <textarea
            rows={10}
            value={activePrompt}
            onChange={(e) => setActivePrompt(e.target.value)}
            className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors font-mono leading-relaxed"
          />
          <div className="flex justify-between items-center text-xs text-slate-500 pt-2">
            <span>Aktif Sürüm: <strong>v1.3.2</strong> | Değiştiren: <strong>Admin (Şahin)</strong></span>
            <button className="text-blue-400 hover:text-blue-300">Önceki Sürüme Geri Dön (Rollback) ↩</button>
          </div>
        </div>
      </div>
    </div>
  );
};
