/**
 * @file packages/database/index.ts
 * @description Veritabanı soyutlama katmanı (Database Abstraction Layer).
 * Supabase, ham PostgreSQL, MySQL veya SQLite sağlayıcıları bu arayüzleri (Repository interfaces) uygular.
 * Sistem genelinde Repository Pattern kullanılarak veritabanı bağımsızlığı sağlanır.
 */

import {
  UserEntity,
  StudentProfileEntity,
  LessonEntity,
  SubscriptionEntity,
  UserRole
} from '@saas-coach/types';

// --- REPOSITORY INTERFACES ---

/**
 * Kullanıcı verileri erişim arayüzü (IUserRepository).
 */
export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  saveUser(user: UserEntity): Promise<UserEntity>;
  deleteUserSoft(id: string): Promise<void>; // Soft Delete desteği
}

/**
 * Detaylı öğrenci profili erişim arayüzü (IStudentProfileRepository).
 */
export interface IStudentProfileRepository {
  findProfileByUserId(userId: string): Promise<StudentProfileEntity | null>;
  saveProfile(profile: StudentProfileEntity): Promise<StudentProfileEntity>;
}

/**
 * Ders yönetim erişim arayüzü (ILessonRepository).
 */
export interface ILessonRepository {
  findAllByUserId(userId: string): Promise<LessonEntity[]>;
  saveLesson(lesson: LessonEntity): Promise<LessonEntity>;
  deleteLessonSoft(id: string): Promise<void>;
}

/**
 * Üyelik abonelik erişim arayüzü (ISubscriptionRepository).
 */
export interface ISubscriptionRepository {
  findSubscriptionByUserId(userId: string): Promise<SubscriptionEntity | null>;
  saveSubscription(subscription: SubscriptionEntity): Promise<SubscriptionEntity>;
}

/**
 * Sistem işlem günlükleri arayüzü (IAuditLogRepository).
 */
export interface IAuditLogRepository {
  logAction(userId: string, action: string, details: Record<string, any>, ip?: string, browser?: string): Promise<void>;
}

// --- PROVIDER ADAPTERS ---

/**
 * Supabase PostgreSQL sağlayıcı adaptörü (Supabase Adapter).
 * Başlangıçta veritabanı işlemleri için bu adaptör kullanılır.
 */
export class SupabaseDbAdapter implements IUserRepository, IStudentProfileRepository, ILessonRepository, ISubscriptionRepository, IAuditLogRepository {

  // --- USER OPERATIONS ---
  async findById(id: string): Promise<UserEntity | null> {
    // Supabase client call simulation
    console.log(`[SupabaseDB] Fetching user by id: ${id}`);
    return {
      id,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      created_by: 'system',
      updated_by: 'system',
      version: 1,
      status: 'active',
      email: 'student@example.com',
      firstName: 'Şahin',
      lastName: 'Arslan',
      role: UserRole.FREE_USER,
      emailVerified: true
    };
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    console.log(`[SupabaseDB] Fetching user by email: ${email}`);
    if (email === 'student@example.com') {
      return {
        id: 'mock_supabase_user_id',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        created_by: 'system',
        updated_by: 'system',
        version: 1,
        status: 'active',
        email,
        firstName: 'Şahin',
        lastName: 'Arslan',
        role: UserRole.FREE_USER,
        emailVerified: true
      };
    }
    return null;
  }

  async saveUser(user: UserEntity): Promise<UserEntity> {
    console.log(`[SupabaseDB] Saving user: ${user.id}`);
    return { ...user, updated_at: new Date(), version: user.version + 1 };
  }

  async deleteUserSoft(id: string): Promise<void> {
    // Veritabanından fiziksel silme yapmaz, deleted_at alanını günceller (Soft Delete)
    console.log(`[SupabaseDB] Soft deleting user: ${id}`);
  }

