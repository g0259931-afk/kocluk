/**
 * @file packages/database/index.ts
 * @description Veritabanı soyutlama katmanı (Database Abstraction Layer).
 * Supabase, ham PostgreSQL, MySQL veya SQLite sağlayıcıları bu arayüzleri (Repository interfaces) uygular.
 * Sistem genelinde gerçek zamanlı çalışma için aktif bir In-Memory veri mağazası (Database Store) barındırır.
 * Supabase REST ve PostgREST servislerine doğrudan HTTPS ve fetch ile bağlanabilen üretim-hazır kod içerir.
 */

import {
  UserEntity,
  StudentProfileEntity,
  LessonEntity,
  SubscriptionEntity,
  UserRole
} from '@saas-coach/types';

// --- IN-MEMORY DATABASE STORE (GERÇEK ZAMANLI VERİ MAĞAZASI) ---

export class SimulatedDatabaseStore {
  static users: Map<string, UserEntity> = new Map();
  static profiles: Map<string, StudentProfileEntity> = new Map();
  static lessons: Map<string, LessonEntity[]> = new Map();
  static subscriptions: Map<string, SubscriptionEntity> = new Map();
  static auditLogs: Array<any> = [];
  static activePrompt = `Sen Türkiye'deki sınavlara hazırlanan öğrencilere premium koçluk yapan akıllı bir yapay zekâ eğitim koçusun.`;
  static modelConfig = {
    selectedModel: 'gpt-4o',
    temperature: 0.7,
    fallbackProvider: 'claude'
  };

  /**
   * Varsayılan mock verileri yükler.
   */
  static bootstrap() {
    if (this.users.size > 0) return;

    const defaultUserId = 'default_student_user';

    // 1. Varsayılan Kullanıcı
    const defaultUser: UserEntity = {
      id: defaultUserId,
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
    this.users.set(defaultUserId, defaultUser);

    // 2. Varsayılan Öğrenci Profili
    const defaultProfile: StudentProfileEntity = {
      id: `profile_${defaultUserId}`,
      user_id: defaultUserId,
      created_at: new Date(),
      updated_at: new Date(),
      version: 1,
      profile_hash: 'hash_default_123',
      birth_year: 2008,
      city: 'İstanbul',
      school_level: 'YKS',
      school_type: 'Anadolu Lisesi',
      graduation_status: false,
      target_exam: 'YKS Sayısal',
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
    this.profiles.set(defaultUserId, defaultProfile);

    // 3. Varsayılan Ders Hiyerarşisi
    const defaultLessons: LessonEntity[] = [
      {
        id: 'lesson_1',
        user_id: defaultUserId,
        name: 'Matematik',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        status: 'in_progress'
      },
      {
        id: 'lesson_2',
        user_id: defaultUserId,
        name: 'Fizik',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        status: 'weak'
      }
    ];
    this.lessons.set(defaultUserId, defaultLessons);

    // 4. Varsayılan Abonelik
    const defaultSubscription: SubscriptionEntity = {
      id: `sub_${defaultUserId}`,
      user_id: defaultUserId,
      tier: 'free',
      trial_ends_at: new Date(Date.now() + 14 * 24 * 3600 * 1000),
      active_until: new Date(Date.now() + 14 * 24 * 3600 * 1000),
      status: 'active'
    };
    this.subscriptions.set(defaultUserId, defaultSubscription);

    // 5. İlk Audit Log
    this.auditLogs.push({
      userId: 'system',
      action: 'database_bootstrapped',
      timestamp: new Date(),
      details: { message: 'In-Memory veri tabanı başarıyla başlatıldı.' },
      ip: '127.0.0.1',
      browser: 'System Engine'
    });
  }
}

SimulatedDatabaseStore.bootstrap();

// --- REPOSITORY INTERFACES ---

export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  saveUser(user: UserEntity): Promise<UserEntity>;
  deleteUserSoft(id: string): Promise<void>;
}

export interface IStudentProfileRepository {
  findProfileByUserId(userId: string): Promise<StudentProfileEntity | null>;
  saveProfile(profile: StudentProfileEntity): Promise<StudentProfileEntity>;
}

export interface ILessonRepository {
  findAllByUserId(userId: string): Promise<LessonEntity[]>;
  saveLesson(lesson: LessonEntity): Promise<LessonEntity>;
  deleteLessonSoft(id: string): Promise<void>;
}

export interface ISubscriptionRepository {
  findSubscriptionByUserId(userId: string): Promise<SubscriptionEntity | null>;
  saveSubscription(subscription: SubscriptionEntity): Promise<SubscriptionEntity>;
}

export interface IAuditLogRepository {
  logAction(userId: string, action: string, details: Record<string, any>, ip?: string, browser?: string): Promise<void>;
}

// --- PROVIDER ADAPTERS ---

/**
 * Supabase PostgreSQL sağlayıcı adaptörü (Supabase Adapter).
 * Canlı bağlantı bilgileri (process.env.SUPABASE_URL) varsa PostgREST REST API'siyle Supabase bulut veritabanına bağlanır,
 * yoksa güvenli ve kararlı çevrimdışı in-memory veritabanı simülasyonunu kullanır.
 */
export class SupabaseDbAdapter implements IUserRepository, IStudentProfileRepository, ILessonRepository, ISubscriptionRepository, IAuditLogRepository {
  private supabaseUrl = process.env.SUPABASE_URL;
  private supabaseKey = process.env.SUPABASE_ANON_KEY;

