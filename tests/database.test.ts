/**
 * @file tests/database.test.ts
 * @description Veritabanı yönetim sisteminin (Database Management System) doğruluğunu denetleyen test dosyası.
 * SimulatedDatabaseStore ve SupabaseDbAdapter bileşenlerinin veri ekleme, güncelleme,
 * soft delete (silinen_at) ve denetim günlüğü (Audit Log) mekanizmalarını test eder.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  SimulatedDatabaseStore,
  SupabaseDbAdapter,
  DatabaseFactory
} from '../packages/database/index';
import { UserEntity, LessonEntity, UserRole } from '@saas-coach/types';

describe('Database Abstraction Layer & Store - Birim ve Entegrasyon Testleri', () => {
  const dbAdapter = new SupabaseDbAdapter();
  const testUserId = 'default_student_user';

  // Bootstrapping doğrulaması
  test('SimulatedDatabaseStore - Başlangıçta varsayılan kullanıcı, profil ve ders verilerini yüklemelidir', () => {
    // Neden: Çevrimdışı/Simüle ortamın düzgün başlaması, testlerin ve yerel geliştirme süreçlerinin kararlılığı için zorunludur.
    assert.ok(SimulatedDatabaseStore.users.size > 0);
    assert.ok(SimulatedDatabaseStore.profiles.has(testUserId));
    assert.ok(SimulatedDatabaseStore.lessons.has(testUserId));
  });

  // Kullanıcı işlemleri
  test('SupabaseDbAdapter - Kullanıcıyı id ile bulabilmeli ve kaydedebilmelidir', async () => {
    // Neden: Kullanıcı bilgileri ve rolleri (RBAC) her istekte ve yetki kontrolünde veritabanından çekilir.
    const user = await dbAdapter.findById(testUserId);
    assert.ok(user);
    assert.strictEqual(user.id, testUserId);
    assert.strictEqual(user.email, 'student@example.com');

    // Kullanıcı güncelleme
    const updatedUser: UserEntity = {
      ...user,
      firstName: 'Sahin Updated'
    };
    const savedUser = await dbAdapter.saveUser(updatedUser);
    assert.strictEqual(savedUser.firstName, 'Sahin Updated');
    assert.strictEqual(savedUser.version, user.version + 1);
  });

  // Soft Delete doğrulaması
  test('SupabaseDbAdapter - Kullanıcı silme işleminde doğrudan silmek yerine Soft Delete uygulamalıdır', async () => {
    // Neden: Yanlışlıkla silinen veya geri yüklenmesi gereken kullanıcıların verileri Soft Delete (deleted_at) ile korunmalıdır.
    const tempUserId = 'temp_user_id_123';
    const tempUser: UserEntity = {
      id: tempUserId,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      created_by: 'system',
      updated_by: 'system',
      version: 1,
      status: 'active',
      email: 'temp@example.com',
      firstName: 'Gecici',
      lastName: 'Kullanici',
      role: UserRole.FREE_USER,
      emailVerified: true
    };

    SimulatedDatabaseStore.users.set(tempUserId, tempUser);

    // Soft delete yapılıyor
    await dbAdapter.deleteUserSoft(tempUserId);

    const deletedUser = SimulatedDatabaseStore.users.get(tempUserId);
    assert.ok(deletedUser);
    assert.ok(deletedUser.deleted_at instanceof Date); // Silinme tarihi kaydedilmiş olmalıdır

    // findById artık silinmiş kullanıcıyı dönmemelidir
    const searchResult = await dbAdapter.findById(tempUserId);
    assert.strictEqual(searchResult, null);
  });

  // Öğrenci Profili İşlemleri
  test('SupabaseDbAdapter - Öğrenci profilini getirebilmeli ve güncelleyebilmelidir', async () => {
    // Neden: Student Profile Engine, 50+ alanı tutan sistemin kalbidir. Profil okuma ve yazma işlemleri hatasız olmalıdır.
    const profile = await dbAdapter.findProfileByUserId(testUserId);
    assert.ok(profile);
    assert.strictEqual(profile.user_id, testUserId);
    assert.strictEqual(profile.strongest_lesson, 'Matematik');

    // Profil alanını güncelle
    const updatedProfile = {
      ...profile,
      strongest_lesson: 'Geometri',
      target_net_score: 115
    };

    const savedProfile = await dbAdapter.saveProfile(updatedProfile);
    assert.strictEqual(savedProfile.strongest_lesson, 'Geometri');
    assert.strictEqual(savedProfile.target_net_score, 115);
    assert.strictEqual(savedProfile.version, profile.version + 1);
  });

  // Ders ve Konu Hiyerarşisi İşlemleri
  test('SupabaseDbAdapter - Kullanıcıya ait dersleri getirmeli, yeni ders eklemeli ve soft delete yapabilmelidir', async () => {
    // Neden: Ders yönetimi hiyerarşik olup, öğrencilerin kendi müfredatlarını yönetmelerini sağlar.
    const lessons = await dbAdapter.findAllByUserId(testUserId);
    const initialCount = lessons.length;

    const newLesson: LessonEntity = {
      id: 'lesson_test_999',
      user_id: testUserId,
      name: 'Biyoloji',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      status: 'not_started'
    };

    const saved = await dbAdapter.saveLesson(newLesson);
    assert.strictEqual(saved.name, 'Biyoloji');

    const updatedLessons = await dbAdapter.findAllByUserId(testUserId);
    assert.strictEqual(updatedLessons.length, initialCount + 1);

    // Soft Delete yapılıyor
    await dbAdapter.deleteLessonSoft('lesson_test_999');

    const finalLessons = await dbAdapter.findAllByUserId(testUserId);
    assert.strictEqual(finalLessons.length, initialCount); // Biyoloji filtrelenmiş olmalıdır
  });

  // Audit Log testleri
  test('SupabaseDbAdapter - Yapılan kritik işlemleri audit loglarına kaydetmelidir', async () => {
    // Neden: Güvenlik, uyumluluk (KVKK) ve hata izleme amacıyla her kritik işlem IP ve tarayıcı bilgisiyle denetlenmelidir.
    const initialLogsLength = SimulatedDatabaseStore.auditLogs.length;

    await dbAdapter.logAction(
      testUserId,
      'password_change_requested',
      { channel: 'email' },
      '192.168.1.1',
      'Chrome - Test Browser'
    );

    assert.strictEqual(SimulatedDatabaseStore.auditLogs.length, initialLogsLength + 1);

    const lastLog = SimulatedDatabaseStore.auditLogs[SimulatedDatabaseStore.auditLogs.length - 1];
    assert.strictEqual(lastLog.userId, testUserId);
    assert.strictEqual(lastLog.action, 'password_change_requested');
    assert.strictEqual(lastLog.ip, '192.168.1.1');
    assert.strictEqual(lastLog.browser, 'Chrome - Test Browser');
  });

  // Factory Deseni testi
  test('DatabaseFactory - Seçilen sağlayıcı tipine göre uygun adaptör nesnesini oluşturmalıdır', () => {
    // Neden: Gelecekte Supabase'den VPS / yerel PostgreSQL sunucusuna geçişi (VPS Migration Plan) kolaylaştırmak için soyutlanır.
    const supabaseAdapter = DatabaseFactory.create('supabase');
    const localAdapter = DatabaseFactory.create('local');

    assert.ok(supabaseAdapter instanceof SupabaseDbAdapter);
    assert.ok(localAdapter instanceof SupabaseDbAdapter); // Yerel adaptör de aynı tabandan miras almalıdır
  });
});
