/**
 * @file apps/backend/index.ts
 * @description SaaS Student Coach Platformu Backend API Sunucusu / Route Dispatcher.
 * Clean Architecture ve API-First yaklaşımlarına uygun olarak geliştirilmiştir.
 * Tüm veritabanı (Supabase) ve yapay zekâ (DualAIEngine) işlemleri burada yürütülür.
 * Frontend kesinlikle veritabanı veya yapay zekâ kütüphanelerine doğrudan erişmez; API üzerinden haberleşir.
 */

import {
  APIResponse,
  APIErrorResponse,
  StudentProfileEntity,
  LessonEntity
} from '@saas-coach/types';
import { AuthServiceFactory } from '@saas-coach/auth';
import { DatabaseFactory } from '@saas-coach/database';
import { DualAIEngine, TokenEconomyEngine } from '@saas-coach/ai';
import { sanitizeInput, ErrorCodes } from '@saas-coach/utils';

// --- API RESPONSE FORMATTERS ---

export function sendSuccess<T>(data: T, message?: string, meta?: Record<string, any>): APIResponse<T> {
  return {
    success: true,
    data,
    message,
    meta,
    timestamp: new Date().toISOString()
  };
}

export function sendError(code: string, message: string, details?: any[]): APIErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      details
    },
    timestamp: new Date().toISOString()
  };
}

// --- CENTRALIZED BACKEND API GATEWAY ---

export class BackendApiService {
  private static authService = AuthServiceFactory.create('firebase');
  private static dbAdapter = DatabaseFactory.create('supabase');
  private static aiEngine = new DualAIEngine();

  /**
   * Birleştirilmiş HTTP/REST Router simülasyonu.
   * Frontend'den gelen istekleri karşılayarak ilgili katmanlara yönlendirir.
   */
  static async request(
    route: string,
    method: 'GET' | 'POST' | 'PUT',
    body?: any,
    userId = 'default_student_user',
    clientIp = '127.0.0.1'
  ): Promise<any> {
    console.log(`[Backend API Request] Route: ${route} | Method: ${method} | User: ${userId}`);

    try {
      // 1. GİRİŞ ENDPOINT'İ (/api/v1/auth/login)
      if (route === '/api/v1/auth/login' && method === 'POST') {
        const { email, password } = body || {};
        if (!email || !password) {
          return sendError(ErrorCodes.AUTH_INVALID_CREDENTIALS, 'E-posta ve şifre zorunludur.');
        }
        const session = await this.authService.signInWithEmail(sanitizeInput(email), password);
        await this.dbAdapter.logAction(session.userId, 'login_success', { email }, clientIp);
        return sendSuccess(session, 'Giriş başarılı.');
      }

      // 2. PROFİL AYARLARINI GETİRME (GET /api/v1/profile/settings)
      if (route === '/api/v1/profile/settings' && method === 'GET') {
        const profile = await this.dbAdapter.findProfileByUserId(userId);
        if (!profile) {
          return sendError(ErrorCodes.USER_NOT_FOUND, 'Öğrenci profili bulunamadı.');
        }
        return sendSuccess(profile);
      }

      // 3. PROFİL AYARLARINI GÜNCELLEME (PUT /api/v1/profile/settings)
      if (route === '/api/v1/profile/settings' && method === 'PUT') {
        const currentProfile = await this.dbAdapter.findProfileByUserId(userId);
        if (!currentProfile) {
          return sendError(ErrorCodes.USER_NOT_FOUND, 'Öğrenci profili bulunamadı.');
        }
        const updatedProfile: StudentProfileEntity = {
          ...currentProfile,
          ...body,
          updated_at: new Date(),
          version: currentProfile.version + 1
        };
        const saved = await this.dbAdapter.saveProfile(updatedProfile);
        await this.dbAdapter.logAction(userId, 'settings_updated_manually', { keys: Object.keys(body || {}) }, clientIp);
        return sendSuccess(saved, 'Profil ayarları başarıyla kaydedildi.');
      }

      // 4. DERSLERİ GETİRME (GET /api/v1/lessons)
      if (route === '/api/v1/lessons' && method === 'GET') {
        const list = await this.dbAdapter.findAllByUserId(userId);
        return sendSuccess(list);
      }

      // 5. DERS EKLEME (POST /api/v1/lessons)
      if (route === '/api/v1/lessons' && method === 'POST') {
        const { name } = body || {};
        if (!name) {
          return sendError(ErrorCodes.SYSTEM_UNEXPECTED, 'Ders adı boş olamaz.');
        }
        const newLesson: LessonEntity = {
          id: `lesson_${Math.random().toString(36).substr(2, 9)}`,
          user_id: userId,
          name: sanitizeInput(name),
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
          status: 'not_started'
        };
        const saved = await this.dbAdapter.saveLesson(newLesson);
        await this.dbAdapter.logAction(userId, 'lesson_added', { name }, clientIp);
        return sendSuccess(saved, 'Ders başarıyla oluşturuldu.');
      }

      // 6. CHATBOT MESAJ GÖNDERİMİ VE SESSİZ ÇİFT AI AKIŞI (POST /api/v1/chat/message)
      if (route === '/api/v1/chat/message' && method === 'POST') {
        const { message } = body || {};
        const cleanMsg = sanitizeInput(message || '');
        if (!cleanMsg) {
          return sendError(ErrorCodes.SYSTEM_UNEXPECTED, 'Mesaj içeriği boş olamaz.');
        }

        const profile = await this.dbAdapter.findProfileByUserId(userId);
        const lessons = await this.dbAdapter.findAllByUserId(userId);

        if (!profile) {
          return sendError(ErrorCodes.USER_NOT_FOUND, 'Kullanıcı profili bulunamadı.');
        }

        // Token bütçe kontrolü
        const wallet = { used_today: 4500, total_limit: 500000 };
        if (!TokenEconomyEngine.checkBudgetLimit(wallet.used_today, wallet.total_limit)) {
          return sendError(ErrorCodes.TOKEN_INSUFFICIENT, 'Yapay zekâ kullanım limitinizi aştınız.');
        }

        // AI-1: Profil Analiz Motoru (Sessiz Çalışma)
        const profileUpdates = await this.aiEngine.runProfileAnalysis(cleanMsg, profile);
        let updatedProfile = profile;
        if (Object.keys(profileUpdates).length > 0) {
          updatedProfile = {
            ...profile,
            ...profileUpdates,
            updated_at: new Date(),
            version: profile.version + 1
          };
          await this.dbAdapter.saveProfile(updatedProfile);
          await this.dbAdapter.logAction(userId, 'profile_auto_updated_by_ai', profileUpdates, clientIp);
        }

        // AI-2: Koç Motoru (Kişiselleştirilmiş Yanıt Üretimi)
        const coachResponse = await this.aiEngine.runCoachEngine(updatedProfile, lessons, cleanMsg);
        await this.dbAdapter.logAction(userId, 'chat_message_sent', { length: cleanMsg.length }, clientIp);

        return sendSuccess({
          response: coachResponse,
          profileUpdates: Object.keys(profileUpdates).length > 0 ? profileUpdates : null,
          newProfile: updatedProfile
        }, 'AI koç yanıtı başarıyla üretildi.');
      }

      return sendError(ErrorCodes.SYSTEM_UNEXPECTED, 'Endpoint veya HTTP Metodu desteklenmiyor.');
    } catch (err) {
      console.error('[Backend API Error]', err);
      return sendError(ErrorCodes.SYSTEM_UNEXPECTED, 'Beklenmeyen bir sunucu hatası oluştu.');
    }
  }
}
export { ErrorCodes };
