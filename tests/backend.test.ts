/**
 * @file tests/backend.test.ts
 * @description SaaS Student Coach Platformu Backend API Gateway entegrasyon test dosyası.
 * Tüm REST API endpointlerinin (giriş, dersler, profil ayarları ve çift AI sohbet akışı)
 * girdi denetimleri, hata senaryoları ve doğru yanıt formatlama standartlarını test eder.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { BackendApiService } from '../apps/backend/index';
import { ErrorCodes } from '@saas-coach/utils';
import { SimulatedDatabaseStore } from '@saas-coach/database';

describe('Centralized Backend API - Entegrasyon Testleri', () => {
  const testUserId = 'default_student_user';

  // 1. Giriş Endpoint'i testleri (POST /api/v1/auth/login)
  test('POST /api/v1/auth/login - Doğru bilgiler girildiğinde geçerli bir session dönmelidir', async () => {
    // Neden: Kullanıcıların login olabilmesi ve yetkili JWT token alabilmesi uygulamanın giriş kapısıdır.
    const response = await BackendApiService.request(
      '/api/v1/auth/login',
      'POST',
      { email: 'student@example.com', password: 'password123' }
    );

    assert.strictEqual(response.success, true);
    assert.ok(response.data);
    assert.ok(response.data.token);
    assert.strictEqual(response.data.userId, 'fb_usr_mock123');
  });

  test('POST /api/v1/auth/login - Eksik bilgi girildiğinde uygun standart hata dönmelidir', async () => {
    // Neden: API standartlarına göre eksik girdilerde hata kodu (AUTH_001) ve açıklayıcı mesaj dönmelidir.
    const response = await BackendApiService.request(
      '/api/v1/auth/login',
      'POST',
      { email: '', password: '' }
    );

    assert.strictEqual(response.success, false);
    assert.strictEqual(response.error.code, ErrorCodes.AUTH_INVALID_CREDENTIALS);
    assert.ok(response.error.message.includes('zorunludur'));
  });

  // 2. Profil Ayarları testleri (GET & PUT /api/v1/profile/settings)
  test('GET /api/v1/profile/settings - Öğrencinin 50+ alan içeren profilini getirmelidir', async () => {
    // Neden: Dashboard ve Ayarlar ekranı yüklenirken kullanıcının özelleştirilmiş AI profil verileri çekilir.
    const response = await BackendApiService.request(
      '/api/v1/profile/settings',
      'GET',
      null,
      testUserId
    );

    assert.strictEqual(response.success, true);
    assert.strictEqual(response.data.user_id, testUserId);
    assert.strictEqual(response.data.city, 'İstanbul');
  });

  test('PUT /api/v1/profile/settings - Öğrencinin profil alanlarını güncelleyip sürümünü artırmalıdır', async () => {
    // Neden: Kullanıcı ayarlar sayfasından profilini el ile değiştirdiğinde, sürüm ve tarih alanları güncellenmelidir.
    const originalProfile = SimulatedDatabaseStore.profiles.get(testUserId);
    const originalVersion = originalProfile?.version || 1;

    const response = await BackendApiService.request(
      '/api/v1/profile/settings',
      'PUT',
      { city: 'Ankara', avg_daily_study_minutes: 300 },
      testUserId
    );

    assert.strictEqual(response.success, true);
    assert.strictEqual(response.data.city, 'Ankara');
    assert.strictEqual(response.data.avg_daily_study_minutes, 300);
    assert.strictEqual(response.data.version, originalVersion + 1);
  });

  // 3. Dersler testleri (GET & POST /api/v1/lessons)
  test('GET /api/v1/lessons - Kullanıcının aktif derslerini listelemelidir', async () => {
    // Neden: Ders yönetimi ekranında öğrencinin takip ettiği müfredat listelenir.
    const response = await BackendApiService.request(
      '/api/v1/lessons',
      'GET',
      null,
      testUserId
    );

    assert.strictEqual(response.success, true);
    assert.ok(Array.isArray(response.data));
    assert.ok(response.data.length > 0);
  });

  test('POST /api/v1/lessons - Yeni bir ders oluşturabilmelidir', async () => {
    // Neden: Öğrenci onboarding sihirbazında veya kontrol panelinde yeni bir ders ekleyebilmelidir.
    const response = await BackendApiService.request(
      '/api/v1/lessons',
      'POST',
      { name: 'Kimya' },
      testUserId
    );

    assert.strictEqual(response.success, true);
    assert.strictEqual(response.data.name, 'Kimya');
    assert.strictEqual(response.data.user_id, testUserId);
    assert.strictEqual(response.data.status, 'not_started');
  });

  // 4. Çift AI Sohbet Akışı (POST /api/v1/chat/message)
  test('POST /api/v1/chat/message - Mesaj gönderildiğinde Çift AI (AI-1 analiz + AI-2 koç) akışını tetiklemelidir', async () => {
    // Neden: Çift AI mimarisi, öğrenciyle sohbet ederken (AI-2) bir yandan da profilini sessizce günceller (AI-1).
    const msg = 'Matematik dersinde çok iyiyim ama hedefim Boğaziçi tıp fakültesi kazanmak, bunun için geceleri de çalışmaya karar verdim.';

    const response = await BackendApiService.request(
      '/api/v1/chat/message',
      'POST',
      { message: msg },
      testUserId
    );

    assert.strictEqual(response.success, true);
    assert.ok(response.data.response); // AI-2 Koç yanıtı üretilmiş olmalıdır
    assert.ok(response.data.profileUpdates); // AI-1 profil güncellemesi algılamış olmalıdır

    // AI-1 çıkarımlarını doğrula
    const updates = response.data.profileUpdates;
    assert.strictEqual(updates.strongest_lesson, 'Matematik');
    assert.strictEqual(updates.prefers_night, true);
    assert.strictEqual(updates.prefers_morning, false);
    assert.strictEqual(updates.target_department, 'Tıp Fakültesi');
    assert.strictEqual(updates.target_university, 'Boğaziçi Üniversitesi');

    // Güncellenmiş profilin store'a başarıyla yazıldığını doğrula
    const updatedProfile = SimulatedDatabaseStore.profiles.get(testUserId);
    assert.strictEqual(updatedProfile?.strongest_lesson, 'Matematik');
    assert.strictEqual(updatedProfile?.prefers_night, true);
    assert.strictEqual(updatedProfile?.target_department, 'Tıp Fakültesi');
  });
});
