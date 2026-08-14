/**
 * @file tests/utils.test.ts
 * @description Yardımcı fonksiyonların (Utilities) doğruluğunu test eden unit test dosyası.
 * Projedeki tarih biçimlendirme, süre hesaplama, girdi temizleme (XSS) ve e-posta
 * kontrolü gibi kritik araçların doğru çalışıp çalışmadığını doğrular.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  formatDateTurkish,
  formatStudyDuration,
  isValidEmail,
  sanitizeInput,
  generateProfileFingerprint
} from '../packages/utils/index';

describe('Utility Helpers - Birim Testleri', () => {
  // Tarih biçimlendirici testleri
  test('formatDateTurkish - Geçerli tarih nesnesini Türkçe formatına çevirmelidir', () => {
    // Neden: Kullanıcı arayüzünde tarihlerin tutarlı ve GG.AA.YYYY standardında olması istenir.
    const date = new Date('2026-08-07T12:00:00Z');
    const formatted = formatDateTurkish(date);
    assert.strictEqual(formatted, '07.08.2026');
  });

  test('formatDateTurkish - Null veya geçersiz tarihte "-" dönmelidir', () => {
    // Neden: Boş veri durumlarında uygulamanın çökmesi engellenmeli ve güvenli bir varsayılan değer sunulmalıdır.
    assert.strictEqual(formatDateTurkish(null), '-');
    assert.strictEqual(formatDateTurkish('gecersiz-tarih-str'), '-');
  });

  // Çalışma süresi biçimlendirici testleri
  test('formatStudyDuration - Dakikaları doğru saat ve dakikaya dönüştürmelidir', () => {
    // Neden: Öğrencinin çalışma süreleri arayüzde okunabilir şekilde (Örn: "2 saat 30 dakika") gösterilmelidir.
    assert.strictEqual(formatStudyDuration(150), '2 saat 30 dakika');
    assert.strictEqual(formatStudyDuration(120), '2 saat');
    assert.strictEqual(formatStudyDuration(45), '45 dakika');
    assert.strictEqual(formatStudyDuration(0), '0 dakika');
    assert.strictEqual(formatStudyDuration(null), '0 dakika');
  });

  // E-posta doğrulama testleri
  test('isValidEmail - E-posta adreslerini doğru doğrulamalıdır', () => {
    // Neden: Kayıt ve giriş adımlarında geçersiz e-posta girişleri en başta elenerek gereksiz sunucu istekleri engellenmelidir.
    assert.strictEqual(isValidEmail('sahin@example.com'), true);
    assert.strictEqual(isValidEmail('sahin.arslan@edu.tr'), true);
    assert.strictEqual(isValidEmail('sahin@com'), false);
    assert.strictEqual(isValidEmail('sahin.com'), false);
    assert.strictEqual(isValidEmail('@example.com'), false);
  });

  // Girdi temizleme (Sanitization) testleri
  test('sanitizeInput - HTML ve Script karakterlerini temizlemelidir (XSS Koruması)', () => {
    // Neden: OWASP güvenlik kurallarına uygun olarak kullanıcı girdilerinden gelebilecek XSS saldırıları filtrelenmelidir.
    const dirty = '<script>alert("hack")</script>';
    const clean = sanitizeInput(dirty);
    assert.strictEqual(clean.includes('<script>'), false);
    assert.strictEqual(clean, '&lt;script&gt;alert(&quot;hack&quot;)&lt;&#x2F;script&gt;');
  });

  // Parmak izi (Profile Fingerprint) testleri
  test('generateProfileFingerprint - Aynı nesneler için aynı parmak izini üretmelidir', () => {
    // Neden: AI Context Cache optimizasyonu için profil değişiklikleri parmak izi üzerinden hızlıca kontrol edilir.
    const profileA = { name: 'Şahin', school: 'Lise', target: 'YKS' };
    const profileB = { name: 'Şahin', school: 'Lise', target: 'YKS' };
    const profileC = { name: 'Şahin', school: 'Lise', target: 'LGS' };

    const hashA = generateProfileFingerprint(profileA);
    const hashB = generateProfileFingerprint(profileB);
    const hashC = generateProfileFingerprint(profileC);

    assert.strictEqual(hashA, hashB);
    assert.notStrictEqual(hashA, hashC);
  });
});