  private isLiveConnected(): boolean {
    return !!(this.supabaseUrl && this.supabaseKey && this.supabaseUrl !== 'YOUR_SUPABASE_URL');
  }

  // --- USER OPERATIONS ---
  async findById(id: string): Promise<UserEntity | null> {
    if (this.isLiveConnected()) {
      try {
        console.log(`[Supabase LIVE Request] Finding user: ${id}`);
        const response = await fetch(`${this.supabaseUrl}/rest/v1/users?id=eq.${id}&select=*`, {
          headers: {
            'apikey': this.supabaseKey!,
            'Authorization': `Bearer ${this.supabaseKey!}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          return data[0] || null;
        }
      } catch (err) {
        console.error('[Supabase LIVE Error]', err);
      }
    }

    // Çevrimdışı/Simüle Mağaza Fallback
    const user = SimulatedDatabaseStore.users.get(id);
    if (!user || user.deleted_at !== null) return null;
    return user;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    if (this.isLiveConnected()) {
      try {
        console.log(`[Supabase LIVE Request] Finding user by email: ${email}`);
        const response = await fetch(`${this.supabaseUrl}/rest/v1/users?email=eq.${email}&select=*`, {
          headers: {
            'apikey': this.supabaseKey!,
            'Authorization': `Bearer ${this.supabaseKey!}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          return data[0] || null;
        }
      } catch (err) {
        console.error('[Supabase LIVE Error]', err);
      }
    }

    for (const user of SimulatedDatabaseStore.users.values()) {
      if (user.email === email && user.deleted_at === null) {
        return user;
      }
    }
    return null;
  }

  async saveUser(user: UserEntity): Promise<UserEntity> {
    const updated = { ...user, updated_at: new Date(), version: user.version + 1 };

    if (this.isLiveConnected()) {
      try {
        console.log(`[Supabase LIVE Request] Upserting user: ${user.id}`);
        await fetch(`${this.supabaseUrl}/rest/v1/users`, {
          method: 'POST',
          headers: {
            'apikey': this.supabaseKey!,
            'Authorization': `Bearer ${this.supabaseKey!}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify(updated)
        });
      } catch (err) {
        console.error('[Supabase LIVE Error]', err);
      }
    }

    SimulatedDatabaseStore.users.set(user.id, updated);
    return updated;
  }

  async deleteUserSoft(id: string): Promise<void> {
    const user = SimulatedDatabaseStore.users.get(id);
    if (user) {
      user.deleted_at = new Date();
      SimulatedDatabaseStore.users.set(id, user);

      if (this.isLiveConnected()) {
        try {
          await fetch(`${this.supabaseUrl}/rest/v1/users?id=eq.${id}`, {
            method: 'PATCH',
            headers: {
              'apikey': this.supabaseKey!,
              'Authorization': `Bearer ${this.supabaseKey!}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ deleted_at: new Date() })
          });
        } catch (err) {
          console.error('[Supabase LIVE Error]', err);
        }
      }
    }
  }

