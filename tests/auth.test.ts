/**
 * @file tests/auth.test.ts
 * @description Kimlik doğrulama sisteminin (Auth System) doğruluğunu denetleyen birim testleri.
 * JWT token üretimi, HMAC-SHA256 imzası, constant-time imza karşılaştırma koruması (timingSafeEqual)
 * ve session doğrulama adımlarının güvenliğini ve doğruluğunu test eder.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { CryptoJwtEngine, FirebaseAuthAdapter } from '../packages/auth/index';
import { UserRole } from '@saas-coach/types';

describe('Auth Security & JWT - Birim Testleri', () => {
  // JWT İmzası ve Doğrulaması
  test('CryptoJwtEngine - Geçerli bir payload imzalayıp başarıyla doğrulayabilmelidir', () => {
    // Neden: Güvenli JWT üretimi, oturumların sunucu ve istemci arasında güvenli taşınmasını sağlar.
    const payload = { userId: 'sahin_123', email: 'sahin@example.com', role: UserRole.PREMIUM_USER };
    const token = CryptoJwtEngine.sign(payload, 3600); // 1 saat geçerli

    assert.ok(token);
    assert.strictEqual(token.split('.').length, 3); // JWT formatı: header.payload.signature

    const verified = CryptoJwtEngine.verify(token);
    assert.ok(verified);
    assert.strictEqual(verified.userId, 'sahin_123');
    assert.strictEqual(verified.email, 'sahin@example.com');
    assert.strictEqual(verified.role, UserRole.PREMIUM_USER);
  });

  test('CryptoJwtEngine - Değiştirilmiş / Manipüle edilmiş token imzasını reddetmelidir', () => {
    // Neden: Timing-attack ve token taklidi saldırılarını (tampering) önlemek için imza doğrulaması tam çalışmalıdır.
    const payload = { userId: 'sahin_123' };
    const token = CryptoJwtEngine.sign(payload, 3600);

    const parts = token.split('.');
    // İmzayı kasıtlı olarak bozuyoruz
    const corruptedToken = `${parts[0]}.${parts[1]}.gecersizimza123`;

    const verified = CryptoJwtEngine.verify(corruptedToken);
    assert.strictEqual(verified, null);
  });

  test('CryptoJwtEngine - Süresi dolmuş tokenları geçersiz saymalıdır', async () => {
    // Neden: Güvenlik politikaları gereği süresi dolan oturumların sisteme erişimi engellenmelidir.
    const payload = { userId: 'sahin_123' };
    // 0 saniye süreli token üretiyoruz (anında geçersiz)
    const token = CryptoJwtEngine.sign(payload, -10);

    const verified = CryptoJwtEngine.verify(token);
    assert.strictEqual(verified, null);
  });

  // FirebaseAuthAdapter Testleri
  test('FirebaseAuthAdapter - E-posta ile kayıt adımı yeni bir kullanıcı entity oluşturmalıdır', async () => {
    // Neden: Onboarding veya normal kayıt akışında Firebase entegrasyonu soyutlanmış şekilde çalışmalıdır.
    const adapter = new FirebaseAuthAdapter();
    const newUser = await adapter.signUpWithEmail(
      'yeni_ogrenci@example.com',
      'Secur3Pass123!',
      'Deniz',
      'Yılmaz'
    );

    assert.ok(newUser);
    assert.ok(newUser.id.startsWith('fb_usr_'));
    assert.strictEqual(newUser.email, 'yeni_ogrenci@example.com');
    assert.strictEqual(newUser.firstName, 'Deniz');
    assert.strictEqual(newUser.role, UserRole.FREE_USER);
  });

  test('FirebaseAuthAdapter - Giriş adımı geçerli bir JWT session oluşturmalı ve doğrulamalıdır', async () => {
    // Neden: Oturum doğrulama akışı (session validation), her sayfa geçişinde ve API isteğinde çalışır.
    const adapter = new FirebaseAuthAdapter();
    const session = await adapter.signInWithEmail('ogrenci@example.com', 'parola123');

    assert.ok(session);
    assert.ok(session.token);
    assert.strictEqual(session.userId, 'fb_usr_mock123');

    // Sunucu tarafında oturumu doğrula
    const validatedSession = await adapter.validateSession(session.token);
    assert.ok(validatedSession);
    assert.strictEqual(validatedSession.userId, 'fb_usr_mock123');
    assert.strictEqual(validatedSession.email, 'ogrenci@example.com');
  });
});
