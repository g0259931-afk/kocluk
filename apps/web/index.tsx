/**
 * @file apps/web/index.tsx
 * @description AI SaaS Student Coach Platformu - Entegre Premium Tek Sayfa Uygulaması (SPA).
 * Landing Page, 8-Adımlı Sihirbaz, Dashboard, Dersler, Canlı Sohbet ve 50+ Alanı Yöneten Ayarlar Ekranı.
 * Mobil için tam bir Mobil Uygulama (PWA) hissi, masaüstü için ise Premium Masaüstü Yazılımı görünümü sunar.
 */

import React, { useState, useEffect } from 'react';
import { OnboardingSteps } from '@saas-coach/shared';
import { formatDateTurkish, formatStudyDuration } from '@saas-coach/utils';
import { StudentProfileEntity, LessonEntity, AIMessageEntity } from '@saas-coach/types';

// --- SUB-COMPONENTS IMPORT/EXPORTS ---
import { MainDashboardView, LessonsManagementView } from './dashboard';
import { PremiumChatView, StudentProfileSettingsView } from './chat_settings';

// --- PREMIUM LANDING PAGE COMPONENT ---

export const LandingPage: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-purple-500 selection:text-white relative overflow-hidden">
      {/* Gelecek Temalı Neon Arka Plan Işıkları (Neon Blurs) */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-80 right-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Üst Menü (Navigation Bar) */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/70 border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-wider bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-mono">
            COACH.AI
          </span>
          <span className="bg-blue-500/10 text-blue-400 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border border-blue-500/20 font-bold">
            PREMIUM SAAS
          </span>
        </div>
        <div className="hidden md:flex gap-8 text-sm text-slate-300">
          <a href="#features" className="hover:text-purple-400 transition-colors">Özellikler</a>
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
            Yeni Nesil Sınav Koçun
          </span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
          Türkiye'deki LGS, TYT, AYT, YKS ve üniversite sınavlarına özel; seni tanıyan, gelişimini saniye saniye izleyen ve her gün "Bugün ne çalışmalıyım?" sorusuna yanıt veren yapay zekâ platformu.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onGetStarted}
            className="bg-white text-slate-950 font-bold px-8 py-4 rounded-xl text-lg hover:bg-slate-200 transition-all hover:shadow-lg hover:scale-105"
          >
            14 Gün Ücretsiz Dene
          </button>
          <a
            href="#pricing"
            className="bg-white/5 border border-white/15 hover:bg-white/10 px-8 py-4 rounded-xl text-lg font-semibold transition-all inline-flex items-center gap-2 justify-center"
          >
            Fiyatlandırma <span>↓</span>
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, preferred_address: e.target.value })}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, target_exam: e.target.value })}
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, target_university: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
                <input
                  type="text"
                  placeholder="Bölüm (Örn: Bilgisayar Mühendisliği)"
                  value={formData.target_department || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, target_department: e.target.value })}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, avg_daily_study_minutes: Number(e.target.value) })}
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, strongest_lesson: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
                <input
                  type="text"
                  placeholder="En Zayıf Ders (Örn: Fizik)"
                  value={formData.weakest_lesson || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, weakest_lesson: e.target.value })}
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

// --- CORE CLIENT-SIDE API FETCH WRAPPER (REAL HTTP) ---

