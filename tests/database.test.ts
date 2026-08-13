/**
 * @file tests/database.test.ts
 * @description Veritabanı adaptörleri, depo desenleri (Repository Pattern) ve veri mağazasını denetleyen testler.
 * `packages/database` altındaki SupabaseDbAdapter, LocalPostgresAdapter ve SimulatedDatabaseStore yapılarını sınar.
 */

import test from 'node:test';
import assert from 'node:assert';
import { DatabaseFactory, SimulatedDatabaseStore, SupabaseDbAdapter } from '../packages/database/index';
import { UserEntity, UserRole, StudentProfileEntity, LessonEntity } from '../packages/types/index';

test('SimulatedDatabaseStore - Başlangıç verilerinin (bootstrap) doğru yüklendiğini sınar', () => {
  // İlk veri yükleme durumları doğrulanıyor
  assert.ok(SimulatedDatabaseStore.users.size > 0, 'Veritabanı mağazasında en az bir varsayılan kullanıcı bulunmalıdır');
  assert.ok(SimulatedDatabaseStore.profiles.has('default_student_user'), 'Varsayılan öğrenci profili yüklü olmalıdır');

  const defaultProfile = SimulatedDatabaseStore.profiles.get('default_student_user');
  assert.strictEqual(defaultProfile?.preferred_address, 'Şahin', 'Varsayılan profil hitap ismi Şahin olmalıdır');
});

test('SupabaseDbAdapter - CRUD ve yumuşak silme (Soft Delete) işlemlerini doğrular', async () => {
  const adapter = new SupabaseDbAdapter();
  const userId = `test_usr_${Math.random().toString(36).substr(2, 5)}`;

  // 1. Kullanıcı Kaydetme (Create/Update)
  const newUser: UserEntity = {
    id: userId,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    created_by: 'system',
    updated_by: 'system',
    version: 1,
    status: 'active',
    email: 'test_db_user@example.com',
    firstName: 'Deneme',
    lastName: 'Kullanıcı',
    role: UserRole.FREE_USER,
    emailVerified: false
  };

  const savedUser = await adapter.saveUser(newUser);
  assert.strictEqual(savedUser.id, userId, 'Kaydedilen kullanıcı kimliği doğru dönmelidir');
  assert.strictEqual(savedUser.version, 2, 'Kullanıcı sürümü (version) kaydedildiğinde 1 artırılmalıdır (Audit/Versioning)');

  // 2. Kullanıcıyı ID ile Sorgulama (Read)
  const foundUser = await adapter.findById(userId);
  assert.ok(foundUser, 'Oluşturulan kullanıcı veritabanında bulunabilmelidir');
  assert.strictEqual(foundUser.email, 'test_db_user@example.com', 'Kullanıcı e-postası doğru eşleşmelidir');

  // 3. Kullanıcıyı E-posta ile Sorgulama (Read)
  const foundByEmail = await adapter.findByEmail('test_db_user@example.com');
  assert.ok(foundByEmail, 'E-posta ile sorgulama çalışmalıdır');
  assert.strictEqual(foundByEmail.id, userId, 'Sorgulanan kullanıcının ID değeri doğru olmalıdır');

  // 4. Öğrenci Profili Kaydetme ve Sorgulama
  const newProfile: StudentProfileEntity = {
    id: `profile_${userId}`,
    user_id: userId,
    created_at: new Date(),
    updated_at: new Date(),
    version: 1,
    profile_hash: 'hash_test_456',
    school_level: 'YKS',
    target_exam: 'YKS Sayısal',
    target_university: 'İTÜ',
    target_department: 'Yazılım Mühendisliği',
    avg_daily_study_minutes: 180,
    strongest_lesson: 'Matematik',
    weakest_lesson: 'Kimya',
    emoji_allowed: true,
    confidence_scores: { strongest_lesson: 90, weakest_lesson: 70 }
  };

  const savedProfile = await adapter.saveProfile(newProfile);
  assert.strictEqual(savedProfile.version, 2, 'Profil sürümlenmesi düzgün çalışmalıdır');

  const foundProfile = await adapter.findProfileByUserId(userId);
  assert.ok(foundProfile, 'Profil kullanıcı ID değerine göre okunabilmelidir');
  assert.strictEqual(foundProfile.target_university, 'İTÜ', 'Profil üniversite hedefi doğru kaydedilmiş olmalıdır');

  // 5. Ders Ekleme, Sorgulama ve Yumuşak Silme (Soft Delete)
  const lessonId = `lesson_${Math.random().toString(36).substr(2, 5)}`;
  const newLesson: LessonEntity = {
    id: lessonId,
    user_id: userId,
    name: 'Geometri',
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    status: 'not_started'
  };

  await adapter.saveLesson(newLesson);
  const userLessons = await adapter.findAllByUserId(userId);
  assert.strictEqual(userLessons.length, 1, 'Eklenen ders listede görünmelidir');
  assert.strictEqual(userLessons[0].name, 'Geometri', 'Ders adı eşleşmelidir');

  // Yumuşak silme uygulanıyor (Soft Delete - Section 54)
  await adapter.deleteLessonSoft(lessonId);
  const afterDeleteLessons = await adapter.findAllByUserId(userId);
  assert.strictEqual(afterDeleteLessons.length, 0, 'Yumuşak silinen ders aktif listelemelerde dönmemelidir');

  // 6. Audit Log (Section 55)
  const initialLogCount = SimulatedDatabaseStore.auditLogs.length;
  await adapter.logAction(userId, 'test_action_run', { test: true }, '192.168.1.1', 'Chrome/NodeTest');
  assert.strictEqual(SimulatedDatabaseStore.auditLogs.length, initialLogCount + 1, 'Audit log işlem geçmişine başarıyla eklenmelidir');

  const lastLog = SimulatedDatabaseStore.auditLogs[SimulatedDatabaseStore.auditLogs.length - 1];
  assert.strictEqual(lastLog.action, 'test_action_run', 'Audit log aksiyon adı doğru olmalıdır');
  assert.strictEqual(lastLog.ip, '192.168.1.1', 'Audit log IP kaydı doğru saklanmalıdır');
});

test('DatabaseFactory - Doğru veritabanı adaptörlerini döndürür', () => {
  const adapter = DatabaseFactory.create('supabase');
  assert.ok(adapter instanceof SupabaseDbAdapter, 'Supabase seçildiğinde SupabaseDbAdapter döndürülmelidir');
});
