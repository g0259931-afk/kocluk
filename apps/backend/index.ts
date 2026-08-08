/**
 * @file apps/backend/index.ts
 * @description SaaS Student Coach Platformu Backend API Katmanı.
 * Clean Architecture ve API-First yaklaşımlarına uygun olarak geliştirilmiştir.
 * Tüm HTTP isteklerini standardlaştırılmış JSON formatında karşılar ve yanıtlar.
 */

import {
  APIResponse,
  APIErrorResponse,
  UserRole,
  StudentProfileEntity,
  UserEntity
} from '@saas-coach/types';
import { AuthServiceFactory } from '@saas-coach/auth';
import { DatabaseFactory } from '@saas-coach/database';
import { DualAIEngine, TokenEconomyEngine } from '@saas-coach/ai';
import { sanitizeInput, ErrorCodes } from '@saas-coach/utils';

// --- MIDDLEWARES & HELPERS ---

/**
 * Standardize başarılı API cevabı üreten yardımcı fonksiyon.
 */
export function sendSuccess<T>(data: T, message?: string, meta?: Record<string, any>): APIResponse<T> {
  return {
    success: true,
    data,
    message,
    meta,
    timestamp: new Date().toISOString()
  };
}

/**
 * Standardize hatalı API cevabı üreten yardımcı fonksiyon.
 */
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

/**
 * Rate limiting kontrolü simülasyonu.
 */
export class RateLimiter {
  private static store: Record<string, number[]> = {};

  static checkLimit(clientIp: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    if (!this.store[clientIp]) {
      this.store[clientIp] = [];
    }
    // Süresi dolan istekleri temizle
    this.store[clientIp] = this.store[clientIp].filter(timestamp => now - timestamp < windowMs);

    if (this.store[clientIp].length >= limit) {
      return false; // Limit aşıldı
    }
    this.store[clientIp].push(now);
    return true;
  }
}

// --- API CONTROLLERS ---

export class BackendApiController {
  private authService = AuthServiceFactory.create('firebase');
  private dbAdapter = DatabaseFactory.create('supabase');
  private aiEngine = new DualAIEngine();

  /**
   * POST /api/v1/auth/login
   * E-posta ve şifre ile oturum açma endpoint'i.
   */
  async handleLogin(reqBody: any, clientIp: string): Promise<APIResponse | APIErrorResponse> {
    // 1. Rate Limit Kontrolü (Dakikada maks 5 istek)
    if (!RateLimiter.checkLimit(clientIp, 5, 60 * 1000)) {
      return sendError(ErrorCodes.AUTH_UNAUTHORIZED, 'Çok fazla giriş denemesi yapıldı. Lütfen daha sonra tekrar deneyin.');
    }

    const { email, password } = reqBody;
    if (!email || !password) {
      return sendError(ErrorCodes.AUTH_INVALID_CREDENTIALS, 'E-posta ve şifre alanları zorunludur.');
    }

    try {
      const session = await this.authService.signInWithEmail(sanitizeInput(email), password);
      await this.dbAdapter.logAction(session.userId, 'login_success', { email }, clientIp);
      return sendSuccess(session, 'Giriş işlemi başarıyla tamamlandı.');
    } catch (err) {
      return sendError(ErrorCodes.AUTH_INVALID_CREDENTIALS, 'Geçersiz e-posta adresi veya şifre.');
    }
  }

