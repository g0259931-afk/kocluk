/**
 * @file apps/web/index.tsx
 * @description AI SaaS Student Coach Platformu - Kullanıcı Arayüzü Uygulaması.
 * Premium tasarım dilini (Glassmorphism, Neon Blur ve Minimalizm) yansıtan
 * Landing Page (Tanıtım Sayfası) ve 8 Adımlı İlk Kurulum Sihirbazı (Onboarding Wizard).
 */

import React, { useState, ChangeEvent } from 'react';
import { OnboardingSteps } from '@saas-coach/shared';
import { formatDateTurkish, formatStudyDuration } from '@saas-coach/utils';
import { StudentProfileEntity } from '@saas-coach/types';

// --- PREMIUM LANDING PAGE COMPONENT ---

export const LandingPage: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-purple-500 selection:text-white">
      {/* Gelecek Temalı Neon Arka Plan Işıkları (Neon Blurs) */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-80 right-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Üst Menü (Navigation Bar) */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/70 border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-wider bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            COACH.AI
          </span>
          <span className="bg-blue-500/10 text-blue-400 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border border-blue-500/20">
            PREMIUM SAAS
          </span>
        </div>
        <div className="hidden md:flex gap-8 text-sm text-slate-300">
          <a href="#features" className="hover:text-purple-400 transition-colors">Özellikler</a>
          <a href="#how-it-works" className="hover:text-purple-400 transition-colors">Nasıl Çalışır?</a>
          <a href="#pricing" className="hover:text-purple-400 transition-colors">Fiyatlandırma</a>
          <a href="#faq" className="hover:text-purple-400 transition-colors">Sıkça Sorulanlar</a>
        </div>
        <button
          onClick={onGetStarted}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:scale-105 active:scale-95"
        >
          Kayıt Ol / Giriş Yap
        </button>
      </nav>

      {/* Hero Bölümü (Hero Section) */}
      <header className="max-w-6xl mx-auto px-6 pt-24 pb-16 text-center relative">
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto">
          Yapay Zekâ Destekli <br />
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Yeni Nesil Dijital Sınav Koçun
          </span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
          Türkiye'deki LGS, TYT, AYT, YKS ve üniversite sınavlarına özel; seni tanıyan, gelişimini saniye saniye izleyen ve her gün "Bugün ne çalışmalıyım?" sorusuna akıllıca yanıt veren yapay zekâ platformu.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onGetStarted}
            className="bg-white text-slate-950 font-bold px-8 py-4 rounded-xl text-lg hover:bg-slate-200 transition-all hover:shadow-lg hover:scale-105"
          >
            14 Gün Ücretsiz Dene
          </button>
          <a
            href="#how-it-works"
            className="bg-white/5 border border-white/15 hover:bg-white/10 px-8 py-4 rounded-xl text-lg font-semibold transition-all inline-flex items-center gap-2 justify-center"
          >
            Nasıl Çalışır? <span>↓</span>
          </a>
        </div>

        {/* Cam Efekti Kartı Önizleme (Premium Dashboard Preview) */}
        <div className="mt-20 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-lg p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-4xl mx-auto">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-xs text-slate-400 tracking-widest font-mono">STUDENT_COACH_DESKTOP_V1.0</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <p className="text-xs text-slate-400 uppercase tracking-wider">Bugün Ne Çalışacağım?</p>
              <h4 className="text-xl font-bold mt-2">Matematik: Trigonometri</h4>
              <p className="text-sm text-slate-300 mt-1">2 saat video izleme + 50 soru çözümü</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <p className="text-xs text-slate-400 uppercase tracking-wider">Haftalık Hedef Durumu</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-2xl font-extrabold text-green-400">%82</span>
                <p className="text-xs text-slate-300">Hedefe Yakınsın!</p>
              </div>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <p className="text-xs text-slate-400 uppercase tracking-wider">Günlük Koç Önerisi</p>
              <p className="text-xs text-purple-300 mt-2 font-mono leading-relaxed">
                "Sabah 08:30'da çalışmaya başlayarak matematik verimini %18 artırabilirsin."
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Fiyatlandırma Tablosu (Pricing Section) */}
      <section id="pricing" className="py-24 border-t border-white/5 max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-extrabold text-center tracking-tight">
          Geleceğine Uygun Paketini Seç
        </h2>
        <p className="text-center text-slate-400 mt-4 max-w-lg mx-auto">
          Tüm paketlerde 14 günlük ücretsiz deneme süresi dahildir. İstediğiniz zaman iptal edebilirsiniz.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {/* Paket 1: Başlangıç */}
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold">Başlangıç Planı</h3>
              <p className="text-xs text-slate-400 mt-1">Sınav hazırlığına ilk adımı atanlar için</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold">249 TL</span>
                <span className="text-sm text-slate-400"> / aylık</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li>• 250.000 AI Token Limiti</li>
                <li>• Haftalık Çalışma Raporu</li>
                <li>• Soru/Ders Yönetim Sistemi</li>
              </ul>
            </div>
            <button onClick={onGetStarted} className="mt-8 w-full bg-white/10 hover:bg-white/20 py-3 rounded-xl font-bold transition-all">
              Hemen Başla
            </button>
          </div>

          {/* Paket 2: Standart Pro (Popüler) */}
          <div className="p-8 rounded-2xl bg-gradient-to-b from-blue-900/30 to-purple-900/30 border-2 border-purple-500 relative flex flex-col justify-between shadow-[0_0_30px_rgba(139,92,246,0.2)]">
            <span className="absolute top-0 right-8 -translate-y-1/2 bg-purple-500 text-slate-950 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              En Çok Satılan
            </span>
            <div>
              <h3 className="text-xl font-bold">Profesyonel Plan</h3>
              <p className="text-xs text-purple-300 mt-1">Yapay zekâyı tam verimle kullanmak isteyenler için</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold">499 TL</span>
                <span className="text-sm text-slate-400"> / aylık</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li>• 1.000.000 AI Token Limiti</li>
                <li>• Günlük Akıllı Çalışma Planı</li>
                <li>• Sessiz Profil Güncelleme Motoru (AI-1)</li>
                <li>• PDF Yükleme ve Analiz Desteği</li>
              </ul>
            </div>
            <button onClick={onGetStarted} className="mt-8 w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 py-3 rounded-xl font-bold transition-all">
              14 Gün Ücretsiz Başla
            </button>
          </div>

          {/* Paket 3: Elit */}
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold">VIP Sınav Planı</h3>
              <p className="text-xs text-slate-400 mt-1">Sınırsız ve gelişmiş analiz arayan derece adaylarına</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold">999 TL</span>
                <span className="text-sm text-slate-400"> / aylık</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li>• 5.000.000 AI Token Limiti</li>
                <li>• Sınırsız PDF Analizi</li>
                <li>• Detaylı Psikolojik Kaygı ve Motivasyon Analizleri</li>
                <li>• Özel Derece Koçluğu Promptları</li>
              </ul>
            </div>
            <button onClick={onGetStarted} className="mt-8 w-full bg-white/10 hover:bg-white/20 py-3 rounded-xl font-bold transition-all">
              Hemen Satın Al
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- 8-STEP ONBOARDING WIZARD ---