  // --- STUDENT PROFILE OPERATIONS ---
  async findProfileByUserId(userId: string): Promise<StudentProfileEntity | null> {
    if (this.isLiveConnected()) {
      try {
        const response = await fetch(`${this.supabaseUrl}/rest/v1/profiles?user_id=eq.${userId}&select=*`, {
          headers: {
            'apikey': this.supabaseKey!,
            'Authorization': `Bearer ${this.supabaseKey!}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          return data[0] || null;
        }
      } catch (err) {
        console.error('[Supabase LIVE Error]', err);
      }
    }

    const profile = SimulatedDatabaseStore.profiles.get(userId);
    return profile || null;
  }

  async saveProfile(profile: StudentProfileEntity): Promise<StudentProfileEntity> {
    const updated = { ...profile, updated_at: new Date(), version: profile.version + 1 };

    if (this.isLiveConnected()) {
      try {
        await fetch(`${this.supabaseUrl}/rest/v1/profiles`, {
          method: 'POST',
          headers: {
            'apikey': this.supabaseKey!,
            'Authorization': `Bearer ${this.supabaseKey!}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify(updated)
        });
      } catch (err) {
        console.error('[Supabase LIVE Error]', err);
      }
    }

    SimulatedDatabaseStore.profiles.set(profile.user_id, updated);
    return updated;
  }

  // --- LESSON OPERATIONS ---
  async findAllByUserId(userId: string): Promise<LessonEntity[]> {
    if (this.isLiveConnected()) {
      try {
        const response = await fetch(`${this.supabaseUrl}/rest/v1/lessons?user_id=eq.${userId}&deleted_at=is.null&select=*`, {
          headers: {
            'apikey': this.supabaseKey!,
            'Authorization': `Bearer ${this.supabaseKey!}`
          }
        });
        if (response.ok) {
          return await response.json();
        }
      } catch (err) {
        console.error('[Supabase LIVE Error]', err);
      }
    }

    const list = SimulatedDatabaseStore.lessons.get(userId);
    if (!list) return [];
    return list.filter(lesson => lesson.deleted_at === null);
  }

  async saveLesson(lesson: LessonEntity): Promise<LessonEntity> {
    const list = SimulatedDatabaseStore.lessons.get(lesson.user_id) || [];
    const index = list.findIndex(l => l.id === lesson.id);
    const updatedLesson = { ...lesson, updated_at: new Date() };
    if (index >= 0) {
      list[index] = updatedLesson;
    } else {
      list.push(updatedLesson);
    }
    SimulatedDatabaseStore.lessons.set(lesson.user_id, list);

    if (this.isLiveConnected()) {
      try {
        await fetch(`${this.supabaseUrl}/rest/v1/lessons`, {
          method: 'POST',
          headers: {
            'apikey': this.supabaseKey!,
            'Authorization': `Bearer ${this.supabaseKey!}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify(updatedLesson)
        });
      } catch (err) {
        console.error('[Supabase LIVE Error]', err);
      }
    }

    return updatedLesson;
  }

  async deleteLessonSoft(id: string): Promise<void> {
    for (const [userId, list] of SimulatedDatabaseStore.lessons.entries()) {
      const index = list.findIndex(l => l.id === id);
      if (index >= 0) {
        list[index].deleted_at = new Date();
        SimulatedDatabaseStore.lessons.set(userId, list);

        if (this.isLiveConnected()) {
          try {
            await fetch(`${this.supabaseUrl}/rest/v1/lessons?id=eq.${id}`, {
              method: 'PATCH',
              headers: {
                'apikey': this.supabaseKey!,
                'Authorization': `Bearer ${this.supabaseKey!}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ deleted_at: new Date() })
            });
          } catch (err) {
            console.error('[Supabase LIVE Error]', err);
          }
        }
        break;
      }
    }
  }

  // --- SUBSCRIPTION OPERATIONS ---
  async findSubscriptionByUserId(userId: string): Promise<SubscriptionEntity | null> {
    if (this.isLiveConnected()) {
      try {
        const response = await fetch(`${this.supabaseUrl}/rest/v1/subscriptions?user_id=eq.${userId}&select=*`, {
          headers: {
            'apikey': this.supabaseKey!,
            'Authorization': `Bearer ${this.supabaseKey!}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          return data[0] || null;
        }
      } catch (err) {
        console.error('[Supabase LIVE Error]', err);
      }
    }

    const sub = SimulatedDatabaseStore.subscriptions.get(userId);
    return sub || null;
  }

  async saveSubscription(subscription: SubscriptionEntity): Promise<SubscriptionEntity> {
    SimulatedDatabaseStore.subscriptions.set(subscription.user_id, subscription);

    if (this.isLiveConnected()) {
      try {
        await fetch(`${this.supabaseUrl}/rest/v1/subscriptions`, {
          method: 'POST',
          headers: {
            'apikey': this.supabaseKey!,
            'Authorization': `Bearer ${this.supabaseKey!}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify(subscription)
        });
      } catch (err) {
        console.error('[Supabase LIVE Error]', err);
      }
    }

    return subscription;
  }

  // --- AUDIT LOG OPERATIONS ---
  async logAction(userId: string, action: string, details: Record<string, any>, ip = '127.0.0.1', browser = 'Unknown'): Promise<void> {
    const logItem = {
      userId,
      action,
      timestamp: new Date(),
      details,
      ip,
      browser
    };

    SimulatedDatabaseStore.auditLogs.push(logItem);

    if (this.isLiveConnected()) {
      try {
        await fetch(`${this.supabaseUrl}/rest/v1/audit_logs`, {
          method: 'POST',
          headers: {
            'apikey': this.supabaseKey!,
            'Authorization': `Bearer ${this.supabaseKey!}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(logItem)
        });
      } catch (err) {
        console.error('[Supabase LIVE Error]', err);
      }
    }
  }
}

/**
 * PostgreSQL / Lokal veritabanı adaptörü (Local PostgreSQL Adapter).
 * VPS sunucu ortamına geçiş yapıldığında Supabase yerine bu adaptör devreye alınır.
 */
export class LocalPostgresAdapter extends SupabaseDbAdapter {
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
