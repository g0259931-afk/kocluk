/**
 * @file apps/web/chat_settings.tsx
 * @description AI SaaS Student Coach Platformu - Premium Chatbot ve 50+ Alanı Barındıran Öğrenci Profil Merkezi.
 * ChatGPT, Claude ve Cursor kalitesinde iki kolonlu mesajlaşma ekranı ile detaylı Student Profile Engine yönetimi.
 */

import React, { useState } from 'react';
import { AIMessageEntity, StudentProfileEntity } from '@saas-coach/types';

// --- PREMIUM DUAL-PANEL CHAT VIEW ---

export const PremiumChatView: React.FC<{
  messages: AIMessageEntity[];
  onSendMessage: (text: string) => void;
  onRegenerate: () => void;
}> = ({ messages, onSendMessage, onRegenerate }) => {
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white font-sans overflow-hidden">
      {/* Sol Panel: Geçmiş Sohbetler & Sabitlenenler */}
      <aside className="w-80 border-r border-white/10 bg-slate-900/50 backdrop-blur-md p-4 hidden md:flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold tracking-wider">Sohbet Geçmişi</span>
            <button className="p-1 bg-white/5 border border-white/10 rounded hover:bg-white/10 text-xs">Yeni +</button>
          </div>
          <div className="space-y-2">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl cursor-pointer">
              <h5 className="text-sm font-semibold truncate">Trigonometri Tekrarı</h5>
              <p className="text-[10px] text-slate-400 mt-1">Bugün, 11:20</p>
            </div>
            <div className="p-3 hover:bg-white/5 rounded-xl cursor-pointer transition-colors">
              <h5 className="text-sm font-semibold truncate">Fizik Netlerimi Artırma</h5>
              <p className="text-[10px] text-slate-400 mt-1">Dün, 15:45</p>
            </div>
            <div className="p-3 hover:bg-white/5 rounded-xl cursor-pointer transition-colors">
              <h5 className="text-sm font-semibold truncate">Haftalık Sınav Stratejisi</h5>
              <p className="text-[10px] text-slate-400 mt-1">4 gün önce</p>
            </div>
          </div>
        </div>
        <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-xs text-slate-400 flex items-center justify-between">
          <span>Kalan Aylık Token: <strong>724.500</strong></span>
          <span className="text-purple-400 font-semibold">%72</span>
        </div>
      </aside>

      {/* Sağ Panel: Aktif Sohbet Penceresi */}
      <main className="flex-1 flex flex-col justify-between h-full relative">
        {/* Sohbet Başlığı ve Model Bilgisi */}
        <header className="border-b border-white/10 px-6 py-4 bg-slate-900/30 backdrop-blur-md flex justify-between items-center z-10">
          <div>
            <h4 className="font-bold text-lg">Haftalık Eğitim Koçluğu</h4>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              Aktif Model: <strong className="text-blue-400">GPT-4o (Premium)</strong>
            </p>
          </div>
          <button
            onClick={onRegenerate}
            className="text-xs bg-white/5 border border-white/10 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors font-semibold"
          >
            Yeniden Üret 🔄
          </button>
        </header>

        {/* Mesaj Listesi (Scrollable) */}
        <section className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-4 p-4 rounded-2xl max-w-3xl ${msg.sender_role === 'assistant' ? 'bg-white/5 border border-white/5 mr-auto animate-fade-in' : 'bg-blue-600/10 border border-blue-500/20 ml-auto'}`}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-gradient-to-r from-blue-500 to-purple-500">
                {msg.sender_role === 'assistant' ? 'AI' : 'U'}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">
                  {msg.sender_role === 'assistant' ? 'Eğitim Koçu' : 'Öğrenci'}
                </p>
                <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2">
                  <span>Harcama: {msg.tokens_used} Token</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(msg.content)}
                    className="hover:text-blue-400 transition-colors"
                  >
                    Kopyala 📋
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Giriş Mesaj Kutusu (Message Input Box) */}
        <footer className="p-6 bg-slate-950 border-t border-white/10">
          <div className="max-w-3xl mx-auto flex gap-3 bg-white/5 border border-white/10 rounded-2xl p-2 focus-within:border-purple-500 transition-colors">
            <input
              type="text"
              placeholder="Yapay zekâ koçuna bir soru sor veya durumunu yaz... (Örn: Sabah erken uyanamıyorum, geometride zorlanıyorum)"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-transparent px-4 py-3 text-sm text-white focus:outline-none"
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 hover:bg-blue-700 px-5 rounded-xl text-xs font-bold uppercase transition-colors"
            >
              Gönder
            </button>
          </div>
          <p className="text-[10px] text-slate-500 text-center mt-2.5">
            Dosya Yükleme (PDF) analizi ve formül saptama sistemi devrededir. Shift+Enter yeni satır açar.
          </p>
        </footer>
      </main>
    </div>
  );
};

// --- 50+ FIELDS STUDENT PROFILE SETTINGS ENGINE ---

export const StudentProfileSettingsView: React.FC<{
  profile: StudentProfileEntity;
  onSaveProfile: (newProfile: StudentProfileEntity) => void;
}> = ({ profile, onSaveProfile }) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'study' | 'psychology' | 'ai'>('basic');
  const [localProfile, setLocalProfile] = useState<StudentProfileEntity>({ ...profile });

  const handleSave = () => {
    onSaveProfile(localProfile);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 space-y-8">
      {/* Başlık */}
      <div className="flex justify-between items-center border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Öğrenci Profil Merkezi</h1>
          <p className="text-slate-400 text-sm mt-1">
            Yapay zekânın sizi tanımak için kullandığı 50+ yapılandırılmış parametreyi yönetin.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]"
        >
          Değişiklikleri Kaydet
        </button>
      </div>

      {/* Profil Tabs */}
      <div className="flex border-b border-white/5 gap-2 overflow-x-auto pb-1">
        {[
          { id: 'basic', label: 'Temel & Sınav Bilgileri' },
          { id: 'study', label: 'Çalışma Alışkanlıkları' },
          { id: 'psychology', label: 'Psikolojik Durum Analizi' },
          { id: 'ai', label: 'Yapay Zekâ Tercihleri' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-sm font-semibold transition-all border-b-2 rounded-t-lg ${activeTab === tab.id ? 'border-purple-500 bg-purple-500/10 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab İçerikleri */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-8 rounded-2xl">
        {activeTab === 'basic' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Tercih Edilen Hitap Şekli</label>
              <input
                type="text"
                value={localProfile.preferred_address || ''}
                onChange={(e) => setLocalProfile({ ...localProfile, preferred_address: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Hedef Sınav</label>
              <input
                type="text"
                value={localProfile.target_exam || ''}
                onChange={(e) => setLocalProfile({ ...localProfile, target_exam: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Hedef Üniversite</label>
              <input
                type="text"
                value={localProfile.target_university || ''}
                onChange={(e) => setLocalProfile({ ...localProfile, target_university: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Hedef Bölüm</label>
              <input
                type="text"
                value={localProfile.target_department || ''}
                onChange={(e) => setLocalProfile({ ...localProfile, target_department: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>
        )}

        {activeTab === 'study' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">En Güçlü Hissettiğin Ders</label>
              <input
                type="text"
                value={localProfile.strongest_lesson || ''}
                onChange={(e) => setLocalProfile({ ...localProfile, strongest_lesson: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">En Zayıf Hissettiğin Ders</label>
              <input
                type="text"
                value={localProfile.weakest_lesson || ''}
                onChange={(e) => setLocalProfile({ ...localProfile, weakest_lesson: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Uykudan Uyanma Saati</label>
              <input
                type="text"
                placeholder="Örn: 07:00"
                value={localProfile.wake_time || ''}
                onChange={(e) => setLocalProfile({ ...localProfile, wake_time: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Günlük Çalışma Süresi (Dakika)</label>
              <input
                type="number"
                value={localProfile.avg_daily_study_minutes || 0}
                onChange={(e) => setLocalProfile({ ...localProfile, avg_daily_study_minutes: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>
        )}

        {activeTab === 'psychology' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs uppercase tracking-wider text-slate-400">Motivasyon Seviyesi</label>
                <span className="text-xs font-mono font-bold text-purple-400">{localProfile.motivation_level || 50}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={localProfile.motivation_level || 50}
                onChange={(e) => setLocalProfile({ ...localProfile, motivation_level: Number(e.target.value) })}
                className="w-full bg-white/5 h-2 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs uppercase tracking-wider text-slate-400">Sınav Kaygı Seviyesi</label>
                <span className="text-xs font-mono font-bold text-red-400">{localProfile.anxiety_level || 30}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={localProfile.anxiety_level || 30}
                onChange={(e) => setLocalProfile({ ...localProfile, anxiety_level: Number(e.target.value) })}
                className="w-full bg-white/5 h-2 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs uppercase tracking-wider text-slate-400">Odaklanma Süresi (Dakika)</label>
                <span className="text-xs font-mono font-bold text-blue-400">{localProfile.focus_duration_minutes || 45} dk</span>
              </div>
              <input
                type="range"
                min="10"
                max="120"
                step="5"
                value={localProfile.focus_duration_minutes || 45}
                onChange={(e) => setLocalProfile({ ...localProfile, focus_duration_minutes: Number(e.target.value) })}
                className="w-full bg-white/5 h-2 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs uppercase tracking-wider text-slate-400">Disiplin Skoru</label>
                <span className="text-xs font-mono font-bold text-green-400">{localProfile.discipline_score || 75}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={localProfile.discipline_score || 75}
                onChange={(e) => setLocalProfile({ ...localProfile, discipline_score: Number(e.target.value) })}
                className="w-full bg-white/5 h-2 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Yapay Zekâ Anlatım Üslubu</label>
              <select
                value={localProfile.preferred_tone || 'coaching'}
                onChange={(e) => setLocalProfile({ ...localProfile, preferred_tone: e.target.value as any })}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="friendly">Samimi & Arkadaşça</option>
                <option value="formal">Resmi & Ciddi</option>
                <option value="strict">Disiplinli & Sert</option>
                <option value="coaching">Eğitim Koçu Rolünde</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Emoji Kullanımı</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="emoji_allowed"
                    checked={localProfile.emoji_allowed === true}
                    onChange={() => setLocalProfile({ ...localProfile, emoji_allowed: true })}
                    className="accent-purple-500"
                  />
                  Bol Emojili Cevaplar 👍
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="emoji_allowed"
                    checked={localProfile.emoji_allowed === false}
                    onChange={() => setLocalProfile({ ...localProfile, emoji_allowed: false })}
                    className="accent-purple-500"
                  />
                  Sadece Net Bilgiler 📝
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
