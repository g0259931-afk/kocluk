/**
 * @file apps/web/dashboard.tsx
 * @description AI SaaS Student Coach Platformu - Ana Dashboard, Ders Yönetimi ve Analiz Ekranları.
 * Premium Glassmorphism UI tasarımı ve etkileşimli veri görselleştirmeleri içerir.
 */

import React, { useState } from 'react';
import { LessonEntity, StudentProfileEntity } from '@saas-coach/types';
import { formatDateTurkish, formatStudyDuration } from '@saas-coach/utils';

// --- MAIN DASHBOARD WIDGETS ---

export const MainDashboardView: React.FC<{
  profile: StudentProfileEntity;
  lessons: LessonEntity[];
  onNavigateToLessons: () => void;
}> = ({ profile, lessons, onNavigateToLessons }) => {
  return (
    <div className="space-y-8 text-white p-6 bg-slate-950 min-h-screen">
      {/* Günlük Hoş Geldin & Motivasyon Başlığı */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Merhaba, {profile.preferred_address || 'Öğrenci'} 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Bugün yeni hedefler fethetmek için harika bir gün. Sınava kalan süre daralıyor, ama planın tıkır tıkır işliyor!
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-right">
          <p className="text-xs text-slate-400">Son Güncelleme</p>
          <p className="text-sm font-semibold text-purple-400">{formatDateTurkish(new Date())}</p>
        </div>
      </div>

      {/* Ana Metrik Kartları (Dashboard Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Bugünkü Çalışma Süresi */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
          <span className="text-xs text-slate-400 uppercase tracking-widest font-mono">Çalışma Süresi</span>
          <h3 className="text-2xl font-extrabold mt-2 text-blue-400">
            {formatStudyDuration(profile.avg_daily_study_minutes || 0)}
          </h3>
          <p className="text-xs text-slate-400 mt-1">Günlük ortalama çalışma temponuz</p>
        </div>

        {/* Hedef Net Skor */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
          <span className="text-xs text-slate-400 uppercase tracking-widest font-mono">Net Hedefi</span>
          <h3 className="text-2xl font-extrabold mt-2 text-green-400">
            {profile.current_net_score || 0} / {profile.target_net_score || 100} Net
          </h3>
          <p className="text-xs text-slate-400 mt-1">Mevcut durum ve Boğaziçi hedefiniz</p>
        </div>

        {/* Tamamlanan Konu Oranı */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
          <span className="text-xs text-slate-400 uppercase tracking-widest font-mono">Müfredat Tamamlama</span>
          <h3 className="text-2xl font-extrabold mt-2 text-purple-400">%48</h3>
          <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-purple-500 h-full w-[48%]" />
          </div>
        </div>

        {/* Yapay Zeka Limit Durumu */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
          <span className="text-xs text-slate-400 uppercase tracking-widest font-mono">Premium Kalan Gün</span>
          <h3 className="text-2xl font-extrabold mt-2 text-yellow-400">12 Gün</h3>
          <p className="text-xs text-slate-400 mt-1">Deneme sürümünüz devam ediyor</p>
        </div>
      </div>

      {/* Bugünkü Çalışma Planı & AI Tavsiyeleri */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sol 2 Kolon: Bugünkü Plan */}
        <div className="md:col-span-2 bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Bugünkü Çalışma Programın</h3>
            <button
              onClick={onNavigateToLessons}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
            >
              Tüm Dersleri Yönet →
            </button>
          </div>
          <div className="space-y-3">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${lesson.status === 'weak' ? 'bg-red-500' : 'bg-green-500'}`} />
                  <div>
                    <h4 className="font-semibold">{lesson.name}</h4>
                    <p className="text-xs text-slate-400">
                      {lesson.status === 'weak' ? 'Acil tekrar öneriliyor' : 'Müfredat programına uygun ilerliyor'}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-white/5 text-slate-300 uppercase">
                  {lesson.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sağ 1 Kolon: AI Kişisel Koç Tavsiyesi */}
        <div className="bg-gradient-to-b from-purple-900/20 to-blue-900/20 border border-purple-500/30 p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />
          <h3 className="text-lg font-bold text-purple-300 flex items-center gap-2">
            <span>✨</span> AI Koç Analiz Raporu
          </h3>
          <p className="text-sm text-slate-300 mt-4 leading-relaxed font-light">
            "Merhaba {profile.preferred_address || 'Şahin'}, en zayıf hissettiğin ders olan <strong>{profile.weakest_lesson || 'Fizik'}</strong> dersinden son 10 gündür soru çözmediğini gözlemledim. Bugün dinç bir zihinle sabah çalışması yaparak bu açığı kapatmaya odaklanalım. Sana inanıyorum!"
          </p>
          <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-slate-400">
            <span>Mesafe Analizi: Kritik</span>
            <span className="text-purple-400 font-semibold">%94 Güven Skoru</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- HIERARCHICAL LESSONS MANAGEMENT ---

export const LessonsManagementView: React.FC<{
  lessons: LessonEntity[];
  onAddLesson: (name: string) => void;
}> = ({ lessons, onAddLesson }) => {
  const [newLessonName, setNewLessonName] = useState('');

  const handleAdd = () => {
    if (newLessonName.trim()) {
      onAddLesson(newLessonName.trim());
      setNewLessonName('');
    }
  };

  return (
    <div className="space-y-8 text-white p-6 bg-slate-950 min-h-screen">
      <div className="flex justify-between items-center border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Hiyerarşik Derslerim</h1>
          <p className="text-slate-400 text-sm mt-1">Ders, Konu, Alt Konu ve Kazanım durumlarınızı detaylıca yönetin.</p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Yeni Ders Adı"
            value={newLessonName}
            onChange={(e) => setNewLessonName(e.target.value)}
            className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            Ders Ekle
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-blue-400">{lesson.name}</h3>
              <span className="text-xs uppercase tracking-wider bg-white/5 px-2.5 py-1 rounded text-slate-300">
                {lesson.status}
              </span>
            </div>

            {/* İç Hiyerarşik Yapı Simülasyonu */}
            <div className="space-y-3">
              <div className="p-3 bg-white/5 rounded-xl">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold">Konu: Limit ve Süreklilik</span>
                  <span className="text-xs text-green-400">Tamamlandı</span>
                </div>
                <div className="pl-4 mt-2 space-y-1 text-xs text-slate-400">
                  <p>• Alt Konu: Soldan/Sağdan Limit (Kazanım: 4/4)</p>
                  <p>• Alt Konu: Süreklilik Kuralları (Kazanım: 2/2)</p>
                </div>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-dashed border-white/10">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-slate-300">Konu: Türev ve Uygulamaları</span>
                  <span className="text-xs text-yellow-500">Devam Ediyor</span>
                </div>
                <div className="pl-4 mt-2 space-y-1 text-xs text-slate-400">
                  <p>• Alt Konu: Türev Alma Kuralları (Kazanım: Devam Ediyor)</p>
                  <p>• Alt Konu: Teğet Eğimi (Kazanım: Başlanmadı)</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