async function fetchFromBackend(route: string, method: 'GET' | 'POST' | 'PUT', body?: any): Promise<any> {
  const response = await window.fetch(`/api/v1${route}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': 'default_student_user'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  return await response.json();
}

// --- CORE APP CONTAINER (WITH RESPONSIVE BottomNavigation) ---

export const AppContainer: React.FC = () => {
  const [screen, setScreen] = useState<'landing' | 'onboarding' | 'dashboard' | 'lessons' | 'chat' | 'settings'>('landing');
  const studentId = 'default_student_user';

  // Uygulama Durumları (States)
  const [profile, setProfile] = useState<StudentProfileEntity | null>(null);
  const [lessons, setLessons] = useState<LessonEntity[]>([]);
  const [chatMessages, setMessages] = useState<AIMessageEntity[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Veritabanı ve AI işlemlerini REST API üzerinden tetikler (Clean Architecture)
  useEffect(() => {
    async function loadData() {
      const profileRes = await fetchFromBackend('/profile/settings', 'GET');
      const lessonsRes = await fetchFromBackend('/lessons', 'GET');

      if (profileRes.success) setProfile(profileRes.data);
      if (lessonsRes.success) setLessons(lessonsRes.data);

      setMessages([
        {
          id: 'msg_welcome',
          conversation_id: 'conv_1',
          sender_role: 'assistant',
          content: `Merhaba Şahin! Ben senin yapay zekâ eğitim koçunum. Hedefin olan Boğaziçi Üniversitesi Bilgisayar Mühendisliği için bugünkü çalışma planını hazırladım. Kafana takılan tüm konuları bana sorabilirsin!`,
          created_at: new Date(),
          tokens_used: 150
        }
      ]);
    }
    loadData();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Onboarding Sihirbazı Tamamlandığında
  const handleOnboardingComplete = async (onboardedData: Partial<StudentProfileEntity>) => {
    const res = await fetchFromBackend('/profile/settings', 'PUT', onboardedData);
    if (res.success) {
      setProfile(res.data);

      // İlk dersleri de API üzerinden oluştur
      if (onboardedData.strongest_lesson) {
        await fetchFromBackend('/lessons', 'POST', { name: onboardedData.strongest_lesson });
      }
      if (onboardedData.weakest_lesson) {
        await fetchFromBackend('/lessons', 'POST', { name: onboardedData.weakest_lesson });
      }

      const lessonsRes = await fetchFromBackend('/lessons', 'GET');
      if (lessonsRes.success) setLessons(lessonsRes.data);

      triggerToast('Sihirbaz başarıyla tamamlandı! Profiliniz ve ders hiyerarşiniz oluşturuldu.');
      setScreen('dashboard');
    }
  };

  // Ders Ekleme İşlemi
  const handleAddLesson = async (name: string) => {
    const res = await fetchFromBackend('/lessons', 'POST', { name });
    if (res.success) {
      const lessonsRes = await fetchFromBackend('/lessons', 'GET');
      if (lessonsRes.success) setLessons(lessonsRes.data);
      triggerToast(`"${name}" dersi başarıyla eklendi.`);
    }
  };

  // Profil El ile Güncellendiğinde
  const handleSaveProfile = async (newProfile: StudentProfileEntity) => {
    const res = await fetchFromBackend('/profile/settings', 'PUT', newProfile);
    if (res.success) {
      setProfile(res.data);
      triggerToast('Profil ayarlarınız başarıyla el ile güncellendi.');
    }
  };

  // Mesaj Gönderildiğinde (API-First Çift AI Akışı)
  const handleSendMessage = async (text: string) => {
    // 1. Öğrenci mesajını ekrana bas
    const userMsgId = `msg_usr_${Date.now()}`;
    const newUserMessage: AIMessageEntity = {
      id: userMsgId,
      conversation_id: 'conv_1',
      sender_role: 'user',
      content: text,
      created_at: new Date(),
      tokens_used: Math.ceil(text.length / 4)
    };

    const updatedMessages = [...chatMessages, newUserMessage];
    setMessages(updatedMessages);

    // 2. Mesajı API üzerinden Backend'e gönder
    const res = await fetchFromBackend('/chat/message', 'POST', { message: text });
    if (res.success) {
      const { response, profileUpdates, newProfile } = res.data;

      // Eğer AI-1 sessizce profilde yeni bir şey saptadıysa, profil state'ini güncelle ve bildir
      if (profileUpdates) {
        setProfile(newProfile);
        const fieldsStr = Object.keys(profileUpdates).map(f => {
          if (f === 'prefers_morning') return 'Sabah Çalışma Alışkanlığı';
          if (f === 'prefers_night') return 'Gece Çalışma Alışkanlığı';
          if (f === 'weakest_lesson') return 'Zayıf Hissettiği Ders';
          if (f === 'strongest_lesson') return 'Güçlü Hissettiği Ders';
          if (f === 'target_department') return 'Hedeflenen Bölüm';
          if (f === 'target_university') return 'Hedeflenen Üniversite';
          return f;
        }).join(', ');
        triggerToast(`✨ [AI-1 Analizi] Mesajınızdan yeni bir bilgi saptandı ve profiliniz otomatik güncellendi: ${fieldsStr}`);
      }

      // 3. Premium Yazma Akışı Simülasyonu (Streaming effect)
      const assistantMsgId = `msg_ai_${Date.now()}`;
      const newAssistantMessage: AIMessageEntity = {
        id: assistantMsgId,
        conversation_id: 'conv_1',
        sender_role: 'assistant',
        content: '',
        created_at: new Date(),
        tokens_used: Math.ceil(response.length / 4) + 150
      };

      setMessages([...updatedMessages, newAssistantMessage]);

      let charIndex = 0;
      const interval = setInterval(() => {
        charIndex += 4;
        const chunk = response.slice(0, charIndex);

        setMessages((prev) =>
          prev.map(m => m.id === assistantMsgId ? { ...m, content: chunk } : m)
        );

        if (charIndex >= response.length) {
          clearInterval(interval);
        }
      }, 15);
    } else {
      triggerToast(`Hata: ${res.error?.message || 'Mesaj gönderilemedi.'}`);
    }
  };

  const handleRegenerate = () => {
    if (chatMessages.length > 1) {
      const lastUserMessage = [...chatMessages].reverse().find(m => m.sender_role === 'user');
      if (lastUserMessage) {
        handleSendMessage(lastUserMessage.content);
      }
    }
  };

  if (!profile) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-mono">Veriler Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row font-sans pb-20 md:pb-0 relative overflow-hidden">
      {/* Premium Bildirim Toasts */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 max-w-sm bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl text-sm leading-relaxed transition-all duration-300 animate-slide-in">
          {toastMessage}
        </div>
      )}

      {/* 1. MASAÜSTÜ SIDEBAR (Desktop Sidebar Layout) */}
      {screen !== 'landing' && screen !== 'onboarding' && (
        <aside className="w-64 border-r border-white/10 bg-slate-900/40 backdrop-blur-md p-6 space-y-8 hidden md:flex flex-col justify-between h-screen sticky top-0">
          <div className="space-y-8">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setScreen('dashboard')}>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-mono">COACH.AI</span>
              <span className="bg-purple-500/10 text-purple-400 text-[9px] px-1.5 py-0.5 rounded border border-purple-500/20 font-bold uppercase">STUDENT</span>
            </div>

            <div className="space-y-1.5 text-sm">
              {[
                { id: 'dashboard', label: 'Ana Dashboard', icon: '📊' },
                { id: 'chat', label: 'AI Koç Sohbeti', icon: '💬' },
                { id: 'lessons', label: 'Derslerim', icon: '📚' },
                { id: 'settings', label: 'Profil Ayarlarım', icon: '⚙️' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setScreen(item.id as any)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 font-semibold ${screen === item.id ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'}`}
                >
                  <span>{item.icon}</span> {item.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setScreen('landing')}
            className="w-full bg-white/5 border border-white/10 hover:bg-white/10 py-2.5 rounded-xl text-xs text-slate-300 transition-colors"
          >
            Sistemden Çıkış Yap
          </button>
        </aside>
      )}

      {/* 2. MOBİL ALT GEZİNTİ BARBARI (Mobile Bottom Navigation Bar) */}
      {screen !== 'landing' && screen !== 'onboarding' && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-slate-900/90 backdrop-blur-lg border-t border-white/10 flex justify-around items-center py-2 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
          {[
            { id: 'dashboard', label: 'Panel', icon: '📊' },
            { id: 'chat', label: 'Koç', icon: '💬' },
            { id: 'lessons', label: 'Dersler', icon: '📚' },
            { id: 'settings', label: 'Ayarlar', icon: '⚙️' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setScreen(item.id as any)}
              className={`flex flex-col items-center gap-1 transition-all ${screen === item.id ? 'text-purple-400 scale-105 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
        </nav>
      )}

      {/* Ana Ekran Geçiş Alanı */}
      <div className="flex-1 overflow-y-auto">
        {screen === 'landing' && <LandingPage onGetStarted={() => setScreen('onboarding')} />}
        {screen === 'onboarding' && <OnboardingWizard onComplete={handleOnboardingComplete} />}
        {screen === 'dashboard' && (
          <MainDashboardView
            profile={profile}
            lessons={lessons}
            onNavigateToLessons={() => setScreen('lessons')}
          />
        )}
        {screen === 'lessons' && (
          <LessonsManagementView
            lessons={lessons}
            onAddLesson={handleAddLesson}
          />
        )}
        {screen === 'chat' && (
          <PremiumChatView
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            onRegenerate={handleRegenerate}
          />
        )}
        {screen === 'settings' && (
          <StudentProfileSettingsView
            profile={profile}
            onSaveProfile={handleSaveProfile}
          />
        )}
      </div>
    </div>
  );
};
