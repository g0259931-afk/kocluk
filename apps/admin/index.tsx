/**
 * @file apps/admin/index.tsx
 * @description SaaS Kontrol Merkezi ve Yönetici Paneli (SaaS Admin Management Center).
 * Sistem durum izleme (monitoring), kullanıcı denetleme (RBAC), prompt versiyonlama
 * ve AI model parametre ayarlarının tek bir panelden el ile yönetilebilmesini sağlar.
 */

import React, { useState } from 'react';
import { SimulatedDatabaseStore } from '@saas-coach/database';

// --- ADMIN DASHBOARD & METRICS VIEW ---

export const AdminDashboardView: React.FC = () => {
  // Canlı veritabanı durumunu oku
  const activeUserCount = SimulatedDatabaseStore.users.size;
  const auditLogsList = SimulatedDatabaseStore.auditLogs;
  const activeModel = SimulatedDatabaseStore.modelConfig.selectedModel;

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
          <p className="text-xs text-slate-400 uppercase tracking-wider">Aktif Kullanıcı</p>
          <h3 className="text-3xl font-extrabold mt-2 text-white">{activeUserCount} Öğrenci</h3>
          <p className="text-xs text-green-400 mt-1">▲ Canlı oturum izleniyor</p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
          <p className="text-xs text-slate-400 uppercase tracking-wider">Aylık Tekrarlayan Gelir (MRR)</p>
          <h3 className="text-3xl font-extrabold mt-2 text-green-400">148.900 TL</h3>
          <p className="text-xs text-slate-400 mt-1">PayTR/Iyzico adaptörleri aktif</p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
          <p className="text-xs text-slate-400 uppercase tracking-wider">Toplam İşlem Logu</p>
          <h3 className="text-3xl font-extrabold mt-2 text-purple-400">{auditLogsList.length} Log</h3>
          <p className="text-xs text-slate-400 mt-1">Audit Log tablosu senkronize</p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
          <p className="text-xs text-slate-400 uppercase tracking-wider">Sistem Sağlık Durumu</p>
          <h3 className="text-3xl font-extrabold mt-2 text-blue-400">99.98%</h3>
          <p className="text-xs text-green-400 mt-1">Tüm API ve DB servisleri çalışıyor</p>
        </div>
      </div>

      {/* Son Sistem Günlükleri ve Model Fallback Monitorü */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl space-y-4">
          <h3 className="text-lg font-bold">Son Audit Logları (Sistem İşlemleri)</h3>
          <div className="space-y-2 overflow-y-auto max-h-60">
            {auditLogsList.slice().reverse().map((log, index) => (
              <div key={index} className="p-3 bg-white/5 rounded-xl border border-white/5 text-xs flex justify-between items-center">
                <div>
                  <span className="font-semibold text-purple-400 font-mono">[{log.action.toUpperCase()}]</span>
                  <span className="text-slate-300 ml-2">User: {log.userId}</span>
                  <p className="text-[10px] text-slate-500 mt-1">Details: {JSON.stringify(log.details)}</p>
                </div>
                <span className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl space-y-4">
          <h3 className="text-lg font-bold text-purple-300">Aktif Yapay Zekâ Modeli</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Model:</span>
              <span className="font-mono text-blue-400 uppercase">{activeModel}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Yedek Sağlayıcı:</span>
              <span className="font-mono uppercase">{SimulatedDatabaseStore.modelConfig.fallbackProvider}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Temperature:</span>
              <span className="font-mono text-green-400">{SimulatedDatabaseStore.modelConfig.temperature}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SYSTEM PROMPT & MODEL PARAMETER MANAGEMENT VIEW ---

export const AdminPromptControlView: React.FC = () => {
  const [temperature, setTemperature] = useState(SimulatedDatabaseStore.modelConfig.temperature);
  const [selectedModel, setSelectedModel] = useState(SimulatedDatabaseStore.modelConfig.selectedModel);
  const [activePrompt, setActivePrompt] = useState(SimulatedDatabaseStore.activePrompt);

  const handleSaveChanges = () => {
    SimulatedDatabaseStore.modelConfig.temperature = temperature;
    SimulatedDatabaseStore.modelConfig.selectedModel = selectedModel;
    SimulatedDatabaseStore.activePrompt = activePrompt;

    SimulatedDatabaseStore.auditLogs.push({
      userId: 'admin_user',
      action: 'admin_prompt_updated',
      timestamp: new Date(),
      details: { temperature, selectedModel },
      ip: '127.0.0.1',
      browser: 'Admin Console'
    });

    alert('Yapay zeka sistem parametreleri ve sistem promptu başarıyla güncellendi!');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 space-y-8 font-sans">
      <div className="flex justify-between items-center border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">AI Prompt & Model Kontrol Merkezi</h1>
          <p className="text-sm text-slate-400 mt-1">Karakterleri, kuralları ve parametreleri kod yazmadan dinamik olarak değiştirin.</p>
        </div>
        <button
          onClick={handleSaveChanges}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all hover:shadow-[0_0_15px_rgba(37,99,235,0.4)]"
        >
          Sistem Ayarlarını Kaydet (v1.4)
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