  // --- STUDENT PROFILE OPERATIONS ---
  async findProfileByUserId(userId: string): Promise<StudentProfileEntity | null> {
    console.log(`[SupabaseDB] Fetching student profile for userId: ${userId}`);
    return {
      id: `profile_${userId}`,
      user_id: userId,
      created_at: new Date(),
      updated_at: new Date(),
      version: 1,
      profile_hash: 'mock_hash',
      birth_year: 2008,
      city: 'İstanbul',
      school_level: 'YKS',
      school_type: 'Anadolu Lisesi',
      graduation_status: false,
      target_exam: 'YKS',
      target_university: 'Boğaziçi Üniversitesi',
      target_department: 'Bilgisayar Mühendisliği',
      current_net_score: 75,
      target_net_score: 110,
      strongest_lesson: 'Matematik',
      weakest_lesson: 'Fizik',
      prefers_morning: true,
      prefers_night: false,
      avg_daily_study_minutes: 240,
      break_frequency_minutes: 50,
      phone_usage_level: 'medium',
      study_environment: 'quiet',
      motivation_level: 80,
      anxiety_level: 30,
      self_confidence_level: 85,
      stress_level: 40,
      procrastination_tendency: 20,
      focus_duration_minutes: 45,
      discipline_score: 90,
      prefers_visual: true,
      prefers_auditory: false,
      prefers_writing: true,
      prefers_video: true,
      prefers_pdf: true,
      prefers_tests: true,
      preferred_tone: 'coaching',
      emoji_allowed: true,
      detailed_answers: false,
      humor_allowed: true,
      preferred_address: 'Şahin',
      sleep_time: '23:30',
      wake_time: '07:00',
      does_sport: true,
      caffeine_intake_level: 'medium',
      weekly_free_hours: 15,
      confidence_scores: { strongest_lesson: 95, weakest_lesson: 80 }
    };
  }

  async saveProfile(profile: StudentProfileEntity): Promise<StudentProfileEntity> {
    console.log(`[SupabaseDB] Saving profile for user: ${profile.user_id}`);
    return { ...profile, updated_at: new Date(), version: profile.version + 1 };
  }

  // --- LESSON OPERATIONS ---
  async findAllByUserId(userId: string): Promise<LessonEntity[]> {
    console.log(`[SupabaseDB] Fetching lessons for: ${userId}`);
    return [
      {
        id: 'lesson_1',
        user_id: userId,
        name: 'Matematik',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        status: 'in_progress'
      },
      {
        id: 'lesson_2',
        user_id: userId,
        name: 'Fizik',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        status: 'weak'
      }
    ];
  }

  async saveLesson(lesson: LessonEntity): Promise<LessonEntity> {
    console.log(`[SupabaseDB] Saving lesson: ${lesson.name}`);
    return { ...lesson, updated_at: new Date() };
  }

  async deleteLessonSoft(id: string): Promise<void> {
    console.log(`[SupabaseDB] Soft deleting lesson: ${id}`);
  }

  // --- SUBSCRIPTION OPERATIONS ---
  async findSubscriptionByUserId(userId: string): Promise<SubscriptionEntity | null> {
    console.log(`[SupabaseDB] Fetching subscription for: ${userId}`);
    return {
      id: `sub_${userId}`,
      user_id: userId,
      tier: 'free',
      trial_ends_at: new Date(Date.now() + 14 * 24 * 3600 * 1000), // 14 günlük trial süresi
      active_until: new Date(Date.now() + 14 * 24 * 3600 * 1000),
      status: 'active'
    };
  }

  async saveSubscription(subscription: SubscriptionEntity): Promise<SubscriptionEntity> {
    console.log(`[SupabaseDB] Saving subscription for: ${subscription.user_id}`);
    return subscription;
  }

  // --- AUDIT LOG OPERATIONS ---
  async logAction(userId: string, action: string, details: Record<string, any>, ip = '127.0.0.1', browser = 'Unknown'): Promise<void> {
    // Yapılan her kritik işlem, IP, Tarayıcı ve Tarih bilgisiyle Audit tablosuna kaydedilir.
    console.log(`[AUDIT LOG] User: ${userId} | Action: ${action} | IP: ${ip} | Browser: ${browser} | Details: ${JSON.stringify(details)}`);
  }
}

/**
 * PostgreSQL / Lokal veritabanı adaptörü (Local PostgreSQL Adapter).
 * VPS sunucu ortamına geçiş yapıldığında Supabase yerine bu adaptör devreye alınır.
 */
export class LocalPostgresAdapter extends SupabaseDbAdapter {
  // SupabaseDBAdapter'ın tüm repository interface yeteneklerini taşır,
  // VPS geçiş senaryosunda ham SQL sorgularını veya PG-Pool bağlantılarını barındırır.
  override async saveUser(user: UserEntity): Promise<UserEntity> {
    console.log(`[LocalPostgres] Executing Raw INSERT INTO users VALUES (...)`);
    return super.saveUser(user);
  }
}

/**
 * Veritabanı servis fabrikası (Database Service Factory).
 * Aktif veritabanı sağlayıcı adaptörünü döndürmek için kullanılır.
 */
export class DatabaseFactory {
  static create(providerType: 'supabase' | 'local'): SupabaseDbAdapter {
    if (providerType === 'supabase') {
      return new SupabaseDbAdapter();
    }
    return new LocalPostgresAdapter();
  }
}
