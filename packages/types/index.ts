/**
 * @file packages/types/index.ts
 * @description Proje genelinde kullanılacak ortak TypeScript tipleri ve veri yapıları tanımları.
 * Bu dosyadaki tüm tipler Clean Architecture ve DDD sınırlarına göre tasarlanmıştır.
 */

// --- KULLANICI VE ROLLER (USER & ROLES) ---

/**
 * Kullanıcı rolleri için Enum tanımı.
 */
export enum UserRole {
  FREE_USER = 'free_user',
  PREMIUM_USER = 'premium_user',
  ADMIN = 'admin'
}

/**
 * Detaylı yetkilendirme (RBAC) için izin listesi.
 */
export enum UserPermission {
  USER_READ = 'permission.user.read',
  USER_UPDATE = 'permission.user.update',
  USER_DELETE = 'permission.user.delete',
  AI_USE = 'permission.ai.use',
  AI_ADMIN = 'permission.ai.admin',
  PAYMENT_READ = 'permission.payment.read',
  ANALYTICS_READ = 'permission.analytics.read',
  SETTINGS_UPDATE = 'permission.settings.update',
  PROMPT_UPDATE = 'permission.prompt.update'
}

/**
 * Kullanıcı temel varlığı (User Entity)
 */
export interface UserEntity {
  id: string; // UUID v4 formatında benzersiz kimlik
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null; // Soft Delete desteği
  created_by: string;
  updated_by: string;
  version: number; // Optimizasyon ve versiyon kontrolü için
  status: 'active' | 'suspended' | 'pending';
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  emailVerified: boolean;
}

// --- STUDENT PROFILE ENGINE (50+ ALAN) ---

/**
 * Öğrenci profil alanlarının detaylı tanımı.
 * Yapay Zekâ (AI-1) tarafından otomatik ve sessizce doldurulabilir.
 */
export interface StudentProfileEntity {
  id: string;
  user_id: string; // User ile birebir ilişki
  created_at: Date;
  updated_at: Date;
  version: number;
  profile_hash: string; // Token optimizasyonu ve AI Context Cache takibi için

  // 1. Temel Bilgiler (Basic Information)
  birth_year: number | null;
  city: string | null;
  school_level: 'ilkokul' | 'ortaokul' | 'lise' | 'TYT' | 'AYT' | 'YKS' | 'üniversite' | 'mezun' | null;
  school_type: string | null; // Fen Lisesi, Anadolu Lisesi vb.
  graduation_status: boolean | null;

  // 2. Eğitim ve Sınav (Education & Target Exam)
  target_exam: string | null; // TYT, AYT, YKS, LGS, KPSS vb.
  target_university: string | null;
  target_department: string | null;
  current_net_score: number | null;
  target_net_score: number | null;
  strongest_lesson: string | null;
  weakest_lesson: string | null;

  // 3. Çalışma Alışkanlıkları (Study Habits)
  prefers_morning: boolean | null; // Sabah mı yoksa gece mi çalışıyor?
  prefers_night: boolean | null;
  avg_daily_study_minutes: number | null;
  break_frequency_minutes: number | null;
  phone_usage_level: 'low' | 'medium' | 'high' | null;
  study_environment: 'quiet' | 'music' | 'library' | 'group' | null;

  // 4. Psikolojik Analiz & Durum (Psychological Analysis)
  motivation_level: number | null; // 1-100 arası
  anxiety_level: number | null; // 1-100 arası
  self_confidence_level: number | null; // 1-100 arası
  stress_level: number | null; // 1-100 arası
  procrastination_tendency: number | null; // Erteleme alışkanlığı 1-100 arası
  focus_duration_minutes: number | null;
  discipline_score: number | null; // Disiplin puanı 1-100 arası

  // 5. Öğrenme Tarzı (Learning Style)
  prefers_visual: boolean | null; // Görsel öğrenme sever mi?
  prefers_auditory: boolean | null; // İşitsel öğrenme?
  prefers_writing: boolean | null; // Yazarak öğrenme?
  prefers_video: boolean | null; // Video izlemeyi tercih eder mi?
  prefers_pdf: boolean | null; // PDF doküman okumayı sever mi?
  prefers_tests: boolean | null; // Soru/Test çözmeyi sever mi?

  // 6. AI Hafıza Tercihleri (AI Memory & Tone Preference)
  preferred_tone: 'friendly' | 'formal' | 'strict' | 'coaching' | null; // Hitap üslubu
  emoji_allowed: boolean | null;
  detailed_answers: boolean | null;
  humor_allowed: boolean | null;
  preferred_address: string | null; // AI'ın hitap etmesini istediği isim

  // 7. Günlük Hayat (Daily Life)
  sleep_time: string | null; // "23:00" formatında
  wake_time: string | null; // "07:00" formatında
  does_sport: boolean | null;
  caffeine_intake_level: 'none' | 'low' | 'medium' | 'high' | null;
  weekly_free_hours: number | null;

  // Alanların Güven Skorları (Confidence Scores - 1-100 arası)
  confidence_scores: Record<string, number>;
}

// --- DERS VE KONU YAPISI (LESSON & TOPIC HIERARCHY) ---

export interface LessonEntity {
  id: string;
  user_id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  status: 'not_started' | 'in_progress' | 'review_required' | 'completed' | 'weak';
}

export interface TopicEntity {
  id: string;
  lesson_id: string;
  name: string;
  status: 'not_started' | 'in_progress' | 'review_required' | 'completed' | 'weak';
  created_at: Date;
  updated_at: Date;
}

export interface TaskEntity {
  id: string;
  topic_id: string;
  title: string;
  done: boolean;
  scheduled_date: Date | null;
  created_at: Date;
}

// --- CHAT VE AI YOLU (CHAT & AI PIPELINE) ---

export interface AIConversationEntity {
  id: string;
  user_id: string;
  title: string;
  created_at: Date;
  updated_at: Date;
  is_pinned: boolean;
  tags: string[];
}

export interface AIMessageEntity {
  id: string;
  conversation_id: string;
  sender_role: 'user' | 'assistant';
  content: string;
  created_at: Date;
  tokens_used: number;
}

// --- PREMIUM VE TOKEN SİSTEMİ (PREMIUM & TOKENS) ---

export interface SubscriptionEntity {
  id: string;
  user_id: string;
  tier: 'free' | 'starter' | 'pro' | 'enterprise';
  trial_ends_at: Date;
  active_until: Date;
  status: 'active' | 'cancelled' | 'expired';
}

export interface TokenWalletEntity {
  id: string;
  user_id: string;
  total_limit: number;
  used_this_month: number;
  used_today: number;
  remaining_tokens: number;
  last_updated_at: Date;
}

// --- ORTAK API CEVAP FORMATI (STANDARDIZED API RESPONSE) ---

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: Record<string, any>;
  timestamp: string;
}

export interface APIErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any[];
  };
  timestamp: string;
}
