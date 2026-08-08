/**
 * @file packages/utils/index.ts
 * @description Proje genelinde kullanılacak ortak yardımcı fonksiyonlar (Utilities).
 * Tarih biçimlendirme, veri doğrulama, metin temizleme ve hata yönetim araçları içerir.
 */

/**
 * Verilen tarih değerini "GG.AA.YYYY" formatında biçimlendirir.
 * @param date - Biçimlendirilecek tarih nesnesi veya string
 * @returns Biçimlendirilmiş Türkçe tarih metni
 */
export function formatDateTurkish(date: Date | string | null): string {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

/**
 * Çalışma süresini saat ve dakikaya çevirerek Türkçe metin üretir.
 * @param totalMinutes - Toplam çalışma dakikası
 * @returns "X saat Y dakika" şeklinde açıklayıcı metin
 */
export function formatStudyDuration(totalMinutes: number | null): string {
  if (!totalMinutes || totalMinutes <= 0) return '0 dakika';
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours} saat ${minutes} dakika`;
  } else if (hours > 0) {
    return `${hours} saat`;
  } else {
    return `${minutes} dakika`;
  }
}

/**
 * E-posta adresinin geçerli bir formatta olup olmadığını kontrol eder.
 * @param email - Denetlenecek e-posta metni
 * @returns Geçerliyse true, değilse false
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Metin içerisindeki tehlikeli karakterleri (HTML, script) temizler (Sanitization).
 * @param input - Güvenli hale getirilecek metin
 * @returns Güvenli metin (XSS korumalı)
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Belirli bir süre beklemeyi sağlayan asenkron delay yardımcı fonksiyonu.
 * @param ms - Beklenecek milisaniye süresi
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Güvenli ve benzersiz bir profil fingerprint hash'i üretir.
 * Profil alanlarının güncelliğini hızlıca kıyaslamak için SHA benzeri basit bir imza üretir.
 * @param profileObj - Öğrenci profili nesnesi
 * @returns Fingerprint hash metni
 */
export function generateProfileFingerprint(profileObj: Record<string, any>): string {
  const serialized = JSON.stringify(profileObj);
  let hash = 0;
  for (let i = 0; i < serialized.length; i++) {
    const char = serialized.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // 32-bit tamsayıya zorla
  }
  return `hash_${Math.abs(hash)}`;
}

/**
 * Hata kodları listesi (Teknik şartnameye uygun formatta).
 */
export const ErrorCodes = {
  AUTH_INVALID_CREDENTIALS: 'AUTH_001',
  AUTH_UNAUTHORIZED: 'AUTH_002',
  USER_NOT_FOUND: 'USER_001',
  CHAT_LIMIT_EXCEEDED: 'CHAT_004',
  TOKEN_INSUFFICIENT: 'TOKEN_001',
  PAYMENT_FAILED: 'PAYMENT_003',
  AI_API_ERROR: 'AI_006',
  SYSTEM_UNEXPECTED: 'SYSTEM_002'
};
