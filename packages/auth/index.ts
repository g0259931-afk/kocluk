/**
 * @file packages/auth/index.ts
 * @description Kimlik doğrulama soyutlama katmanı (Auth Abstraction Layer).
 * Firebase Auth, Custom JWT, Keycloak veya Supabase Auth gibi sağlayıcılar bu arayüzü (Interface) uygular.
 */

import { UserEntity, UserRole } from '@saas-coach/types';

/**
 * Kullanıcı oturum bilgisi şeması.
 */
export interface AuthSession {
  userId: string;
  email: string;
  role: UserRole;
  permissions: string[];
  token: string;
  expiresAt: number;
}

/**
 * Kimlik doğrulama servis arayüzü (IAuthService).
 * Clean Architecture gereği uygulamanın geri kalan kısmı yalnızca bu arayüze bağımlıdır.
 */
export interface IAuthService {
  /**
   * E-posta ve şifre ile yeni kullanıcı kaydı oluşturur.
   */
  signUpWithEmail(email: string, password: string, firstName: string, lastName: string): Promise<UserEntity>;

  /**
   * E-posta ve şifre ile sisteme giriş yapar ve aktif oturum (Session) döner.
   */
  signInWithEmail(email: string, password: string): Promise<AuthSession>;

  /**
   * Google hesabı ile tek tıkla giriş yapar.
   */
  signInWithGoogle(idToken: string): Promise<AuthSession>;

  /**
   * Aktif oturumu sonlandırır.
   */
  signOut(userId: string): Promise<void>;

  /**
   * E-posta doğrulama bağlantısı gönderir.
   */
  sendEmailVerification(userId: string): Promise<void>;

  /**
   * Şifre sıfırlama bağlantısı gönderir.
   */
  sendPasswordResetEmail(email: string): Promise<void>;

  /**
   * Mevcut aktif oturumu doğrular ve bilgileri getirir.
   */
  validateSession(token: string): Promise<AuthSession | null>;
}

// --- PROVIDER ADAPTERS ---

/**
 * Firebase Authentication sağlayıcı adaptörü (Firebase Auth Adapter).
 * Teknik şartname gereği başlangıçta bu adaptör varsayılan olarak kullanılır.
 */
export class FirebaseAuthAdapter implements IAuthService {
  async signUpWithEmail(email: string, password: string, firstName: string, lastName: string): Promise<UserEntity> {
    // Firebase SDK üzerinden kayıt simülasyonu
    // Gerçek uygulamada firebaseAdmin.auth().createUser(...) çağrılır.
    return {
      id: `fb_usr_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      created_by: 'system',
      updated_by: 'system',
      version: 1,
      status: 'active',
      email,
      firstName,
      lastName,
      role: UserRole.FREE_USER, // Yeni kayıt olanlar ücretsiz deneme sürümünde başlar
      emailVerified: false
    };
  }

  async signInWithEmail(email: string, password: string): Promise<AuthSession> {
    // Firebase signInWithEmailAndPassword simülasyonu
    return {
      userId: 'fb_usr_mock123',
      email,
      role: UserRole.FREE_USER,
      permissions: ['permission.user.read', 'permission.ai.use', 'permission.settings.update'],
      token: 'firebase_mock_token_xyz',
      expiresAt: Date.now() + 3600 * 1000 // 1 saat geçerli
    };
  }

  async signInWithGoogle(idToken: string): Promise<AuthSession> {
    return {
      userId: 'fb_usr_google_mock',
      email: 'google_user@gmail.com',
      role: UserRole.FREE_USER,
      permissions: ['permission.user.read', 'permission.ai.use', 'permission.settings.update'],
      token: `google_token_${idToken}`,
      expiresAt: Date.now() + 3600 * 1000
    };
  }

  async signOut(userId: string): Promise<void> {
    // Firebase oturum kapatma işlemi
    console.log(`[FirebaseAuth] User signed out: ${userId}`);
  }

  async sendEmailVerification(userId: string): Promise<void> {
    console.log(`[FirebaseAuth] Verification email sent to: ${userId}`);
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    console.log(`[FirebaseAuth] Password reset link sent to: ${email}`);
  }

  async validateSession(token: string): Promise<AuthSession | null> {
    if (token.startsWith('firebase_mock_')) {
      return {
        userId: 'fb_usr_mock123',
        email: 'student@example.com',
        role: UserRole.FREE_USER,
        permissions: ['permission.user.read', 'permission.ai.use', 'permission.settings.update'],
        token,
        expiresAt: Date.now() + 3600 * 1000
      };
    }
    return null;
  }
}

/**
 * Özel JWT tabanlı kimlik doğrulama adaptörü (Custom JWT Auth Adapter).
 * Firebase bağımlılığı kaldırılıp VPS'e taşınma aşamasında devreye girer.
 */
export class CustomJWTAuthAdapter implements IAuthService {
  async signUpWithEmail(email: string, password: string, firstName: string, lastName: string): Promise<UserEntity> {
    return {
      id: `jwt_usr_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      created_by: 'system',
      updated_by: 'system',
      version: 1,
      status: 'active',
      email,
      firstName,
      lastName,
      role: UserRole.FREE_USER,
      emailVerified: true // Lokal sistemde doğrudan doğrulanmış kabul edilebilir
    };
  }

  async signInWithEmail(email: string, password: string): Promise<AuthSession> {
    return {
      userId: 'jwt_usr_mock456',
      email,
      role: UserRole.FREE_USER,
      permissions: ['permission.user.read', 'permission.ai.use', 'permission.settings.update'],
      token: 'jwt_secure_token_abc',
      expiresAt: Date.now() + 24 * 3600 * 1000 // 24 saat geçerli
    };
  }

  async signInWithGoogle(idToken: string): Promise<AuthSession> {
    return {
      userId: 'jwt_usr_google',
      email: 'jwt_google@gmail.com',
      role: UserRole.FREE_USER,
      permissions: ['permission.user.read', 'permission.ai.use', 'permission.settings.update'],
      token: `jwt_google_${idToken}`,
      expiresAt: Date.now() + 24 * 3600 * 1000
    };
  }

  async signOut(userId: string): Promise<void> {
    console.log(`[CustomJWT] Session terminated for: ${userId}`);
  }

  async sendEmailVerification(userId: string): Promise<void> {
    console.log(`[CustomJWT] Verification mail sent: ${userId}`);
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    console.log(`[CustomJWT] Reset password sent: ${email}`);
  }

  async validateSession(token: string): Promise<AuthSession | null> {
    if (token.startsWith('jwt_secure_')) {
      return {
        userId: 'jwt_usr_mock456',
        email: 'jwt_student@example.com',
        role: UserRole.FREE_USER,
        permissions: ['permission.user.read', 'permission.ai.use', 'permission.settings.update'],
        token,
        expiresAt: Date.now() + 24 * 3600 * 1000
      };
    }
    return null;
  }
}

/**
 * Kimlik doğrulama servis fabrikası (Auth Service Factory).
 * Aktif kimlik doğrulama sağlayıcısını seçmemizi ve soyut bir şekilde kullanmamızı sağlar.
 */
export class AuthServiceFactory {
  static create(providerType: 'firebase' | 'custom'): IAuthService {
    if (providerType === 'firebase') {
      return new FirebaseAuthAdapter();
    }
    return new CustomJWTAuthAdapter();
  }
}