  /**
   * POST /api/v1/chat/message
   * Sohbet ekranından gönderilen mesajları işler ve Çift AI Motorunu tetikler.
   */
  async handleChatMessage(userId: string, userMessage: string, clientIp: string): Promise<APIResponse | APIErrorResponse> {
    // 1. Girdi Temizleme (Sanitization)
    const cleanMessage = sanitizeInput(userMessage);
    if (!cleanMessage) {
      return sendError(ErrorCodes.SYSTEM_UNEXPECTED, 'Mesaj içeriği boş olamaz.');
    }

    try {
      // 2. Kullanıcı Veritabanı Bilgilerini Getir
      const user = await this.dbAdapter.findById(userId);
      const profile = await this.dbAdapter.findProfileByUserId(userId);
      const lessons = await this.dbAdapter.findAllByUserId(userId);

      if (!user || !profile) {
        return sendError(ErrorCodes.USER_NOT_FOUND, 'Öğrenci profili bulunamadı.');
      }

      // 3. Token Bütçe Kontrolü
      const wallet: any = { used_today: 4500, total_limit: 500000 }; // Mock Wallet
      if (!TokenEconomyEngine.checkBudgetLimit(wallet.used_today, wallet.total_limit)) {
        return sendError(ErrorCodes.TOKEN_INSUFFICIENT, 'Günlük yapay zekâ kullanım limitinizi aştınız.');
      }

      // 4. AI-1: Arka Planda Sessiz Profil Analiz Motoru (Çift AI)
      const profileUpdates = await this.aiEngine.runProfileAnalysis(cleanMessage, profile);
      if (Object.keys(profileUpdates).length > 0) {
        // Yeni bir öğrenme veya alışkanlık bilgisi keşfedilirse profili sessizce güncelle
        const updatedProfile: StudentProfileEntity = {
          ...profile,
          ...profileUpdates,
          updated_at: new Date(),
          version: profile.version + 1
        };
        await this.dbAdapter.saveProfile(updatedProfile);
        await this.dbAdapter.logAction(userId, 'profile_auto_updated_by_ai', profileUpdates, clientIp);
      }

      // 5. AI-2: Koç Motorundan Öğrenciye Özel Yanıt Üret
      const coachResponse = await this.aiEngine.runCoachEngine(profile, lessons, cleanMessage);

      // 6. İşlemi Günlüğe Kaydet ve Başarılı Yanıt Dön
      await this.dbAdapter.logAction(userId, 'chat_message_sent', { messageLength: cleanMessage.length }, clientIp);

      return sendSuccess({
        response: coachResponse,
        profileWasUpdated: Object.keys(profileUpdates).length > 0
      }, 'Yapay zekâ koç yanıtı başarıyla üretildi.');

    } catch (err) {
      return sendError(ErrorCodes.AI_API_ERROR, 'AI motoru yanıt üretirken beklenmeyen bir hata ile karşılaştı.');
    }
  }

  /**
   * GET /api/v1/profile/settings
   * 50+ Öğrenci profil alanını getirir.
   */
  async handleGetSettings(userId: string): Promise<APIResponse | APIErrorResponse> {
    try {
      const profile = await this.dbAdapter.findProfileByUserId(userId);
      if (!profile) {
        return sendError(ErrorCodes.USER_NOT_FOUND, 'Öğrenci profil ayarları bulunamadı.');
      }
      return sendSuccess(profile);
    } catch (err) {
      return sendError(ErrorCodes.SYSTEM_UNEXPECTED, 'Ayarlar yüklenirken bir hata oluştu.');
    }
  }

  /**
   * PUT /api/v1/profile/settings
   * Kullanıcının profil alanlarını el ile güncellemesini sağlar.
   */
  async handleUpdateSettings(userId: string, newSettings: Partial<StudentProfileEntity>): Promise<APIResponse | APIErrorResponse> {
    try {
      const currentProfile = await this.dbAdapter.findProfileByUserId(userId);
      if (!currentProfile) {
        return sendError(ErrorCodes.USER_NOT_FOUND, 'Öğrenci profil ayarları bulunamadı.');
      }

      const updatedProfile: StudentProfileEntity = {
        ...currentProfile,
        ...newSettings,
        updated_at: new Date(),
        version: currentProfile.version + 1
      };

      const saved = await this.dbAdapter.saveProfile(updatedProfile);
      await this.dbAdapter.logAction(userId, 'settings_manually_updated', { updatedFields: Object.keys(newSettings) });
      return sendSuccess(saved, 'Profil ayarlarınız başarıyla kaydedildi.');
    } catch (err) {
      return sendError(ErrorCodes.SYSTEM_UNEXPECTED, 'Ayarlar kaydedilirken bir hata oluştu.');
    }
  }
}
