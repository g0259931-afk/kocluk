/**
 * @file tests/utils.test.ts
 * @description Yardımcı fonksiyonlar (Utils) ve Ortak Sabitler (Shared) paketlerinin birim testleri.
 * Tarih biçimlendirme, süre hesaplama, e-posta doğrulaması, sanitization ve RBAC yetkilerini sınar.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  formatDateTurkish,
  formatStudyDuration,
  isValidEmail,
  sanitizeInput,
  generateProfileFingerprint,
  ErrorCodes
} from '@saas-coach/utils';
import { DesignTokens, getPermissionsByRole, OnboardingSteps } from '@saas-coach/shared';
import { UserRole } from '@saas-coach/types';

describe('Utils & Shared Package Unit Tests', () => {
  test('formatDateTurkish - Tarihleri Türkçe formata çevirmelidir', () => {
    // Neden: Kullanıcı arayüzünde gösterilecek tarihlerin Türkçe standartta olmasını sağlamak için.
    const date = new Date('2026-08-07T12:00:00Z');
    const formatted = formatDateTurkish(date);
    assert.strictEqual(formatted, '07.08.2026', 'Tarih GG.AA.YYYY formatında olmalıdır');

    assert.strictEqual(formatDateTurkish(null), '-', 'Null tarih için tire dönmelidir');
  });

  test('formatStudyDuration - Dakikayı saat ve dakika metnine dönüştürmelidir', () => {
    // Neden: Öğrencinin çalışma sürelerinin okunabilir Türkçe metne çevrilmesini teyit etmek için.
    assert.strictEqual(formatStudyDuration(150), '2 saat 30 dakika');
    assert.strictEqual(formatStudyDuration(60), '1 saat');
    assert.strictEqual(formatStudyDuration(45), '45 dakika');
    assert.strictEqual(formatStudyDuration(0), '0 dakika');
  });

  test('isValidEmail - E-posta formatını doğrulamalıdır', () => {
    // Neden: Giriş ve kayıt formlarında hatalı e-posta adreslerinin engellenmesini denetlemek için.
    assert.strictEqual(isValidEmail('student@example.com'), true);
    assert.strictEqual(isValidEmail('invalid-email'), false);
    assert.strictEqual(isValidEmail('@nodomain.com'), false);
  });

  test('sanitizeInput - HTML ve script etiketlerini temizlemelidir', () => {
    // Neden: XSS ve Script Injection saldırılarına karşı metinlerin güvenli hale getirildiğini doğrulamak için.
    const malicious = '<script>alert("hack")</script>';
    const sanitized = sanitizeInput(malicious);
    assert.strictEqual(sanitized, '&lt;script&gt;alert(&quot;hack&quot;)&lt;&#x2F;script&gt;');
  });

  test('generateProfileFingerprint - Profil nesnesi için hash üretmelidir', () => {
    // Neden: Profil alanları değişmediğinde AI Context Cache'inin aynen kullanılmasını sağlayan hash fonksiyonunu sınamak için.
    const profile = { name: 'Şahin', net: 85 };
    const hash1 = generateProfileFingerprint(profile);
    const hash2 = generateProfileFingerprint(profile);
    assert.ok(hash1.startsWith('hash_'), 'Fingerprint hash_ ön eki taşımalıdır');
    assert.strictEqual(hash1, hash2, 'Aynı nesne için aynı hash üretilmelidir');
  });

  test('Shared Design Tokens & RBAC Permissions', () => {
    // Neden: Tasarım sistemi renklerinin ve kullanıcı rol bazlı yetkilerinin doğru tanımlandığını doğrulamak için.
    assert.ok(DesignTokens.colors.primary, 'Primary renk tanımlı olmalıdır');

    const adminPerms = getPermissionsByRole(UserRole.ADMIN);
    assert.ok(adminPerms.includes('permission.ai.admin'), 'Admin AI yönetim yetkisine sahip olmalıdır');

    const freePerms = getPermissionsByRole(UserRole.FREE_USER);
    assert.strictEqual(freePerms.includes('permission.ai.admin'), false, 'Ücretsiz kullanıcı admin yetkisine sahip olmamalıdır');

    assert.strictEqual(OnboardingSteps.length, 8, 'Onboarding 8 adımdan oluşmalıdır');
  });
});
