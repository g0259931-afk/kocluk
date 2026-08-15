/**
 * @file tests/backend.test.ts
 * @description Backend API Sunucusunun entegrasyon ve endpoint testleri.
 * BackendApiService dispatcher'ının authentication, profile, lessons ve chat/message endpointlerini sınar.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { BackendApiService } from '@saas-coach/backend';
import { ErrorCodes } from '@saas-coach/utils';

describe('Backend API Gateway Integration Tests', () => {
  test('POST /api/v1/auth/login - Başarılı giriş senaryosu', async () => {
    // Neden: Kullanıcı giriş endpoint'inin geçerli e-posta ve şifre ile başarılı oturum döndürdüğünü doğrulamak için.
    const response = await BackendApiService.request(
      '/api/v1/auth/login',
      'POST',
      { email: 'student@example.com', password: 'Password123!' }
    );

    assert.strictEqual(response.success, true, 'Giriş başarılı dönmelidir');
    assert.ok(response.data.token, 'Yanıt oturum token içermelidir');
    assert.strictEqual(response.message, 'Giriş başarılı.');
  });

  test('POST /api/v1/auth/login - Eksik bilgilerde hata dönmelidir', async () => {
    // Neden: Eksik parametrelerle yapılan isteklerde API error response formatında standart hata verilmesini sınamak için.
    const response = await BackendApiService.request(
      '/api/v1/auth/login',
      'POST',
      { email: '' }
    );

    assert.strictEqual(response.success, false, 'İstek başarısız olmalıdır');
    assert.strictEqual(response.error.code, ErrorCodes.AUTH_INVALID_CREDENTIALS);
  });

  test('GET /api/v1/profile/settings - Kullanıcı profilini getirmelidir', async () => {
    // Neden: Öğrencinin ayarlar ve profil verilerinin API üzerinden erişilebilir olmasını garanti etmek için.
    const response = await BackendApiService.request(
      '/api/v1/profile/settings',
      'GET',
      null,
      'default_student_user'
    );

    assert.strictEqual(response.success, true);
    assert.ok(response.data, 'Profil verisi dönmelidir');
    assert.strictEqual(response.data.user_id, 'default_student_user');
  });

  test('POST /api/v1/chat/message - Sessiz çift AI akışı ve otomatik profil güncellemesi', async () => {
    // Neden: Kullanıcı sohbet mesajı attığında AI-1'in profili sessizce güncelleyip AI-2'nin yanıt üretmesini sınamak için.
    const userMsg = 'Ben sabahları erken kalkıp çalışmayı seviyorum, en büyük hedefim Cerrahpaşa Tıp Fakültesi.';

    const response = await BackendApiService.request(
      '/api/v1/chat/message',
      'POST',
      { message: userMsg },
      'default_student_user'
    );

    assert.strictEqual(response.success, true, 'Sohbet isteği başarılı olmalıdır');
    assert.ok(response.data.response, 'AI koç yanıtı üretilmiş olmalıdır');
    assert.ok(response.data.newProfile, 'Güncellenmiş öğrenci profili yanıt içinde bulunmalıdır');
    assert.strictEqual(response.data.newProfile.prefers_morning, true, 'Sabah çalışma tercihi otomotik güncellenmelidir');
    assert.strictEqual(response.data.newProfile.target_department, 'Tıp Fakültesi', 'Hedef bölüm otomatik güncellenmelidir');
  });
});