export const OnboardingWizard: React.FC<{ onComplete: (profile: Partial<StudentProfileEntity>) => void }> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<StudentProfileEntity>>({
    preferred_address: '',
    school_level: 'YKS',
    target_exam: 'YKS',
    target_university: '',
    target_department: '',
    avg_daily_study_minutes: 120,
    strongest_lesson: '',
    weakest_lesson: '',
    emoji_allowed: true
  });

  const handleNext = () => {
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex items-center justify-center p-6 relative">
      <div className="absolute top-10 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px]" />

      <div className="w-full max-w-xl bg-slate-900/60 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.6)] relative z-10">
        {/* İlerleme Çubuğu */}
        <div className="flex justify-between text-xs text-slate-400 mb-6">
          <span>Adım {currentStep} / 8</span>
          <span>{OnboardingSteps[currentStep - 1].label}</span>
        </div>
        <div className="w-full bg-white/10 h-1.5 rounded-full mb-8 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
            style={{ width: `${(currentStep / 8) * 100}%` }}
          />
        </div>

        {/* Adım İçerikleri */}
        <div className="min-h-[200px]">
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Yapay Zekâ Koçun Seni Nasıl Çağırsın?</h2>
              <p className="text-sm text-slate-400 mb-6">Sana hitap ederken kullanacağı ismi belirleyebilirsin.</p>
              <input
                type="text"
                placeholder="Örn: Şahin"
                value={formData.preferred_address || ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, preferred_address: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Şu Anda Hangi Sınıf Seviyesindesin?</h2>
              <p className="text-sm text-slate-400 mb-6">Sınav müfredatını seviyene göre optimize edeceğiz.</p>
              <div className="grid grid-cols-2 gap-4">
                {['ilkokul', 'ortaokul', 'lise', 'TYT', 'AYT', 'YKS', 'üniversite', 'mezun'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setFormData({ ...formData, school_level: lvl as any })}
                    className={`p-4 rounded-xl border transition-all uppercase text-xs font-semibold ${formData.school_level === lvl ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 hover:border-white/20 bg-white/5'}`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Hangi Sınava Hazırlanıyorsun?</h2>
              <p className="text-sm text-slate-400 mb-6">Seçtiğin sınava yönelik analizler ve soru ağırlıkları oluşturulacaktır.</p>
              <input
                type="text"
                placeholder="Örn: YKS Sayısal"
                value={formData.target_exam || ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, target_exam: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Hedeflediğin Üniversite ve Bölüm Nedir?</h2>
              <p className="text-sm text-slate-400 mb-6">Koçun motivasyonunu artıracak özel hedefleri buna göre belirler.</p>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Üniversite (Örn: Boğaziçi Üniversitesi)"
                  value={formData.target_university || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, target_university: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
                <input
                  type="text"
                  placeholder="Bölüm (Örn: Bilgisayar Mühendisliği)"
                  value={formData.target_department || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, target_department: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Günlük Ortalama Çalışma Süren (Dakika)</h2>
              <p className="text-sm text-slate-400 mb-6">Mevcut çalışma alışkanlığınıza göre günlük görevleri ayarlayacağız.</p>
              <input
                type="number"
                placeholder="Örn: 240"
                value={formData.avg_daily_study_minutes || ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, avg_daily_study_minutes: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
              <p className="text-xs text-slate-500 mt-2">
                Şu anki tahminin: {formatStudyDuration(formData.avg_daily_study_minutes || 0)}
              </p>
            </div>
          )}

          {currentStep === 6 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Hangi Derslerde Kendini Güçlü veya Zayıf Hissediyorsun?</h2>
              <p className="text-sm text-slate-400 mb-6">Zayıf hissettiğin konulara koçun çalışma planında ağırlık verecektir.</p>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="En Güçlü Ders (Örn: Matematik)"
                  value={formData.strongest_lesson || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, strongest_lesson: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
                <input
                  type="text"
                  placeholder="En Zayıf Ders (Örn: Fizik)"
                  value={formData.weakest_lesson || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, weakest_lesson: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>
          )}

          {currentStep === 7 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Bildirim Tercihleri ve İzinleri</h2>
              <p className="text-sm text-slate-400 mb-6">Yapay zekâ koçun sana önemli uyarılar, günlük ders programları ve motivasyon mesajları göndersin mi?</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setFormData({ ...formData, emoji_allowed: true })}
                  className={`flex-1 p-4 rounded-xl border text-sm font-semibold transition-all ${formData.emoji_allowed ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 bg-white/5'}`}
                >
                  Evet, bildirim almak istiyorum 👍
                </button>
                <button
                  onClick={() => setFormData({ ...formData, emoji_allowed: false })}
                  className={`flex-1 p-4 rounded-xl border text-sm font-semibold transition-all ${!formData.emoji_allowed ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 bg-white/5'}`}
                >
                  Hayır, sessiz modda kalsın 🔕
                </button>
              </div>
            </div>
          )}

          {currentStep === 8 && (
            <div className="text-center py-6">
              <span className="text-6xl mb-4 inline-block">🚀</span>
              <h2 className="text-3xl font-extrabold mb-2">Tebrikler, Hazırsın!</h2>
              <p className="text-slate-300 max-w-sm mx-auto leading-relaxed mb-6">
                Bilgilerin yapay zekâ motorumuza başarıyla aktarıldı. Artık kişiselleştirilmiş ders planına ve yapay zekâ koçuna hazırsın.
              </p>
              <p className="text-xs text-slate-500 font-mono">Bugünün tarihi: {formatDateTurkish(new Date())}</p>
            </div>
          )}
        </div>

        {/* Kontroller */}
        <div className="flex justify-between items-center mt-12 pt-6 border-t border-white/10">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`px-5 py-2 text-sm font-semibold rounded-lg border transition-all ${currentStep === 1 ? 'border-white/5 text-slate-600 cursor-not-allowed' : 'border-white/10 hover:bg-white/5 text-slate-300'}`}
          >
            Geri
          </button>
          <button
            onClick={handleNext}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-all hover:shadow-[0_0_15px_rgba(139,92,246,0.4)]"
          >
            {currentStep === 8 ? 'Kurulumu Tamamla' : 'Devam Et'}
          </button>
        </div>
      </div>
    </div>
  );
};
