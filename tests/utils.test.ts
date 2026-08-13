/**
 * @file tests/utils.test.ts
 * @description Yardımcı fonksiyonların (Utilities) doğruluğunu ve sınır durumlarını sınayan birim testleri (Unit Tests).
 * `node:test` ve `node:assert` kütüphanelerini kullanarak yerel Node.js test koşturucusunu kullanır.
 * Her test fonksiyonu, MSS ve PRD kılavuzundaki Türkçe açıklama standardına uygun olarak belgelenmiştir.
 */

import test from 'node:test';
import assert from 'node:assert';
import {
  formatDateTurkish,
  formatStudyDuration,
  isValidEmail,
  sanitizeInput,
  generateProfileFingerprint
} from '../packages/utils/index';

test('formatDateTurkish - Geçerli ve geçersiz tarih biçimlendirmelerini doğrular', () => {
  // Geçerli bir tarih biçimi doğrulanıyor
  const validDate = new Date('2026-08-07T12:00:00Z');
  const result = formatDateTurkish(validDate);
  // Türkiye formatında "07.08.2026" olması beklenmektedir
  assert.strictEqual(result, '07.08.2026', 'Tarih formatı GG.AA.YYYY olmalıdır');

  // Geçersiz tarih girdisinde "-" dönmesi bekleniyor
  const invalidResult = formatDateTurkish('invalid-date-string');
  assert.strictEqual(invalidResult, '-', 'Geçersiz tarihler için "-" dönmelidir');

  // Boş girdide "-" dönmesi bekleniyor
  const nullResult = formatDateTurkish(null);
  assert.strictEqual(nullResult, '-', 'Null girdiler için "-" dönmelidir');
});

test('formatStudyDuration - Dakika bazlı süreleri Türkçe metne dönüştürür', () => {
  // Sadece dakika içeren durum
  assert.strictEqual(formatStudyDuration(45), '45 dakika', '60 dakikadan az süreler sadece dakika belirtmelidir');

  // Tam saati içeren durum
  assert.strictEqual(formatStudyDuration(120), '2 saat', 'Dakikasız tam saatler sadece saat belirtmelidir');

  // Saat ve dakika içeren durum
  assert.strictEqual(formatStudyDuration(135), '2 saat 15 dakika', 'Saat ve dakikası olan süreler ikisini de içermelidir');

  // Sıfır veya negatif durumlar
  assert.strictEqual(formatStudyDuration(0), '0 dakika', '0 dakika girdisi için "0 dakika" dönmelidir');
  assert.strictEqual(formatStudyDuration(-10), '0 dakika', 'Negatif süreler için de "0 dakika" dönmelidir');
});

test('isValidEmail - E-posta formatının geçerliliğini denetler', () => {
  // Geçerli e-posta adresleri
  assert.ok(isValidEmail('ogrenci@saas-coach.com'), 'Geçerli e-posta onaylanmalıdır');
  assert.ok(isValidEmail('sahin.arslan@gmail.com'), 'Noktalı e-posta adresi onaylanmalıdır');

  // Geçersiz e-posta adresleri
  assert.strictEqual(isValidEmail('gecersiz-email'), false, 'E-posta formatında olmayan girdiler reddedilmelidir');
  assert.strictEqual(isValidEmail('@domain.com'), false, 'Kullanıcı adı olmayan girdiler reddedilmelidir');
  assert.strictEqual(isValidEmail('kullanici@.com'), false, 'Geçersiz domainler reddedilmelidir');
});

test('sanitizeInput - Girdileri XSS ve HTML enjeksiyonuna karşı temizler', () => {
  const dirtyInput = '<script>alert("hack")</script>';
  const cleanInput = sanitizeInput(dirtyInput);

  // HTML tag'lerinin kaçış (escape) karakterlerine çevrilmesi bekleniyor
  assert.ok(!cleanInput.includes('<'), 'Script etiketleri (<) temizlenmelidir');
  assert.ok(!cleanInput.includes('>'), 'Script etiketleri (>) temizlenmelidir');
  assert.strictEqual(cleanInput, '&lt;script&gt;alert(&quot;hack&quot;)&lt;&#x2F;script&gt;', 'XSS koruması kaçış karakterleri tam uyumlu olmalıdır');
});

test('generateProfileFingerprint - Öğrenci profili için benzersiz fingerprint hash üretir', () => {
  const profile1 = { name: 'Şahin', school: 'YKS', target: 'Bogazici' };
  const profile2 = { name: 'Şahin', school: 'YKS', target: 'Bogazici' };
  const profile3 = { name: 'Şahin', school: 'YKS', target: 'ODTU' };

  const hash1 = generateProfileFingerprint(profile1);
  const hash2 = generateProfileFingerprint(profile2);
  const hash3 = generateProfileFingerprint(profile3);

  // Aynı içeriklerin aynı hash'i üretmesi bekleniyor (Kalıcı ve tutarlı fingerprint)
  assert.strictEqual(hash1, hash2, 'Aynı profiller aynı fingerprint hash değerini üretmelidir');

  // Farklı içeriklerin farklı hash üretmesi bekleniyor (Çakışmasızlık)
  assert.notStrictEqual(hash1, hash3, 'Farklı profiller farklı fingerprint hash değerleri üretmelidir');
  assert.ok(hash1.startsWith('hash_'), 'Hash öneki "hash_" ile başlamalıdır');
});
